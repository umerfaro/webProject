import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Placeholder image URL
const PLACEHOLDER_IMAGE =
  "https://via.placeholder.com/600x400?text=No+Image+Available";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <h1 className="text-red-500 text-center font-bold">
        An error occurred. Please try again later.
      </h1>
    );
  }

  // Product Carousel Settings
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  // Limit to a maximum of 8 products
  const limitedProducts = data ? data.slice(0, 8) : [];

  return (
    <>
      <div className="flex flex-col items-center">
        {/* Product Carousel */}
        <div className="w-full max-w-[85%] mx-auto">
          <Slider {...carouselSettings}>
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
                    <p className="text-xl font-bold mt-2">
                      ${price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {/* Separator Line */}
        <div className="my-8 w-full border-b border-gray-300"></div>

        {/* Top Products Grid */}
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Top Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {limitedProducts.map(({ _id, image, name, price }) => (
              <div
                key={_id}
                className="w-[20rem] m-4 p-3 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="relative">
                  <img
                    src={image || PLACEHOLDER_IMAGE}
                    alt={name}
                    className="h-[15rem] w-[15rem] object-cover rounded"
                  />
                  <div className="absolute top-2 right-2">
                    {/* Placeholder for HeartIcon */}
                    <button className="text-white">
                      <i className="fas fa-heart"></i>{" "}
                      {/* Replace with HeartIcon */}
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <h2 className="flex justify-between items-center">
                    <div>{name}</div>
                    <span className="bg-pink-100 text-pink-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
                      ${price.toFixed(2)}
                    </span>
                  </h2>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
