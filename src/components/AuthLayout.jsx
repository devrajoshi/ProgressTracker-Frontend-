import React from "react";
import { motion } from "framer-motion";

const AuthLayout = ({ children, title }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-purple-50"
    >
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        {children}
      </div>
    </motion.div>
  );
};

export default AuthLayout;
