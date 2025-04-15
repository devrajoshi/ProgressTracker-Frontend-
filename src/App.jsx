import React, { useState, useEffect, createContext, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./components/Home";
import Activities from "./components/Activities";
import History from "./components/History";
import Profile from "./components/Profile";
import RegistrationForm from "./components/RegistrationForm";
import LoginForm from "./components/LoginForm";
import NotFound from "./components/NotFound";
import PrivateRoute from "./components/PrivateRoute";
import { isAuthenticated } from "./utils/auth.jsx";

// Create auth context
export const AuthContext = createContext(null);

function App() {
  const [authState, setAuthState] = useState({
    isAuth: null,
    isLoading: true,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authStatus = await isAuthenticated();
        setAuthState({
          isAuth: authStatus,
          isLoading: false,
        });
      } catch (error) {
        setAuthState({
          isAuth: false,
          isLoading: false,
        });
      }
    };
    checkAuth();
  }, []);

  if (authState.isLoading) {
    return <div className="text-center mt-16">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      <Router>
        <Navbar isAuthenticated={authState.isAuth} />

        <div className="flex flex-col min-h-screen">
          <div className="flex-grow mt-16">
            <Suspense
              fallback={<div className="text-center mt-16">Loading...</div>}
            >
              <Routes>
                {/* Default Redirect Based on Authentication */}
                <Route
                  path="/"
                  element={
                    authState.isAuth ? (
                      <Navigate to="/activities" replace />
                    ) : (
                      <Home />
                    )
                  }
                />

                {/* Public Routes */}
                <Route
                  path="/register"
                  element={
                    authState.isAuth ? (
                      <Navigate to="/activities" replace />
                    ) : (
                      <RegistrationForm />
                    )
                  }
                />
                <Route
                  path="/login"
                  element={
                    authState.isAuth ? (
                      <Navigate to="/activities" replace />
                    ) : (
                      <LoginForm />
                    )
                  }
                />

                {/* Protected Routes */}
                <Route
                  path="/activities"
                  element={
                    <PrivateRoute isAuthenticated={authState.isAuth}>
                      <Activities />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <PrivateRoute isAuthenticated={authState.isAuth}>
                      <History />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute isAuthenticated={authState.isAuth}>
                      <Profile />
                    </PrivateRoute>
                  }
                />

                {/* Fallback Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>

          {/* Conditional Footer */}
          {!authState.isAuth && <Footer />}
        </div>

        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="!w-auto md:!max-w-md sm:!top-4 sm:!bottom-auto !bottom-4 !right-4"
          toastClassName="!w-[calc(100vw-32px)] sm:!w-auto !mx-0 !mb-0"
          bodyClassName="!text-sm !font-medium"
          progressClassName="!h-1"
          style={{
            "--toastify-toast-width": "auto",
          }}
        />
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
