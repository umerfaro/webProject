import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  // Check if the user is a seller or an admin
  const isUserSellerOrAdmin = userInfo?.isSeller || userInfo?.isAdmin;

  return (
    <>
      <div className="container mx-auto px-6 lg:px-12 py-6">
        <Link
          to="/"
          className="text-white font-semibold hover:underline mb-6 inline-block"
        >
          &larr; Go Back
        </Link>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.message}
          </Message>
        ) : (
          <div className="flex flex-wrap items-center justify-between">
            {/* Product Image */}
            <div className="w-full lg:w-1/2 xl:w-2/5 mb-8 lg:mb-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full object-cover rounded-lg shadow-md"
              />
              <HeartIcon product={product} />
            </div>

            {/* Product Details */}
            <div className="w-full lg:w-1/2 xl:w-2/5">
              <h2 className="text-3xl font-semibold mb-4">{product.name}</h2>
              <p className="text-lg text-gray-500 mb-4">{product.description}</p>

            <div className="flex items-center mb-4">
              <p className="text-2xl font-bold text-gray-800 mr-4">
                ${product.price - (product.price * product.discount) / 100}
              </p>
              {product.discount > 0 && (
                <div className="flex items-center">
                  <span className="text-xl font-medium text-green-600 pr-4">
                    ({product.discount}% off)
                  </span>
                </div>
                )}
              <Ratings
                value={product.rating}
                text={`(${product.numReviews} reviews)`}
              />  
            </div>
            
            <div className="flex justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500 flex items-center">
                    <FaStore className="mr-2" /> Brand: {product.brand}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center">
                    <FaClock className="mr-2" /> Added: {moment(product.createAt).fromNow()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 flex items-center">
                    <FaBox className="mr-2" /> In Stock: {product.countInStock}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center">
                    <FaShoppingCart className="mr-2" /> Quantity: {product.quantity}
                  </p>
                </div>
              </div>

              {/* Quantity Selection */}
              <div className="flex items-center mb-4">
                <label className="text-sm text-gray-700 mr-2" htmlFor="quantity">
                  Quantity:
                </label>
                <select
                  id="quantity"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  className="p-2 border rounded-lg text-gray-800"
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={addToCartHandler}
                disabled={product.countInStock === 0 || isUserSellerOrAdmin}
                className={`w-full bg-pink-600 text-white py-3 px-6 rounded-lg mt-4 transition-all hover:bg-pink-700 disabled:bg-gray-400`}
              >
                {product.countInStock === 0
                  ? "Out of Stock"
                  : isUserSellerOrAdmin
                  ? "You cannot add to cart as a seller or admin"
                  : "Add To Cart"}
              </button>
            </div>
          </div>
        )}

        {/* Reviews and Product Tabs */}
        <div className="mt-12">
          <ProductTabs
            loadingProductReview={loadingProductReview}
            userInfo={userInfo}
            submitHandler={submitHandler}
            rating={rating}
            setRating={setRating}
            comment={comment}
            setComment={setComment}
            product={product}
          />
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
