import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  // Retrieve userInfo from localStorage or Redux
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // Check if the user is a seller or admin
  const isUserSellerOrAdmin = userInfo?.isSeller || userInfo?.isAdmin;

  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:scale-105 dark:bg-gray-800 dark:border-gray-700">
      {/* Product Image Section */}
      <section className="relative overflow-hidden rounded-t-lg">
        <Link to={`/product/${p._id}`}>
          <span className="absolute bottom-3 right-3 bg-pink-100 text-pink-800 text-sm font-medium px-3 py-1 rounded-full dark:bg-pink-900 dark:text-pink-300">
            {p?.brand || "Brand"}
          </span>
          <img
            className="w-[300px] h-[200px] object-cover transition-transform duration-500 ease-in-out hover:scale-110"
            src={p.image}
            alt={p.name}
          />
        </Link>
        <HeartIcon product={p} />
      </section>

      {/* Product Details Section */}
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-center mb-2">
          <h5 className="text-xl font-semibold text-gray-800 dark:text-white truncate">
            {p?.name}
          </h5>
          <p className="flex items-center space-x-2">
            {/* Display original price with strike-through if discount is available */}
            {p?.discount && (
              <span className="text-gray-500 line-through">
                {p?.price?.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </span>
            )}

            {/* Display the discounted price */}
            <span className="text-pink-500 font-bold">
              {p?.discount
                ? (p.price - p.discount).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })
                : p?.price?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
            </span>
          </p>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300">
          {p?.description?.substring(0, 60) || "No description available"}...
        </p>

        {/* Action Buttons */}
        <section className="flex justify-between items-center mt-4">
          <Link
            to={`/product/${p._id}`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-lg hover:bg-pink-700 transition duration-300 ease-in-out focus:ring-4 focus:outline-none focus:ring-pink-300 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800"
          >
            Read More
            <svg
              className="w-3.5 h-3.5 ml-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </Link>

          {/* Conditionally render Add to Cart button */}
          {!isUserSellerOrAdmin && (
            <button
              className="p-2 rounded-full bg-pink-100 hover:bg-pink-200 dark:bg-pink-700 dark:hover:bg-pink-800 transition duration-300 ease-in-out"
              onClick={() => addToCartHandler(p, 1)}
            >
              <AiOutlineShoppingCart
                size={25}
                className="text-gray-800 dark:text-white"
              />
            </button>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProductCard;
