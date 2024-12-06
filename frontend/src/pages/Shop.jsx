import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";

import {
  setCategories,
  setProducts,
  setChecked,
  setRadio, // Make sure to import setRadio if you use it
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // 1. Add search state

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
    search: searchTerm, // Optional: Pass search term to API if supported
  });

  useEffect(() => {
    if (categoriesQuery.isSuccess) {
      dispatch(setCategories(categoriesQuery.data));
    }
    // Optionally handle loading and error states
  }, [categoriesQuery.isSuccess, categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (filteredProductsQuery.isSuccess) {
      let filtered = filteredProductsQuery.data;

      // 2. Filter by price
      if (priceFilter) {
        const priceValue = parseFloat(priceFilter);
        if (!isNaN(priceValue)) {
          filtered = filtered.filter(
            (product) =>
              product.price.toString().includes(priceFilter) ||
              product.price === priceValue
          );
        }
      }

      // 3. Filter by search term
      if (searchTerm.trim() !== "") {
        const lowerSearch = searchTerm.toLowerCase();
        filtered = filtered.filter((product) =>
          product.name.toLowerCase().includes(lowerSearch)
        );
      }

      dispatch(setProducts(filtered));
    }
    // Optionally handle loading and error states
  }, [
    checked,
    radio,
    filteredProductsQuery.isSuccess,
    filteredProductsQuery.data,
    dispatch,
    priceFilter,
    searchTerm, // Include searchTerm in dependencies
  ]);

  const handleBrandClick = (brand) => {
    if (brand === "All Brands") {
      dispatch(setRadio([])); // Reset brand filter
      return;
    }
    dispatch(setRadio([brand]));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  // Add "All Brands" option to uniqueBrands
  const uniqueBrands = [
    "All Brands", // 4. Add "All Brands" option
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  const handleSearchChange = (e) => { // 5. Handle search input changes
    setSearchTerm(e.target.value);
  };

  const handleReset = () => {
    dispatch(setChecked([]));
    dispatch(setRadio([]));
    setPriceFilter("");
    setSearchTerm("");
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar for Filters */}
        <div className="bg-[#151515] p-3 mt-2 mb-2 w-full md:w-1/4">
          {/* Categories Filter */}
          <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
            Filter by Categories
          </h2>
          <div className="p-5">
            {categories?.map((c) => (
              <div key={c._id} className="mb-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`category-${c._id}`}
                    checked={checked.includes(c._id)}
                    onChange={(e) => handleCheck(e.target.checked, c._id)}
                    className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500"
                  />
                  <label
                    htmlFor={`category-${c._id}`}
                    className="ml-2 text-sm font-medium text-white"
                  >
                    {c.name}
                  </label>
                </div>
              </div>
            ))}
          </div>

          {/* Brands Filter */}
          <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
            Filter by Brands
          </h2>
          <div className="p-5">
            {uniqueBrands?.map((brand) => (
              <div key={brand} className="flex items-center mb-2">
                <input
                  type="radio"
                  id={`brand-${brand}`}
                  name="brand"
                  checked={radio.includes(brand)}
                  onChange={() => handleBrandClick(brand)}
                  className="w-4 h-4 text-pink-400 bg-gray-100 border-gray-300 focus:ring-pink-500"
                />
                <label
                  htmlFor={`brand-${brand}`}
                  className="ml-2 text-sm font-medium text-white"
                >
                  {brand}
                </label>
              </div>
            ))}
          </div>

          {/* Price Filter */}
          <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
            Filter by Price
          </h2>
          <div className="p-5">
            <input
              type="number"
              placeholder="Enter Price"
              value={priceFilter}
              onChange={handlePriceChange}
              className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-pink-300"
            />
          </div>

          {/* Search Bar */}
          <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
            Search Products
          </h2>
          <div className="p-5">
            <input
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-pink-300"
            />
          </div>

          {/* Reset Button */}
          <div className="p-5 pt-0">
            <button
              className="w-full border my-4 py-2 bg-red-500 text-white rounded"
              onClick={handleReset}
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Products Display */}
        <div className="p-3 w-full md:w-3/4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="h4 text-center">
              {products?.length} {products.length === 1 ? "Product" : "Products"}
            </h2>
            {/* Optional: Add sorting options here */}
          </div>
          <div className="flex flex-wrap">
            {filteredProductsQuery.isLoading ? (
              <Loader />
            ) : products.length === 0 ? (
              <p className="text-center w-full">No products found.</p>
            ) : (
              products?.map((p) => (
                <div className="p-3 w-full sm:w-1/2 md:w-1/3 lg:w-1/4" key={p._id}>
                  <ProductCard p={p} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
