import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

// stripe integration
import stripe from 'stripe';
const stripeInstance = stripe('sk_test_51QPgYeAwPbCj24ytkM63o2v9mY6hwfYGzeoonI3BiWIAAE8dmzbg4VS4mdeyaDMo0jNgd3GqqDk9X0QjwyAIaveu00UYhC0aiN');

// Utility Function
function calcPrices(orderItems) {
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
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

const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (orderItems && orderItems.length === 0) {
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

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } = calcPrices(dbOrderItems);

    // Fetch uploader from the first item (or any other logic you want to use)
    const uploadedBy = itemsFromDB[0].uploadedBy;

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      uploadedBy, // Store the uploader at the order level
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


const getAllOrders = async (req, res) => {
  try {
    // If the user is an admin, show all orders
    if (req.user.isAdmin) {
      const orders = await Order.find({}).populate("user", "id username");
      return res.json(orders);
    }

    // If the user is a seller, show only their orders
    const orders = await Order.find({ uploadedBy: req.user._id }).populate("user", "id username");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// const getAllOrders = async (req, res) => {
//   try {
//     if (req.user.isSeller) {
      
//         // If the user is a seller, show only their orders
//     const orders = await Order.find({ uploadedBy: req.user._id }).populate("user", "id username");
//     res.json(orders);
//     }

//     const orders = await Order.find({}).populate("user", "id username");
//     res.json(orders);


    

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }); // Fetch orders by user ID
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const countTotalOrders = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.json({ totalOrders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const calculateTotalSales = async (req, res) => {
  try {
    const orders = await Order.find();
    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    res.json({ totalSales });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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

const findOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    if (order.user.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: "You are not authorized to view this order" });
      return;
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const markOrderAsPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      const totalAmount = req.body.totalAmount;
      const totalQuantity = req.body.totalQuantity;

      // update order status
      order.isPaid = true;
      order.paidAt = new Date();
      await order.save();

      // Create the price in Stripe for the payment
      const price = await stripeInstance.prices.create({
        unit_amount: totalAmount * 100, 
        currency: 'usd',
        product_data: {
          name: `Order #${req.params.id}`, 
        },
      });

      // Create a Checkout Session with the price you just created
      const session = await stripeInstance.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: price.id,
            quantity: totalQuantity,
          },
        ],
        mode: 'payment',  
        success_url: `${process.env.FRONTEND_URL}/order/${req.params.id}`,  
        cancel_url: `${process.env.FRONTEND_URL}`, 
        client_reference_id: req.params.id, 
      });
      // update order details

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
