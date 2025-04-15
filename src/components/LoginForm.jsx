import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthLayout from "./AuthLayout";
import { motion } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL;

// Configure axios to send credentials
axiosInstance.defaults.withCredentials = true;

// Validation schema
const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const formFields = [
  {
    name: "email",
    label: "Email",
    type: "email",
    autoComplete: "email",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    autoComplete: "current-password",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    ),
  },
];

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Retrieve pre-filled email and password from session storage
  useEffect(() => {
    const preFilledEmail = sessionStorage.getItem("preFilledEmail");
    const preFilledPassword = sessionStorage.getItem("preFilledPassword");

    if (preFilledEmail && preFilledPassword) {
      setValue("email", preFilledEmail);
      setValue("password", preFilledPassword);

      // Clear session storage after autofilling
      sessionStorage.removeItem("preFilledEmail");
      sessionStorage.removeItem("preFilledPassword");
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post("/api/auth/login", data);

      if (response.status === 200 && response.data?.data) {
        sessionStorage.setItem("user", JSON.stringify(response.data.data.user));
        toast.success(response.data.message || "Login successful!");

        setTimeout(() => {
          window.location.href = "/activities";
        }, 1000);
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Login failed. Please check your credentials and try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <AuthLayout>
      <div className="min-h-screen w-full flex items-start lg:items-center justify-center">
        {/* Left Section with Image - Only visible on large screens */}
        <div className="hidden lg:flex w-1/2 h-screen bg-indigo-50 items-center justify-center relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-4/5 h-4/5 relative"
          >
            <div
              className="w-full h-full bg-contain bg-center bg-no-repeat"
              style={{
                backgroundImage:
                  "url('https://illustrations.popsy.co/purple/remote-work.svg')",
              }}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="absolute bottom-10 left-0 right-0 text-center"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600">
                Continue your progress tracking journey
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Section with Form */}
        <div className="flex lg:w-1/2 min-h-screen w-full bg-indigo-50 lg:bg-indigo-50 items-start lg:items-center justify-center relative overflow-hidden px-4 sm:px-6 lg:px-0">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[440px] bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6 sm:p-8 mx-auto mt-20 lg:mt-8"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Welcome Back
              </h2>
              <p className="mt-2 text-gray-600">Sign in to your account</p>
            </motion.div>

            {/* Tablet Screen Image - Hidden on mobile and desktop */}
            <div className="hidden sm:block lg:hidden w-full max-w-[280px] mx-auto mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div
                  className="w-full h-[200px] bg-contain bg-center bg-no-repeat"
                  style={{
                    backgroundImage:
                      "url('https://illustrations.popsy.co/purple/remote-work.svg')",
                  }}
                />
              </motion.div>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 sm:space-y-5"
            >
              <div className="grid grid-cols-1 gap-4 sm:gap-5">
                {formFields.map((field, index) => (
                  <motion.div
                    key={field.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {field.icon}
                      </div>
                      <input
                        type={field.type}
                        {...register(field.name)}
                        autoComplete={field.autoComplete}
                        className={`block w-full pl-10 pr-3 py-2.5 border ${
                          errors[field.name]
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200`}
                      />
                    </div>
                    {errors[field.name] && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2 text-sm text-red-600"
                      >
                        {errors[field.name].message}
                      </motion.p>
                    )}
                  </motion.div>
                ))}
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${
                  isSubmitting
                    ? "opacity-70 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </motion.button>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-center text-gray-600 mt-4"
              >
                Don't have an account?{" "}
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  href="/register"
                  className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                >
                  Register
                </motion.a>
              </motion.p>
            </form>
          </motion.div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginForm;
