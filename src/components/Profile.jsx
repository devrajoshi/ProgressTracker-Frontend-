import React, { useEffect, useState } from "react";
import { isAuthenticated } from "../utils/auth";
import {
  FaCameraRetro,
  FaUser,
  FaEnvelope,
  FaCalendar,
  FaUserCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Modal from "./Modal";
import axiosInstance from "../utils/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState(
    "https://source.unsplash.com/random/100x100"
  );
  const [uploading, setUploading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    fullname: "",
    username: "",
    email: "",
  });
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosInstance.get("/api/users/me");
        const userData = response.data?.data || {};

        setUser(userData);
        setEditFormData({
          fullname: userData.fullname || "",
          username: userData.username || "",
          email: userData.email || "",
        });

        if (userData.profilePictureUrl) {
          setProfilePicture(`${API_URL}/${userData.profilePictureUrl}`);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast.error(
          error.response?.data?.message || "Failed to fetch user details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated()) {
      fetchUserDetails();
    } else {
      setLoading(false);
    }
  }, []);

  const handleProfileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const tempUrl = URL.createObjectURL(file);
      setProfilePicture(tempUrl);

      const formData = new FormData();
      formData.append("profilePicture", file);

      const response = await axiosInstance.post(
        "/api/users/profile/update-profile-picture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedUser = response.data?.data;
      if (updatedUser?.profilePictureUrl) {
        setProfilePicture(`${API_URL}/${updatedUser.profilePictureUrl}`);
        toast.success("Profile picture updated successfully!");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to upload profile picture. Please try again."
      );
      // Revert to previous profile picture if update fails
      if (user?.profilePictureUrl) {
        setProfilePicture(`${API_URL}/${user.profilePictureUrl}`);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleFormSubmit = async (
    url,
    formData,
    successMessage,
    closeModal
  ) => {
    try {
      const response = await axiosInstance.put(url, formData);
      const updatedUserData = response.data?.data;

      // Update both user state and editFormData
      setUser(updatedUserData);
      setEditFormData({
        fullname: updatedUserData.fullname || "",
        username: updatedUserData.username || "",
        email: updatedUserData.email || "",
      });

      closeModal();
      toast.success(successMessage);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      return toast.error("New password and confirmation do not match");
    }

    try {
      const response = await axiosInstance.put(
        `${API_URL}/api/users/profile/change-password`,
        {
          currentPassword: passwordFormData.currentPassword,
          newPassword: passwordFormData.newPassword,
        }
      );

      const data = response.data;

      setPasswordFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsPasswordModalOpen(false);
      toast.success("Password changed successfully!");

      if (data.requireReLogin) {
        toast.info(
          "Your account is being logged out for security reasons. Please login with the new password."
        );
        setTimeout(() => (window.location.href = "/login"), 4000);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(error.response?.data?.message || "Failed to change password");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          className="w-12 h-12 border-4 border-indigo-600 rounded-full border-t-transparent"
        />
      </div>
    );
  }

  if (!user)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mt-20 text-gray-600"
      >
        Unable to load user details.
      </motion.div>
    );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
          {/* Left Side - Decorative Illustrations (Hidden on smaller screens) */}
          <motion.div
            variants={itemVariants}
            className="hidden lg:flex w-full lg:w-1/3 flex-col items-center gap-8 lg:sticky lg:top-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full aspect-square max-w-md relative"
            >
              <img
                src="https://illustrations.popsy.co/purple/work-from-home.svg"
                alt="Decorative"
                className="w-full h-full object-contain"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="w-full aspect-square max-w-md relative"
            >
              <img
                src="https://illustrations.popsy.co/purple/success.svg"
                alt="Decorative"
                className="w-full h-full object-contain"
              />
            </motion.div>
          </motion.div>

          {/* Right Side - Profile Content (Full width on smaller screens) */}
          <motion.div
            variants={itemVariants}
            className="w-full lg:w-2/3 mx-auto max-w-2xl lg:max-w-none"
          >
            <motion.div
              variants={itemVariants}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] p-6 sm:p-8"
            >
              <div className="flex flex-col items-center">
                {/* Profile Picture Section */}
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  className="relative"
                >
                  <input
                    type="file"
                    id="profileInput"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfileChange}
                  />
                  <div
                    className="cursor-pointer relative group"
                    onClick={() =>
                      document.getElementById("profileInput").click()
                    }
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="relative"
                    >
                      <img
                        src={profilePicture}
                        alt="Profile"
                        className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-indigo-600 shadow-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <FaCameraRetro className="h-8 w-8 text-white opacity-70 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* User Info Section */}
                <motion.div
                  variants={itemVariants}
                  className="mt-8 w-full max-w-md space-y-2"
                >
                  {[
                    { field: "fullname", icon: FaUser },
                    { field: "username", icon: FaUserCircle },
                    { field: "email", icon: FaEnvelope },
                    { field: "createdAt", icon: FaCalendar },
                  ].map(({ field, icon: Icon }) => (
                    <motion.div
                      key={field}
                      variants={itemVariants}
                      className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5 text-indigo-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            {field === "createdAt"
                              ? "Member Since"
                              : field.charAt(0).toUpperCase() + field.slice(1)}
                          </p>
                          <p className="text-lg font-semibold text-gray-900">
                            {field === "createdAt"
                              ? new Date(user[field]).toLocaleDateString()
                              : user[field] || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Action Buttons */}
                  <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsEditModalOpen(true)}
                      className="w-full sm:w-auto text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-8 py-3 text-center shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Edit Profile
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsPasswordModalOpen(true)}
                      className="w-full sm:w-auto text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-8 py-3 text-center shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Change Password
                    </motion.button>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>

            {/* Loading State */}
            {uploading && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mt-4 text-indigo-600 font-medium"
              >
                Uploading profile picture...
              </motion.p>
            )}
          </motion.div>
        </div>

        {/* Modals */}
        <AnimatePresence>
          {isEditModalOpen && (
            <Modal
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  Edit Profile
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleFormSubmit(
                      `${API_URL}/api/users/profile`,
                      editFormData,
                      "Profile updated successfully!",
                      () => setIsEditModalOpen(false)
                    );
                  }}
                  className="space-y-6"
                >
                  {["fullname", "username", "email"].map((field) => (
                    <motion.div
                      key={field}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <input
                        type={field === "email" ? "email" : "text"}
                        value={editFormData[field]}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            [field]: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      />
                    </motion.div>
                  ))}
                  <div className="flex justify-end space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                    >
                      Save Changes
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </Modal>
          )}

          {isPasswordModalOpen && (
            <Modal
              isOpen={isPasswordModalOpen}
              onClose={() => setIsPasswordModalOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  Change Password
                </h2>
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  {["currentPassword", "newPassword", "confirmPassword"].map(
                    (field) => (
                      <motion.div
                        key={field}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {field
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                        </label>
                        <input
                          type="password"
                          value={passwordFormData[field]}
                          onChange={(e) =>
                            setPasswordFormData({
                              ...passwordFormData,
                              [field]: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                        />
                      </motion.div>
                    )
                  )}
                  <div className="flex justify-end space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setIsPasswordModalOpen(false)}
                      className="px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
                    >
                      Update Password
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </Modal>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Profile;
