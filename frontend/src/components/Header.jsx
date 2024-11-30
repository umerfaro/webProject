import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarousel from "../pages/Products/ProductCarousel";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h1 className="text-red-500 text-center font-bold">An error occurred. Please try again later.</h1>;
  }

  return (
    <>
      <div className="flex flex-col items-center">
        {/* Product Carousel */}
        <div className="w-full">
          <ProductCarousel />
        </div>

        {/* Add space after the carousel */}
        <div className="my-8 w-full border-b border-gray-300"></div>

        {/* Product Grid */}
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Top Products
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.map((product) => (
              <SmallProduct key={product._id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
