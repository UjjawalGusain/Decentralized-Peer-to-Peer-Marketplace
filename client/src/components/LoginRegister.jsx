import { useState } from "react";
import axios from "axios";
import APIS from "./../../api/api";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const LoginRegister = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      const data = new FormData();
      data.append("name", formData.fullName);
      data.append("email", formData.email);
      data.append("password", formData.password);

      if (formData.avatar) {
        data.append("avatar", formData.avatar);
      }

      await axios.post(APIS.REGISTER, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Registration successful! Please log in.");
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        avatar: null,
      });
      setIsLogin(true);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(APIS.LOGIN, {
        email: formData.email,
        password: formData.password,
      });

      setSuccess("Login successful!");
      login(response.data.user, response.data.token);
      navigate("/");
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        avatar: null,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-teal-50 to-green-50 p-4">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-teal-400 to-green-500 text-white items-center justify-center p-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold">
              Decentralized P2P Marketplace
            </h1>
            <p className="text-md md:text-lg leading-relaxed">
              Trade securely with escrow & transparency.
              <br />
              Join the future of commerce today!
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
            {isLogin ? "Welcome Back" : "Create Your Account"}
          </h2>

          {/* Error / Success */}
          {error && (
            <p className="text-red-500 text-center mb-4 text-sm sm:text-base">{error}</p>
          )}
          {success && (
            <p className="text-green-600 text-center mb-4 text-sm sm:text-base">{success}</p>
          )}

          <form
            onSubmit={isLogin ? handleLogin : handleRegister}
            className="space-y-4"
          >
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-400 outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-400 outline-none"
              />
            </div>

            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Avatar
                  </label>
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full mt-1"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full bg-teal-500 text-white font-medium py-2 rounded-lg hover:bg-teal-600 transition"
            >
              {isLogin ? "Login" : "Register"}
            </button>
          </form>

          {/* Toggle */}
          <p className="text-center text-sm md:text-base text-gray-600 mt-6">
            {isLogin ? "New to our marketplace?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-teal-600 font-semibold hover:underline"
            >
              {isLogin ? "Create an account" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
