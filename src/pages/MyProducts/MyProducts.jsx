import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  TrendingUp,
  Package,
  Calendar,
  Grid3X3,
  List,
  RefreshCw,
  ExternalLink,
  MoreVertical,
  Heart,
} from "lucide-react";

import axios from "axios";

const MyProducts = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [filter, setFilter] = useState("all"); // all, active, inactive
  const [deleting, setDeleting] = useState(null);
  const [products, setProducts] = useState([]);
  const [totals, setTotals] = useState({
    total_views: 0,
    total_clicks: 0,
    total_wishlists: 0,
  });

  useEffect(() => {
    loadMyProducts();
  }, []);


const loadMyProducts = async () => {
  try {
    const response = await axios.get("/products/mine/");
    if (response.data.products) {
      setProducts(response.data.products);
      setTotals(
        response.data.totals || {
          total_views: 0,
          total_clicks: 0,
          total_wishlists: 0,
        }
      );
    } else if (Array.isArray(response.data)) {
      setProducts(response.data);
    } else {
      setProducts([]);
    }
  } catch (error) {
    console.error("Failed to load my products:", error);
    setProducts([]);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};


  const handleRefresh = () => {
    setRefreshing(true);
    loadMyProducts();
  };

  const handleToggleStatus = async (productId, currentStatus) => {
    try {
      await axios.patch(`/products/${productId}/`, {
        is_active: !currentStatus,
      });
      loadMyProducts();
    } catch (error) {
      console.error("Failed to toggle product status:", error);
      alert("Failed to update product status");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    setDeleting(productId);
    try {
      await axios.delete(`/products/${productId}/`);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product");
    } finally {
      setDeleting(null);
    }
  };

  const getStatusColor = (isActive) => {
    return isActive
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-gray-100 text-gray-800 border-gray-200";
  };

  const filteredProducts = products.filter((product) => {
    if (filter === "active") return product.is_active;
    if (filter === "inactive") return !product.is_active;
    return true;
  });

const stats = {
  total: products.length,
  active: products.filter((p) => p.is_active).length,
  inactive: products.filter((p) => !p.is_active).length,
  totalViews: totals.total_views,
  totalClicks: totals.total_clicks, 
  totalWishlists: totals.total_wishlists, 
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
              <p className="text-gray-600 mt-2">
                Manage your listings and track performance
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </button>

              <Link
                to="/sell"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={18} />
                Add Product
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Listings</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.active}
                </p>
              </div>
              <Eye className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inactive Listings</p>
                <p className="text-2xl font-bold text-gray-600">
                  {stats.inactive}
                </p>
              </div>
              <EyeOff className="w-8 h-8 text-gray-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.totalViews}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              {[
                { key: "all", label: "All", count: stats.total },
                { key: "active", label: "Active", count: stats.active },
                { key: "inactive", label: "Inactive", count: stats.inactive },
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === key
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {label} ({count})
                </button>
              ))}
            </div>

            {/* View Mode */}
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm"
                      : "hover:bg-gray-200"
                  }`}
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${
                    viewMode === "list"
                      ? "bg-white shadow-sm"
                      : "hover:bg-gray-200"
                  }`}
                >
                  <List size={18} />
                </button>
              </div>

              <span className="text-gray-600 text-sm">
                {filteredProducts.length} products
              </span>
            </div>
          </div>
        </div>

        {/* Products List */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {filter === "all" ? "No products yet" : `No ${filter} products`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === "all"
                ? "Start by creating your first product listing."
                : `You don't have any ${filter} products at the moment.`}
            </p>
            <Link
              to="/sell"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} />
              Create Your First Product
            </Link>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {filteredProducts.map((product) => (
              <ProductItem
                key={product.id}
                product={product}
                viewMode={viewMode}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDeleteProduct}
                isDeleting={deleting === product.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Product Item Component
const ProductItem = ({
  product,
  viewMode,
  onToggleStatus,
  onDelete,
  isDeleting,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const getConditionColor = (condition) => {
    const colors = {
      new: "bg-green-100 text-green-800",
      like_new: "bg-blue-100 text-blue-800",
      used: "bg-yellow-100 text-yellow-800",
    };
    return colors[condition] || colors.used;
  };

  const formatCondition = (condition) => {
    const labels = {
      new: "New",
      like_new: "Like New",
      used: "Used",
    };
    return labels[condition] || condition;
  };

  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-6">
        <div className="flex gap-6">
          {/* Image */}
          <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0].image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Package className="w-8 h-8 text-gray-400" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {product.title}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {product.is_active ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(
                      product.condition
                    )}`}
                  >
                    {formatCondition(product.condition)}
                  </span>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye size={16} className="text-purple-600" />
                      {product.product_view_count || 0}
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp size={16} className="text-blue-600" />
                      {product.product_click_count || 0}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart size={16} className="text-red-600" />
                      {product.wishlist_count || 0}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(product.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Price and Actions */}
              <div className="text-right ml-6">
                <div className="text-2xl font-bold text-blue-600 mb-4">
                  ₹{Number(product.price).toLocaleString()}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      onToggleStatus(product.id, product.is_active)
                    }
                    className={`p-2 rounded-full transition-colors ${
                      product.is_active
                        ? "text-green-600 hover:bg-green-50"
                        : "text-gray-400 hover:bg-gray-50"
                    }`}
                    title={product.is_active ? "Deactivate" : "Activate"}
                  >
                    {product.is_active ? (
                      <Eye size={16} />
                    ) : (
                      <EyeOff size={16} />
                    )}
                  </button>

                  <Link
                    to={`/products/${product.id}/edit`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    title="Edit product"
                  >
                    <Edit3 size={16} />
                  </Link>

                  <button
                    onClick={() => onDelete(product.id)}
                    disabled={isDeleting}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                    title="Delete product"
                  >
                    {isDeleting ? (
                      <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>

                  <Link
                    to={`/products/${product.id}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden">
      {/* Image */}
      <div className="relative aspect-square bg-gray-100">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0].image}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-gray-400" />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              product.is_active
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {product.is_active ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Menu Button */}
        <div className="absolute top-3 right-3">
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
            >
              <MoreVertical size={16} />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                  <Link
                    to={`/products/${product.id}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowMenu(false)}
                  >
                    <div className="flex items-center gap-2">
                      <ExternalLink size={14} />
                      View Product
                    </div>
                  </Link>
                  <Link
                    to={`/products/${product.id}/edit`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowMenu(false)}
                  >
                    <div className="flex items-center gap-2">
                      <Edit3 size={14} />
                      Edit
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      onToggleStatus(product.id, product.is_active);
                      setShowMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      {product.is_active ? (
                        <EyeOff size={14} />
                      ) : (
                        <Eye size={14} />
                      )}
                      {product.is_active ? "Deactivate" : "Activate"}
                    </div>
                  </button>
                  <div className="border-t border-gray-200 my-2"></div>
                  <button
                    onClick={() => {
                      onDelete(product.id);
                      setShowMenu(false);
                    }}
                    disabled={isDeleting}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    <div className="flex items-center gap-2">
                      <Trash2 size={14} />
                      Delete
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
          {product.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold text-blue-600">
            ₹{Number(product.price).toLocaleString()}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Eye size={14} className="text-purple-600" />
              {product.product_view_count || 0} views
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp size={14} className="text-blue-600" />
              {product.product_click_count || 0} clicks
            </div>
            <div className="flex items-center gap-1">
              <Heart size={14} className="text-red-600" />
              {product.wishlist_count || 0} wishlists
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(
              product.condition
            )}`}
          >
            {formatCondition(product.condition)}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(product.created_at).toLocaleDateString()}
          </span>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/products/${product.id}`}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center text-sm font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyProducts;
