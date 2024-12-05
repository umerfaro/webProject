import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

// Importing the eye icons for password visibility toggle
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      console.log(userInfo,'data');
      navigate(redirect);

    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      console.log(res,'res');
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1493633619019-d32a7bf99fbc?crop=entropy&cs=tinysrgb&fit=max&ixid=M3wzNjk1NXwwfDF8c2VhcmNofDE2fHxibG9vZC5waG98ZW58MHx8fHwxNjk0MzkxNjM1&ixlib=rb-1.2.1&q=80&w=1080')",
      }}
    >
      <section className="w-full max-w-md bg-black bg-opacity-60 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-6 text-center text-white">
          Sign In
        </h1>

        <form onSubmit={submitHandler}>
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

          <button
            disabled={isLoading}
            type="submit"
            className="bg-pink-500 text-white px-4 py-2 rounded w-full my-4"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>

          {isLoading && <Loader />}

          <div className="mt-6 text-center">
            <p className="text-gray-300">
              New Customer?{" "}
              <Link
                to={redirect ? `/register?redirect=${redirect}` : "/register"}
                className="text-pink-500 hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Login;
