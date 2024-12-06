import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";
import Message from "../../components/Message"; // Custom component to display messages
import Loader from "../../components/Loader"; // Custom loader

const OrderHistoryPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  useEffect(() => {
    if (!userInfo) {
      navigate("/login"); // Redirect to login page if the user is not logged in
    }
  }, [userInfo, navigate]);

  return (
    <div className="container mx-auto p-4 mt-[5rem]">
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error.message}</Message>
      ) : (
        <div>
          <h1 className="text-2xl font-bold">Your Order History</h1>
          {orders.length === 0 ? (
            <Message>Your order history is empty.</Message>
          ) : (
            <table className="min-w-full mt-4">
              <thead className="bg-pink-500 text-white">
                <tr>
                  <th className="p-2 text-left">Order ID</th>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Total</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="p-2">{order._id}</td>
                    <td className="p-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-2">${order.totalPrice}</td>
                    <td className="p-2">{order.isPaid ? "Paid" : "Not Paid"}</td>
                    <td className="p-2">
                      <button
                        onClick={() => navigate(`/order/${order._id}`)}
                        className="text-blue-500 hover:underline"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
