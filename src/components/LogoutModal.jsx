import React, { useState } from "react";

const LogoutModal = ({ onLogout, isMobile = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle logout action
  const handleLogout = () => {
    onLogout(); // Call the parent's logout function
    setIsModalOpen(false); // Close the modal after logout
  };

  return (
    <>
      {/* Logout Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className={
          isMobile
            ? "inline-block text-center px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            : "text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        }
      >
        Logout
      </button>

      {/* Modal Portal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[9999]"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-[90%] max-w-sm relative"
            style={{ margin: "16px" }}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-lg p-1.5"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal Content */}
            <div className="p-6 text-center">
              <div className="mx-auto mb-4 rounded-full w-14 h-14 bg-gray-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-5 text-lg font-medium text-gray-900">
                Are you sure you want to logout?
              </h3>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto text-gray-500 bg-white hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-6 py-2.5 hover:text-gray-900"
                >
                  No, cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full sm:w-auto text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-6 py-2.5"
                >
                  Yes, Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LogoutModal;
