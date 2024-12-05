import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "../Admin/AdminMenu";

const ProductList = () => {
  const [image, setImage] = useState(""); // Stores the image file
  const [name, setName] = useState(""); // Stores the product name
  const [description, setDescription] = useState(""); // Stores the product description
  const [price, setPrice] = useState(""); // Stores the product price
  const [category, setCategory] = useState(""); // Stores the product category ID
  const [quantity, setQuantity] = useState(""); // Stores the quantity available
  const [brand, setBrand] = useState(""); // Stores the brand name
  const [stock, setStock] = useState(0); // Stores the stock count
  const [imageUrl, setImageUrl] = useState(null); // Stores the image preview URL

  const navigate = useNavigate(); // Hook to navigate to other pages

  const [uploadProductImage] = useUploadProductImageMutation(); // Mutation to upload the image
  const [createProduct] = useCreateProductMutation(); // Mutation to create a product
  const { data: categories } = useFetchCategoriesQuery(); // Fetching categories for the select input

  // Handle the form submission for creating a product
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!name || !price || !category || !stock || !quantity) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      // Prepare product data to send to the backend
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);

      // Call the mutation to create the product
      const { data } = await createProduct(productData);

      if (data.error) {
        toast.error("Product creation failed. Please try again.");
      } else {
        toast.success(`${data.name} has been created!`);

        // Reset form fields after successful product creation
        setName("");
        setDescription("");
        setPrice("");
        setCategory("");
        setQuantity("");
        setBrand("");
        setStock(0);
        setImage(""); // Clear the image file state
        setImageUrl(null); // Clear the image URL preview

        // Optionally, navigate to a different page after successful creation
        // navigate("/shop"); // Uncomment if you want to navigate to the shop page
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    }
  };

  // Handle the file upload for the product image
  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Image uploaded successfully.");
      setImage(res.image); // Set the uploaded image
      setImageUrl(res.image); // Preview the image
    } catch (error) {
      toast.error(error?.data?.message || "Error uploading image.");
    }
  };

  return (
    <div className="container xl:mx-[9rem] sm:mx-[0]">
      <div className="flex flex-col md:flex-row">
        <AdminMenu /> {/* Admin side menu */}
        <div className="md:w-3/4 p-6">
          <div className="text-2xl font-bold mb-4">Create Product</div>

          {imageUrl && (
            <div className="text-center mb-5">
              <img
                src={imageUrl} // Preview the uploaded image
                alt="Product preview"
                className="block mx-auto max-h-[200px] object-contain"
              />
            </div>
          )}

          {/* Product form */}
          <form onSubmit={handleSubmit}>
            {/* Image upload */}
            <div className="mb-4">
              <label className="block font-semibold mb-2" htmlFor="image">
                Product Image
              </label>
              <label className="block cursor-pointer text-white bg-gray-800 p-4 rounded-lg text-center font-bold mb-4">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-semibold mb-2" htmlFor="name">
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
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
                  className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter product price"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-semibold mb-2" htmlFor="quantity">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter product quantity"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-2" htmlFor="brand">
                  Brand
                </label>
                <input
                  type="text"
                  id="brand"
                  className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
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
                className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter product description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-semibold mb-2" htmlFor="stock">
                  Stock Count
                </label>
                <input
                  type="number"
                  id="stock"
                  className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
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
                  className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
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
              className="w-full py-4 mt-5 rounded-lg text-lg font-bold bg-pink-600 text-white"
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
