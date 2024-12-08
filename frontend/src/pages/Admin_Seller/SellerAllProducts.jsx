import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";
import { useSelector } from "react-redux"; // For accessing the user state

const AllProducts = () => {
  const { userInfo } = useSelector((state) => state.auth); // Assuming user info is stored here

  const { data: products, isLoading, isError } = useAllProductsQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        <div className="text-2xl font-semibold">Error loading products</div>
      </div>
    );
  }

  // Filter products based on the user's role
  const visibleProducts = userInfo?.isAdmin
    ? products // Admin sees all products
    : products.filter((product) => product.uploadedBy === userInfo._id); // Seller sees only their products

  return (
    <div className="container mx-auto p-8">
      <div className="flex flex-col md:flex-row">
        {/* Product List Section */}
        <div className="flex-1 p-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              {userInfo?.isAdmin ? "All Products" : "My Products"} (
              {visibleProducts.length})
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {visibleProducts.map((product) => (
              <Link
                key={product._id}
                to={`/admin/product/update/${product._id}`}
                className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
              >
                <div className="flex flex-col">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <div className="flex flex-col justify-between">
                    <h5 className="text-xl font-semibold text-gray-700 mb-2">
                      {product?.name}
                    </h5>
                    <p className="text-gray-500 text-sm mb-4">
                      {moment(product.createdAt).format("MMMM Do YYYY")}
                    </p>

                    <p className="text-gray-600 text-sm truncate mb-4">
                      {product?.description?.substring(0, 120)}...
                    </p>

                    <div className="flex justify-between items-center">
                      <p className="text-xl font-semibold text-gray-800">
                        ${product?.price}
                      </p>
                      <Link
                        to={`/admin/product/update/${product._id}`}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-pink-600 rounded-lg hover:bg-pink-700 focus:ring-4 focus:outline-none focus:ring-pink-300"
                      >
                        Update Product
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
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Admin Menu Section */}
        <div className="md:w-1/4 p-4 mt-8 md:mt-0">
          <AdminMenu />
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
