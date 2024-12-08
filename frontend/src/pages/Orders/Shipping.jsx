import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("Stripe");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  // Payment
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  return (
    <div className="bg-black min-h-screen py-10">
      <div className="container mx-auto mt-10">
        <ProgressSteps step1 step2 />
        <div className="mt-12 flex justify-center items-center flex-wrap">
          <form
            onSubmit={submitHandler}
            className="bg-white p-8 rounded-lg shadow-lg w-full max-w-[450px]"
          >
            <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
              Shipping Address
            </h1>

            {/* Address Field */}
            <div className="mb-5">
              <label className="block text-gray-600 text-sm mb-2">
                Address
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Enter your address"
                value={address}
                required
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            {/* City Field */}
            <div className="mb-5">
              <label className="block text-gray-600 text-sm mb-2">City</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Enter city"
                value={city}
                required
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            {/* Postal Code Field */}
            <div className="mb-5">
              <label className="block text-gray-600 text-sm mb-2">
                Postal Code
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Enter postal code"
                value={postalCode}
                required
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>

            {/* Country Field */}
            <div className="mb-5">
              <label className="block text-gray-600 text-sm mb-2">
                Country
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Enter country"
                value={country}
                required
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button
              className="bg-pink-500 text-white py-3 px-6 rounded-full w-full text-lg font-semibold hover:bg-pink-600 transition duration-300"
              type="submit"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
