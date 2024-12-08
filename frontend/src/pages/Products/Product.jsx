import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  return (
    <div className="bg-black shadow-md border border-gray-300 rounded-lg overflow-hidden">
      {/* Product Image */}
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-[200px] object-cover"
        />
        <HeartIcon product={product} />
      </div>

      {/* Product Details */}
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex justify-between items-center">
            <div className="text-lg font-semibold text-white-100">
              {product.name}
            </div>
            <span className="bg-pink-800 text-pink-100 text-sm font-medium px-2.5 py-0.5 rounded-full">
              $
              {(
                product.price -
                (product.price * product.discount) / 100
              ).toFixed(2)}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default Product;
