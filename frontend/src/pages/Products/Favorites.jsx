import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import Product from "./Product";
import Message from "../../components/Message"; // Assuming you have a Message component to show empty states

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);

  return (
    <div className="ml-16">
      {" "}
      {/* Adjusted margin to be consistent */}
      <h1 className="text-2xl font-bold mt-8 ml-12">Favorite Products</h1>
      <div className="flex flex-wrap gap-4 mt-6">
        {favorites.length === 0 ? (
          <Message>No favorite products yet.</Message>
        ) : (
          favorites.map((product) => (
            <Product key={product._id} product={product} />
          ))
        )}
      </div>
    </div>
  );
};

export default Favorites;
