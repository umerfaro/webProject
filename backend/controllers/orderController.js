import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

// stripe integration
import stripe from "stripe";
const stripeInstance = stripe(
  "sk_test_51QPgYeAwPbCj24ytkM63o2v9mY6hwfYGzeoonI3BiWIAAE8dmzbg4VS4mdeyaDMo0jNgd3GqqDk9X0QjwyAIaveu00UYhC0aiN"
);

// Utility Function
function calcPrices(orderItems) {
  const itemsPrice = orderItems.reduce(
    (acc, item) =>
      acc + (item.price - (item.price * item.discount) / 100) * item.qty,
    0
  );
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxRate = 0.15;
  const taxPrice = (itemsPrice * taxRate).toFixed(2);
  const totalPrice = (
    itemsPrice +
    shippingPrice +
    parseFloat(taxPrice)
  ).toFixed(2);
  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice,
    totalPrice,
  };
}

// Create Order
const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    }
    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });
    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
      );
      if (!matchingItemFromDB) {
        res.status(404);
        throw new Error(`Product not found: ${itemFromClient._id}`);
      }
      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDB.price,
        _id: undefined,
      };
    });
    const uploadedByMap = {};
    itemsFromDB.forEach((item) => {
      const uploaderId = item.uploadedBy.toString();
      if (!uploadedByMap[uploaderId]) {
        uploadedByMap[uploaderId] = [];
      }
      uploadedByMap[uploaderId].push(item._id);
    });
    const uploadedBy = Object.keys(uploadedByMap).map((uploaderId) => ({
      uploaderId,
      products: uploadedByMap[uploaderId],
    }));
    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);
    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      uploadedBy,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Orders
const getAllOrders = async (req, res) => {
  try {
    if (req.user.isAdmin) {
      const orders = await Order.find({}).populate("user", "id username");
      return res.json(orders);
    }
    const orders = await Order.find({
      "uploadedBy.uploaderId": req.user._id,
    }).populate("user", "id username");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get all orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }); // Fetch orders by user ID
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get Order By ID
const countTotalOrders = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.json({ totalOrders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Calculate Total Sales
const calculateTotalSales = async (req, res) => {
  try {
    const orders = await Order.find();
    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    res.json({ totalSales });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Calculate Total Sales By Date
const calcualteTotalSalesByDate = async (req, res) => {
  try {
    const salesByDate = await Order.aggregate([
      {
        $match: {
          isPaid: true,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
          },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);

    res.json(salesByDate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark Order as Paid
const findOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// make sure order is paid
const markOrderAsPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      const totalAmount = req.body.totalAmount;
      const totalQuantity = req.body.totalQuantity;
      order.isPaid = true;
      order.paidAt = new Date();
      await order.save();
      const price = await stripeInstance.prices.create({
        unit_amount: totalAmount * 100,
        currency: "usd",
        product_data: {
          name: `Order #${req.params.id}`,
        },
      });
      const session = await stripeInstance.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: price.id,
            quantity: totalQuantity,
          },
        ],
        mode: "payment",
        success_url: `${process.env.FRONTEND_URL}/order/${req.params.id}`,
        cancel_url: `${process.env.FRONTEND_URL}`,
        client_reference_id: req.params.id,
      });
      res.status(200).json({ url: session.url });
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Mark Order as Delivered
const markOrderAsDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export the functions
export {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calcualteTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
};
