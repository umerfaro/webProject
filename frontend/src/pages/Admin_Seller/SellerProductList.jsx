import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const ProductList = () => {
  const [image, setImage] = useState(""); // Image file state
  const [name, setName] = useState(""); // Product name
  const [description, setDescription] = useState(""); // Product description
  const [price, setPrice] = useState(""); // Product price
  const [category, setCategory] = useState(""); // Product category ID
  const [quantity, setQuantity] = useState(""); // Product quantity
  const [brand, setBrand] = useState(""); // Brand name
  const [stock, setStock] = useState(0); // Stock count
  const [imageUrl, setImageUrl] = useState(null); // Image preview URL
  const [discount, setDiscount] = useState(0); // Discount percentage

  const navigate = useNavigate(); // Hook for navigation

  const [uploadProductImage] = useUploadProductImageMutation(); // Upload image mutation
  const [createProduct] = useCreateProductMutation(); // Create product mutation
  const { data: categories } = useFetchCategoriesQuery(); // Fetch categories for dropdown

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!name || !price || !category || !stock || !quantity) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      // Prepare product data
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);
      productData.append("discount", discount);

      // Call mutation to create product
      const { data } = await createProduct(productData);

      if (data.error) {
        toast.error("Product creation failed. Please try again.");
      } else {
        toast.success(`${data.name} has been created!`);

        // Reset form fields
        setName("");
        setDescription("");
        setPrice("");
        setCategory("");
        setQuantity("");
        setBrand("");
        setStock(0);
        setDiscount(0);
        setImage("");
        setImageUrl(null); // Clear image preview

        // Navigate to a different page after successful creation (optional)
        // navigate("/shop"); // Uncomment if you want to navigate to the shop page
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    }
  };

  // Handle image upload
  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Image uploaded successfully.");
      setImage(res.image);
      setImageUrl(res.image); // Show image preview
    } catch (error) {
      toast.error(error?.data?.message || "Error uploading image.");
    }
  };

  return (
    <div className="container xl:mx-[9rem] sm:mx-[0]">
      <div className="flex flex-col md:flex-row">
        <AdminMenu /> {/* Admin side menu */}
        <div className="md:w-3/4 p-6">
          <div className="text-2xl font-bold mb-6">Create New Product</div>

          {imageUrl && (
            <div className="text-center mb-6">
              <img
                src={imageUrl} // Product image preview
                alt="Product preview"
                className="block mx-auto max-h-[200px] object-contain rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Product creation form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image upload */}
            <div className="mb-4">
              <label className="block font-semibold mb-2" htmlFor="image">
                Product Image
              </label>
              <label className="block cursor-pointer bg-gray-800 text-white py-3 px-6 rounded-lg text-center font-semibold">
                {image ? image.name : "Click to Upload Image"}
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={uploadFileHandler}
                  className="hidden"
                />
              </label>
            </div>

            {/* Product details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold mb-2" htmlFor="name">
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-4 border rounded-lg bg-[#101011] text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-2" htmlFor="price">
                  Price (SAR)
                </label>
                <input
                  type="number"
                  id="price"
                  className="w-full p-4 border rounded-lg bg-[#101011] text-white"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter product price"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold mb-2" htmlFor="quantity">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  className="w-full p-4 border rounded-lg bg-[#101011] text-white"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter product quantity"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-2" htmlFor="discount">
                  Discount (%)
                </label>
                <input
                  type="number"
                  id="discount"
                  className="w-full p-4 border rounded-lg bg-[#101011] text-white"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="Enter discount (0-100)"
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2" htmlFor="brand">
                  Brand
                </label>
                <input
                  type="text"
                  id="brand"
                  className="w-full p-4 border rounded-lg bg-[#101011] text-white"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Enter product brand"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-2" htmlFor="description">
                Product Description
              </label>
              <textarea
                id="description"
                className="w-full p-4 border rounded-lg bg-[#101011] text-white"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter product description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold mb-2" htmlFor="stock">
                  Stock Count
                </label>
                <input
                  type="number"
                  id="stock"
                  className="w-full p-4 border rounded-lg bg-[#101011] text-white"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="Enter stock count"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-2" htmlFor="category">
                  Category
                </label>
                <select
                  id="category"
                  className="w-full p-4 border rounded-lg bg-[#101011] text-white"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-4 mt-6 rounded-lg text-lg font-bold ${
                image ? "bg-pink-600" : "bg-gray-600 cursor-not-allowed"
              } text-white`}
              disabled={!image}
            >
              {image ? "Create Product" : "Please upload an image first"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
