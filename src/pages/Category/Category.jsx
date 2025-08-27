import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Grid3X3,
  Package,
  RefreshCw,
  Search,
  ArrowRight,
  ShoppingCart,
} from "lucide-react";
import axios from "axios";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await axios.get("/categories/");
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadCategories();
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryIcon = (categoryName) => {
    const icons = {
      mechanical: "⚙️",
      electrical: "⚡",
      clothing: "👕",
      luxury: "💎",
      fantasy: "🎭",
      // Fallback
      mechinal: "⚙️",
      luxary: "💎",
      fantacy: "🎭",
    };
    return icons[categoryName.toLowerCase()] || "📦";
  };

  const getCategoryColor = (index) => {
    const colors = [
      "from-blue-500 to-blue-600",
      "from-green-500 to-green-600",
      "from-purple-500 to-purple-600",
      "from-yellow-500 to-yellow-600",
      "from-red-500 to-red-600",
      "from-indigo-500 to-indigo-600",
      "from-pink-500 to-pink-600",
      "from-gray-500 to-gray-600",
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Browse Categories
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Discover products across different categories and find exactly
              what you're looking for
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-gray-900 bg-white rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none shadow-lg text-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              All Categories ({filteredCategories.length})
            </h2>
            <p className="text-gray-600 mt-2">
              Explore products by category and start negotiating
            </p>
          </div>
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
        </div>

        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No categories found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? `No categories match "${searchTerm}"`
                : "No categories available"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                colorClass={getCategoryColor(index)}
                icon={getCategoryIcon(category.name)}
              />
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">
            Can't find what you're looking for?
          </h3>
          <p className="text-lg opacity-90 mb-6">
            Browse all products or start selling your own items
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              <ShoppingCart size={20} />
              Browse All Products
            </Link>
            <Link
              to="/sell"
              className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-medium transition-colors"
            >
              <Package size={20} />
              Start Selling
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Category Card Component
const CategoryCard = ({ category, colorClass, icon }) => {
  return (
    <Link
      to={`/products?category=${category.id}`}
      className="group block bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden transform hover:-translate-y-1"
    >
      <div className={`bg-gradient-to-r ${colorClass} p-6 text-center`}>
        <div className="text-4xl mb-2">{icon}</div>
        <h3 className="text-xl font-bold text-white">{category.name}</h3>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm mb-2">
              Explore products in {category.name.toLowerCase()}
            </p>
            <div className="flex items-center text-blue-600 group-hover:text-blue-700 font-medium">
              <span>Browse Products</span>
              <ArrowRight
                size={16}
                className="ml-1 transform group-hover:translate-x-1 transition-transform"
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Categories;
