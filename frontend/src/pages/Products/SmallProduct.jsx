import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <div className="w-full p-3 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="h-[15rem] w-full object-cover rounded"
        />
        {/* Position the HeartIcon in the top-right corner of the image */}
        <div className="absolute top-2 right-2">
          <HeartIcon product={product} />
        </div>
      </div>

      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex justify-between items-center">
            <div>{product.name}</div>
            <span className="bg-pink-100 text-pink-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
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

export default SmallProduct;
