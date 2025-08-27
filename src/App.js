import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Register from "./pages/Auth/Register";
// Layout Components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Auth Components
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Sell from "./pages/Sell/Sell";
import MyProducts from "./pages/MyProducts/MyProducts";

// Page Components
import EditProduct from "../src/pages/MyProducts/EditProduct";
import Login from "./pages/Auth/Login";
import ProductList from "./pages/Products/ProductList";
import ProductDetail from "./pages/Products/ProductDetail";
import Negotiations from "./pages/Negotiations/Negotiations";
import Deals from "./pages/Deals/Deals";
import Wishlist from "./pages/Wishlist/Wishlist";
import Profile from "./pages/Profile";
import HowItWorks from "./pages/Support/HowItWorks";
import Pricing from "./pages/Support/Pricing";
import Categories from "./pages/Category/Category";
function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<ProductList />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Protected Routes */}
            <Route
              path="/negotiations"
              element={
                <ProtectedRoute>
                  <Negotiations />
                </ProtectedRoute>
              }
            />

            <Route path="/products/:id/edit" element={<EditProduct />} />

            <Route
              path="/sell"
              element={
                <ProtectedRoute>
                  <Sell />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-products"
              element={
                <ProtectedRoute>
                  <MyProducts />
                </ProtectedRoute>
              }
            />

            <Route
              path="/deals"
              element={
                <ProtectedRoute>
                  <Deals />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
