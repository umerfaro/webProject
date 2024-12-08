import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  let totDiscounted = 0;
  for (let item of cart.cartItems) {
    totDiscounted += item.price - (item.price * item.discount) / 100;
  }
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const totPrice = parseFloat(
    (
      (parseFloat(totDiscounted) || 0) +
      (parseFloat(cart.shippingPrice) || 0) +
      (parseFloat(cart.taxPrice) || 0)
    ).toFixed(2)
  );

  const dispatch = useDispatch();

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: totDiscounted,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: totPrice,
      }).unwrap();
      console.log(res);
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      <ProgressSteps step1 step2 step3 />

      <div className="container mx-auto mt-12 px-4">
        {cart.cartItems.length === 0 ? (
          <Message>Your cart is empty</Message>
        ) : (
          <div className="overflow-x-auto shadow-lg rounded-lg mb-8">
            <table className="w-full table-auto border-separate border-spacing-4">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Image</th>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Quantity</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.cartItems.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md shadow-md"
                      />
                    </td>
                    <td className="p-4">
                      <Link
                        to={`/product/${item.product}`}
                        className="text-blue-600 hover:underline"
                      >
                        {item.name}
                      </Link>
                    </td>
                    <td className="p-4">{item.qty}</td>
                    <td className="p-4">
                      $
                      {(
                        item.price -
                        (item.price * item.discount) / 100
                      ).toFixed(2)}
                    </td>
                    <td className="p-4">
                      $
                      {(
                        item.qty *
                        (item.price - (item.price * item.discount) / 100)
                      ).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-10 bg-gray-800 text-white p-8 rounded-lg shadow-xl">
          <h2 className="text-3xl font-semibold mb-6 text-center">
            Order Summary
          </h2>
          <div className="mb-4 space-y-2">
            <ul className="text-lg">
              <li>
                <span className="font-semibold">Items Price:</span> $
                {totDiscounted.toFixed(2)}
              </li>
              <li>
                <span className="font-semibold">Shipping Price:</span> $
                {cart.shippingPrice}
              </li>
              <li>
                <span className="font-semibold">Tax Price:</span> $
                {cart.taxPrice}
              </li>
              <li>
                <span className="font-semibold">Total Price:</span> $
                {totPrice.toFixed(2)}
              </li>
            </ul>
          </div>

          <h3 className="text-2xl font-semibold mt-8">Shipping Information</h3>
          <p className="mt-2">
            <strong>Address:</strong> {cart.shippingAddress.address},{" "}
            {cart.shippingAddress.city} {cart.shippingAddress.postalCode},{" "}
            {cart.shippingAddress.country}
          </p>

          {error && (
            <Message variant="danger" className="mt-4">
              {error.data.message}
            </Message>
          )}

          <button
            type="button"
            className="bg-pink-500 text-white py-3 px-6 rounded-full w-full text-lg mt-8 hover:bg-pink-600 transition duration-300"
            disabled={cart.cartItems.length === 0}
            onClick={placeOrderHandler}
          >
            Place Order
          </button>

          {isLoading && <Loader />}
        </div>
      </div>
    </>
  );
};

export default PlaceOrder;
