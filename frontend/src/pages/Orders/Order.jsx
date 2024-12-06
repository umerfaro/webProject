import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../../components/Message"; // Corrected import
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";

const Order = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPaPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  // Determine the user's role
  const isAdmin = userInfo?.isAdmin;
  const isSeller = userInfo?.isSeller;
  const isUser = userInfo && !isAdmin && !isSeller;

  useEffect(() => {
    if (!errorPayPal && !loadingPaPal && paypal?.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };

      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPaypalScript();
        }
      }
    }
  }, [errorPayPal, loadingPaPal, order, paypal, paypalDispatch]);

  const onApprove = async (data, actions) => {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details }).unwrap();
        refetch();
        toast.success("Order has been paid");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    });
  };

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [{ amount: { value: order.totalPrice.toFixed(2) } }],
      })
      .then((orderID) => {
        return orderID;
      });
  };

  const onError = (err) => {
    toast.error(err.message);
  };

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId).unwrap();
      refetch();
      toast.success("Order marked as delivered");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error?.data?.message || error.error}</Message>
  ) : (
    <div className="container mx-auto p-4 mt-[5rem] flex flex-col md:flex-row gap-8">
      {/* Order Items Section */}
      <div className="md:w-2/3">
        <div className="border border-black-300 p-4 rounded-lg bg-black">
          {order.orderItems.length === 0 ? (
            <Message>Order is empty</Message>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-pink-500 text-white">
                  <tr>
                    <th className="p-2 text-left">Image</th>
                    <th className="p-2 text-left">Product</th>
                   
                    <th className="p-2 text-center">Quantity</th>
                    <th className="p-2 text-center">Unit Price</th>
                    <th className="p-2 text-center">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="p-2">
                        <Link to={`/product/${item.product}`} className="text-white-600 hover:underline">
                          {item.name}
                        </Link>
                      </td>
                    
                      <td className="p-2 text-center">{item.qty}</td>
                      <td className="p-2 text-center">${item.price.toFixed(2)}</td>
                      <td className="p-2 text-center">${(item.qty * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Section */}
      <div className="md:w-1/3">
        {/* Shipping Information */}
        <div className="border border-black-300 p-4 rounded-lg bg-black mb-6">
          <h2 className="text-xl font-bold mb-2">Shipping</h2>
          <p className="mb-2">
            <strong className="text-pink-500">Order ID:</strong> {order._id}
          </p>
          <p className="mb-2">
            <strong className="text-pink-500">Name:</strong>{" "}
            {order.user ? order.user.username : "N/A"}
          </p>
          <p className="mb-2">
            <strong className="text-pink-500">Email:</strong>{" "}
            {order.user ? order.user.email : "N/A"}
          </p>
          <p className="mb-2">
            <strong className="text-pink-500">Address:</strong>{" "}
            {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>
          <p className="mb-2">
            <strong className="text-pink-500">Payment Method:</strong>{" "}
            {order.paymentMethod}
          </p>
          {order.isPaid ? (
            <Message variant="success">Paid on {new Date(order.paidAt).toLocaleDateString()}</Message>
          ) : (
            <Message variant="error">Not Paid</Message>
          )}
        </div>


        {/* Order Summary */}
        <div className="border border-gray-300 p-4 rounded-lg bg-black">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Items</span>
            <span>${order.itemsPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping</span>
            <span>${order.shippingPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Tax</span>
            <span>${order.taxPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-4 font-bold">
            <span>Total</span>
            <span>${order.totalPrice.toFixed(2)}</span>
          </div>

          {/* Payment Section - Visible Only to Regular Users */}
          {!order.isPaid && isUser && (
            <div className="mb-4">
              {loadingPay && <Loader />}
              {isPending ? (
                <Loader />
              ) : (
                <PayPalButtons
                  createOrder={createOrder}
                  onApprove={onApprove}
                  onError={onError}
                />
              )}
            </div>
          )}

          {/* Delivery Section - Visible Only to Admins */}
          {loadingDeliver && <Loader />}
          {isAdmin && order.isPaid && !order.isDelivered && (
            <button
              type="button"
              className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
              onClick={deliverHandler}
            >
              Mark As Delivered
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
