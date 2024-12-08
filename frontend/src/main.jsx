import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./redux/store";
import { Route, RouterProvider, createRoutesFromElements } from "react-router";
import { createBrowserRouter } from "react-router-dom";

import PrivateRoute from "./components/PrivateRoute";

// Auth
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

import AdminRoute from "./pages/Admin_Seller/AdminRoute.jsx";
import Profile from "./pages/User/Profile";
import UserList from "./pages/Admin_Seller/UserList.jsx";

import CategoryList from "./pages/Admin_Seller/SellerCategoryList.jsx";

import ProductList from "./pages/Admin_Seller/SellerProductList.jsx";
import AllProducts from "./pages/Admin_Seller/SellerAllProducts.jsx";
import ProductUpdate from "./pages/Admin_Seller/SellerProductUpdate.jsx";

import Home from "./pages/Home.jsx";
import Favorites from "./pages/Products/Favorites.jsx";
import ProductDetails from "./pages/Products/ProductDetails.jsx";

import Cart from "./pages/Cart.jsx";
import Shop from "./pages/Shop.jsx";

import Shipping from "./pages/Orders/Shipping.jsx";
import PlaceOrder from "./pages/Orders/PlaceOrder.jsx";
import Order from "./pages/Orders/Order.jsx";
import OrderList from "./pages/Admin_Seller/SellerOrderList.jsx";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import AdminDashboard from "./pages/Admin_Seller/SellerDashboard.jsx";
import OrderHistoryPage from "./pages/Orders/OrderHistoryPage.jsx";
import HelpAndSupport from "./pages/Helppage/HelpSupport.jsx";

import { GoogleOAuthProvider } from "@react-oauth/google";

// Use environment variables for the Client ID
const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "841516082448-05td3fv0mi3suia6dvsiqvp2sp5i6qla.apps.googleusercontent.com"; // Ensure this is the correct Client ID

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route index={true} path="/" element={<Home />} />
      <Route path="/favorite" element={<Favorites />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/shop" element={<Shop />} />

      {/* Registered users */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/placeorder" element={<PlaceOrder />} />
        <Route path="/order/:id" element={<Order />} />
        <Route path="/order" element={<OrderHistoryPage />} />
        <Route path="/help" element={<HelpAndSupport />} />
      </Route>

      <Route path="/admin" element={<AdminRoute />}>
        <Route path="userlist" element={<UserList />} />
        <Route path="categorylist" element={<CategoryList />} />
        <Route path="productlist" element={<ProductList />} />
        <Route path="allproductslist" element={<AllProducts />} />
        <Route path="productlist/:pageNumber" element={<ProductList />} />
        <Route path="product/update/:_id" element={<ProductUpdate />} />
        <Route path="orderlist" element={<OrderList />} />
        <Route path="dashboard" element={<AdminDashboard />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <PayPalScriptProvider>
        <RouterProvider router={router} />
      </PayPalScriptProvider>
    </GoogleOAuthProvider>
  </Provider>
);
