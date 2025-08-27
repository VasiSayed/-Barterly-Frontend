import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  MessageCircle,
  Trash2,
  Grid3X3,
  List,
  Eye,
  MapPin,
  RefreshCw,
  Share2,
  ExternalLink,
} from "lucide-react";
import axios from "axios";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const response = await axios.get("/wishlist/");
      setWishlistItems(response.data.results || response.data);
    } catch (error) {
      console.error("Failed to load wishlist:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadWishlist();
  };

  const handleRemoveFromWishlist = async (itemId) => {
    setRemoving(itemId);
    try {
      await axios.delete(`/wishlist/${itemId}/`);
      setWishlistItems((items) => items.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
      alert("Failed to remove item from wishlist");
    } finally {
      setRemoving(null);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your wishlist...</p>
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
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-500" />
                Your Wishlist
              </h1>
              <p className="text-gray-600 mt-2">
                {wishlistItems.length} saved{" "}
                {wishlistItems.length === 1 ? "item" : "items"}
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

              <div className="flex items-center bg-white rounded-lg border border-gray-300 p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${
                    viewMode === "list"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Wishlist Items */}
        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-gray-600 mb-6">
              Save products you're interested in to keep track of them and get
              notifications about price changes.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Products
              <ExternalLink size={16} />
            </Link>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {wishlistItems.map((item) => (
              <WishlistItem
                key={item.id}
                item={item}
                viewMode={viewMode}
                onRemove={handleRemoveFromWishlist}
                isRemoving={removing === item.id}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

// Wishlist Item Component
const WishlistItem = ({ item, viewMode, onRemove, isRemoving }) => {
  const product = item.product;

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
              <ShoppingCart className="w-8 h-8 text-gray-400" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {product.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center gap-4 mb-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(
                      product.condition
                    )}`}
                  >
                    {formatCondition(product.condition)}
                  </span>

                  {(product.location_city || product.location_state) && (
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin size={14} className="mr-1" />
                      {[product.location_city, product.location_state]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                  )}

                  <div className="flex items-center text-sm text-gray-500">
                    <Eye size={14} className="mr-1" />
                    {product.view_count} views
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  Added on {new Date(item.created_at).toLocaleDateString()}
                </div>
              </div>

              {/* Price and Actions */}
              <div className="text-right ml-6">
                <div className="text-2xl font-bold text-blue-600 mb-4">
                  ₹{Number(product.price).toLocaleString()}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onRemove(item.id)}
                    disabled={isRemoving}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                    title="Remove from wishlist"
                  >
                    {isRemoving ? (
                      <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>

                  <Link
                    to={`/products/${product.id}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <MessageCircle size={16} />
                    Make Offer
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
    <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden group">
      {/* Image */}
      <div className="relative aspect-square bg-gray-100">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0].image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingCart className="w-16 h-16 text-gray-400" />
          </div>
        )}

        {/* Badges and Actions */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(
              product.condition
            )}`}
          >
            {formatCondition(product.condition)}
          </span>
        </div>

        <button
          onClick={() => onRemove(item.id)}
          disabled={isRemoving}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all text-red-500 hover:bg-red-50 disabled:opacity-50"
          title="Remove from wishlist"
        >
          {isRemoving ? (
            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Heart className="w-4 h-4 fill-current" />
          )}
        </button>
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
          <div className="flex items-center text-sm text-gray-500">
            <Eye size={16} className="mr-1" />
            {product.view_count}
          </div>
        </div>

        {(product.location_city || product.location_state) && (
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <MapPin size={16} className="mr-1" />
            {[product.location_city, product.location_state]
              .filter(Boolean)
              .join(", ")}
          </div>
        )}

        <div className="text-xs text-gray-500 mb-4">
          Added {new Date(item.created_at).toLocaleDateString()}
        </div>

        <Link
          to={`/products/${product.id}`}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <MessageCircle size={16} />
          Make Offer
        </Link>
      </div>
    </div>
  );
};

export default Wishlist;
