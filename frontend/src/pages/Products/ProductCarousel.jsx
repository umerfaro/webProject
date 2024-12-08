import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Placeholder image URL
const PLACEHOLDER_IMAGE =
  "https://via.placeholder.com/600x400?text=No+Image+Available";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };
  const limitedProducts = products ? products.slice(0, 3) : [];
  return (
    <div className="mb-4 w-full max-w-[87%] mx-auto">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Slider {...settings}>
          {limitedProducts.map(({ image, _id, name, price }) => (
            <div key={_id} className="p-4">
              <div className="relative w-full h-[15rem]">
                <img
                  src={image || PLACEHOLDER_IMAGE}
                  alt={name || "Product Image"}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white p-4 rounded-lg">
                  <h2 className="text-lg font-semibold">{name}</h2>
                  <p className="text-xl font-bold mt-2">${price.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;
