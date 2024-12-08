import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import Loader from "../../components/Loader";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();

  // Access userInfo from Redux store
  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    if (userInfo) {
      setUserName(userInfo.username);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          username,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  // Determine if the user is a regular user (not admin and not seller)
  const isRegularUser = !userInfo?.isAdmin && !userInfo?.isSeller;

  return (
    <div className="container mx-auto p-6 mt-10 bg-gray-900 min-h-screen">
      <div className="flex justify-center align-center md:flex md:space-x-4">
        <div className="md:w-1/2 lg:w-1/3">
          <h2 className="text-3xl font-semibold mb-6 text-white text-center">
            Update Profile
          </h2>
          <form
            onSubmit={submitHandler}
            className="bg-gray-800 p-8 rounded-lg shadow-lg"
          >
            <div className="mb-6">
              <label className="block text-white mb-2">Name</label>
              <input
                type="text"
                placeholder="Enter name"
                className="form-input p-4 rounded-lg w-full text-gray-900"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-white mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Enter email"
                className="form-input p-4 rounded-lg w-full text-gray-900"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-white mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                className="form-input p-4 rounded-lg w-full text-gray-900"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-white mb-2">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm password"
                className="form-input p-4 rounded-lg w-full text-gray-900"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-between items-center mb-6">
              <button
                type="submit"
                className="bg-pink-600 text-white py-3 px-6 rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-200"
              >
                Update
              </button>

              {/* Conditionally render "My Orders" button */}
              {isRegularUser && (
                <Link
                  to="/user-orders"
                  className="bg-pink-700 text-white py-3 px-6 rounded-lg hover:bg-pink-800 focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-200"
                >
                  My Orders
                </Link>
              )}
            </div>

            {loadingUpdateProfile && <Loader />}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
