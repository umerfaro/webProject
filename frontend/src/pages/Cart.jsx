import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";
import { useEffect } from "react";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  
  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

 //getting userInfo from localstorage

 useEffect(() => {
  const userInfo = localStorage.getItem("userInfo")
  // if is admin or seller redirect to dashboard
  if(userInfo && JSON.parse(userInfo).isAdmin || JSON.parse(userInfo).isSeller){
    navigate('/')
  }


}
, [])

  return (
    <div className="container mx-auto mt-8 p-4">
      {cartItems.length === 0 ? (
        <div className="text-center">
          <h2 className="text-xl font-semibold">Your cart is empty!</h2>
          <p className="mt-4 text-lg">Looks like you haven't added anything yet.</p>
          <Link to="/shop" className="text-pink-500 text-lg mt-4 inline-block">
            Go to Shop
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            <h1 className="text-2xl font-semibold mb-6">Shopping Cart</h1>
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center mb-6 p-4 border-b">
                {/* Product Image */}
                <div className="w-24 h-24">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 ml-4">
                  <Link to={`/product/${item._id}`} className="text-pink-500 text-lg font-semibold">
                    {item.name}
                  </Link>
                  <div className="text-gray-600 mt-2">{item.brand}</div>
                  <div className="text-lg font-bold mt-2">${item.price - (item.price * item.discount) / 100}</div>
                </div>

                {/* Quantity Selector */}
                <div className="w-28">
                  <select
                    className="w-full p-2 border rounded text-black"
                    value={item.qty}
                    onChange={(e) =>
                      addToCartHandler(item, Number(e.target.value))
                    }
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Remove from Cart Button */}
                <div className="ml-4">
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => removeFromCartHandler(item._id)}
                  >
                    <FaTrash className="text-lg" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="w-full lg:w-[30rem] p-4 bg-black-100 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Cart Summary ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
            </h2>
            <div className="text-2xl font-bold mb-4">
              ${cartItems
                .reduce((acc, item) => acc + item.qty * (item.price - (item.price * item.discount) / 100) , 0)
                .toFixed(2)}
            </div>

            <button
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-full text-lg"
              disabled={cartItems.length === 0}
              onClick={checkoutHandler}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
