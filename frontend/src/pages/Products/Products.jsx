import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Rating from "./Rating";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { addToCart } from "../../redux/features/cart/cartSlice";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import moment from "moment";
import ProductTabs from "./Tabs";
import HeartIcon from "./HeartIcon";

const Product = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

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
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <div className="mb-4">
        <Link
          className="text-pink-600 font-semibold hover:underline ml-[10rem]"
          to="/"
        >
          Go Back
        </Link>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <div className="flex flex-wrap relative items-center mt-[3rem] mx-auto px-4 max-w-screen-xl">
            <div className="w-full md:w-[50%] p-4">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-[400px] object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
                />
                <HeartIcon product={product} />
              </div>
            </div>

            <div className="w-full md:w-[50%] p-4 flex flex-col justify-between">
              <h2 className="text-3xl font-semibold text-gray-800">
                {product.name}
              </h2>
              <p className="my-4 text-lg text-[#B0B0B0]">
                {product.description}
              </p>

              <p className="text-4xl font-extrabold text-gray-900">
                ${product.price}
              </p>

              {/* Product Details Section */}
              <div className="flex justify-between flex-wrap mt-6">
                <div className="flex flex-col space-y-3">
                  <h1 className="flex items-center text-gray-700 text-lg">
                    <FaStore className="mr-2 text-pink-600" /> Brand:{" "}
                    <span className="text-gray-900">{product.brand}</span>
                  </h1>
                  <h1 className="flex items-center text-gray-700 text-lg">
                    <FaClock className="mr-2 text-pink-600" /> Added:{" "}
                    <span className="text-gray-900">
                      {moment(product.createdAt).fromNow()}
                    </span>
                  </h1>
                  <h1 className="flex items-center text-gray-700 text-lg">
                    <FaStar className="mr-2 text-pink-600" /> Reviews:{" "}
                    <span className="text-gray-900">{product.numReviews}</span>
                  </h1>
                </div>

                <div className="flex flex-col space-y-3">
                  <h1 className="flex items-center text-gray-700 text-lg">
                    <FaStar className="mr-2 text-pink-600" /> Ratings:{" "}
                    <span className="text-gray-900">{rating}</span>
                  </h1>
                  <h1 className="flex items-center text-gray-700 text-lg">
                    <FaShoppingCart className="mr-2 text-pink-600" /> Quantity:{" "}
                    <span className="text-gray-900">{product.quantity}</span>
                  </h1>
                  <h1 className="flex items-center text-gray-700 text-lg">
                    <FaBox className="mr-2 text-pink-600" /> In Stock:{" "}
                    <span className="text-gray-900">
                      {product.countInStock}
                    </span>
                  </h1>
                </div>
              </div>

              {/* Product Actions */}
              <div className="flex justify-between flex-wrap items-center mt-6">
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />

                {product.countInStock > 0 && (
                  <div className="flex items-center space-x-4">
                    <select
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                      className="p-2 w-[6rem] rounded-lg text-black border-2 border-gray-300"
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <button
                  onClick={addToCartHandler}
                  disabled={product.countInStock === 0}
                  className="bg-pink-600 text-white py-3 px-6 rounded-lg hover:bg-pink-700 transition-colors duration-300 w-full"
                >
                  Add To Cart
                </button>
              </div>
            </div>
          </div>

          <div className="mt-12 mx-auto max-w-screen-xl">
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
        </>
      )}
    </>
  );
};

export default Product;
