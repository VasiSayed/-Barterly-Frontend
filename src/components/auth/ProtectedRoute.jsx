import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Lock, LogIn } from "lucide-react";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render children if authenticated
  return children;
};

// Alternative component for pages that should show login prompt
export const LoginPrompt = ({
  title = "Authentication Required",
  message = "Please log in to access this feature",
  showLoginButton = true,
}) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-gray-600 mb-8">{message}</p>

          {showLoginButton && (
            <div className="space-y-4">
              <Navigate
                to="/login"
                state={{ from: location }}
                replace
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <LogIn size={20} />
                Sign In
              </Navigate>

              <p className="text-sm text-gray-500">
                Don't have an account?{" "}
                <Navigate
                  to="/register"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign up here
                </Navigate>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute;
