import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/userSlice/authActions";
import { clearState } from "../redux/userSlice/userSlice";
import Loader from "../components/reusableComponent/Loader.jsx";
import { motion } from "framer-motion";
import logoImage from "../assets/image/Picture2.jpg";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
function Login() {
  const Navigateto = useNavigate();
  const dispatch = useDispatch();
  const { isSuccess, isError, message, Role, code, loading } = useSelector(
    (state) => state.user
  );
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        window.history.back(-1);
      }, 500);
    }
    if (isError) {
      toast.error(isError);
      dispatch(clearState());
    }
  }, [isSuccess, isError, message, code, Role, Navigateto, dispatch]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="min-h-screen flex bg-gray-100" dir="rtl">
        {/* Right Side - Form Section */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 bg-white relative">
          {/* Decorative dots */}
          <div className="absolute top-8 left-8 grid grid-cols-6 gap-1.5 opacity-30">
            {[...Array(24)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#3b82a0]"></div>
            ))}
          </div>

          {/* Header */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              نظام <span className="text-[#3b82a0]">إدارة المخازن</span>
            </h1>
            <div className="w-full h-0.5 bg-[#3b82a0] mt-2"></div>
          </motion.div>

          {/* Form */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-gray-700 mb-6">تسجيل الدخول</h2>

            <form onKeyPress={handleKeyPress} className="space-y-4">
              {/* Email Field */}
              <div>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="البريد الإلكتروني *"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md text-right focus:outline-none focus:border-[#3b82a0] focus:ring-1 focus:ring-[#3b82a0] bg-white transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="كلمة السر *"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md text-right focus:outline-none focus:border-[#3b82a0] focus:ring-1 focus:ring-[#3b82a0] bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3b82a0] transition-colors bg-transparent border-none cursor-pointer focus:outline-none"
                  >
                    {showPassword ? (
                      <VisibilityOffIcon/>
                    ) : (
                      <VisibilityIcon/>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="button"
                onClick={handleSubmit}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-3 bg-gray-200 hover:bg-[#3b82a0] hover:text-white text-gray-600 font-medium rounded-md border border-[#3b82a0] transition-all duration-300"
              >
                تسجيل دخول
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Left Side - Blue Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#1e6a99] relative overflow-hidden flex-col items-center justify-center p-12">
          {/* Wave Pattern Background */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 600">
            <path
              d="M0,0 L800,0 L800,600 L0,600 Z"
              fill="#1e6a99"
            />
            <path
              d="M-50,100 Q200,200 400,100 T800,150 L800,600 L0,600 Z"
              fill="#4a9ab8"
              opacity="0.4"
            />
            <path
              d="M-50,200 Q150,300 350,200 T750,250 L800,600 L0,600 Z"
              fill="#5aa8c6"
              opacity="0.3"
            />
            <path
              d="M-50,300 Q200,400 400,300 T800,350 L800,600 L0,600 Z"
              fill="#6ab6d4"
              opacity="0.2"
            />
          </svg>

          {/* Decorative dots top right */}
          <div className="absolute top-8 right-8 grid grid-cols-6 gap-1.5 opacity-40">
            {[...Array(24)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-white"></div>
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10 text-center text-white">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              أهلاً بك في
            </motion.h2>
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              نظام إدارة المخازن
            </motion.h1>
            <motion.p
              className="text-sm md:text-base opacity-90 max-w-md mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              مرحباً بك في نظام إدارة المخازن، نحن نوفر حلاً رقمياً سهلاً وسريعاً
              لإدارة مخازنك بكل يسر وسهولة.
            </motion.p>

            {/* Logo Circle */}
            <motion.div
              className="w-32 h-32 mx-auto bg-white rounded-full flex items-center justify-center shadow-lg mb-6"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5, type: "spring" }}
            >
              <div className="text-[#3b82a0]">
                {/* <svg className="w-16 h-16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg> */}
                <img
                  src={logoImage}
                  alt="Logo"
                  className="w-full h-full object-contain rounded"
                />
              </div>
            </motion.div>

            <motion.p
              className="text-lg font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              نظام المخازن المتكامل
            </motion.p>
          </div>

          {/* Decorative dots bottom left */}
          <div className="absolute bottom-8 left-8 grid grid-cols-6 gap-1.5 opacity-40">
            {[...Array(24)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-white"></div>
            ))}
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Login;
