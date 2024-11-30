import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";

// Placeholder image URL
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/600x400?text=No+Image+Available";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="mb-4 w-screen">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Slider {...settings} className="w-full">
          {products.map(({ image, _id, name }) => (
            <div key={_id} className="w-screen">
              <img
                src={image || PLACEHOLDER_IMAGE} // Fallback to placeholder if image is missing
                alt={name || "Product Image"}
                className="w-full h-[20rem] object-cover rounded-lg"
              />
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;
