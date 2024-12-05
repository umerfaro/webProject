import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

// Importing the eye icon for toggling password visibility
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("customer");  // New state for user role
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await register({ username, email, password, role }).unwrap();  // Include role in the registration payload
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
        toast.success("User successfully registered");
      } catch (err) {
        console.log(err);
        toast.error(err.data.message);
      }
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1585870184917-9e687eb53bc6?crop=entropy&cs=tinysrgb&fit=max&ixid=M3wzNjk1NXwwfDF8c2VhcmNofDI4fHxibG9vZC5waG98ZW58MHx8fHwxNjk0MzkxNzEz&ixlib=rb-1.2.1&q=80&w=1080')",
      }}
    >
      <section className="w-full max-w-md bg-black bg-opacity-60 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-6 text-center text-white">
          Register
        </h1>

        <form onSubmit={submitHandler}>
          <div className="my-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-white"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-2 p-2 border border-gray-300 rounded w-full"
              placeholder="Enter name"
              value={username}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="my-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="mt-2 p-2 border border-gray-300 rounded w-full"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="my-4 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="mt-2 p-2 border border-gray-300 rounded w-full"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-8 right-3 text-gray-300"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="my-4 relative">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-white"
            >
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              className="mt-2 p-2 border border-gray-300 rounded w-full"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-8 right-3 text-gray-300"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Dropdown for role */}
          <div className="my-4 text-black">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-white"
            >
              Select Role
            </label>
            <select
              id="role"
              className="mt-2 p-2 border border-gray-300 rounded w-full"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="customer">Customer</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="bg-pink-500 text-white px-4 py-2 rounded w-full my-4"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>

          {isLoading && <Loader />}

          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Already have an account?{" "}
              <Link
                to={redirect ? `/login?redirect=${redirect}` : "/login"}
                className="text-pink-500 hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Register;
