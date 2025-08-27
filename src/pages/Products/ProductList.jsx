import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Heart,
  MapPin,
  Eye,
  ShoppingCart,
  Star,
  MessageCircle,
  Plus,
  SlidersHorizontal,
  Clock,
  TrendingUp,
} from "lucide-react";
import axios from "axios";

const ProductList = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [lastViewedProduct, setLastViewedProduct] = useState(null);
  const [categoriesSeen, setCategoriesSeen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    condition: "",
    location_city: "",
    location_state: "",
    min_price: "",
    max_price: "",
    ordering: "-created_at",
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [filters]);

  useEffect(() => {
    if (isAuthenticated) {
      loadWishlist();
    }
  }, [isAuthenticated]);

  const loadInitialData = async () => {
    try {
      const [categoriesRes, productsRes] = await Promise.all([
        axios.get("/categories/"),
        axios.get("/products/"),
      ]);

      setCategories(categoriesRes.data);

      // Handle new API response structure
      const productData = productsRes.data;
      setProducts(productData.products || productData.results || productData);

      // Handle authenticated user data
      if (productData.last_viewed_product) {
        setLastViewedProduct(productData.last_viewed_product);
      }
      if (productData.categories_seen) {
        setCategoriesSeen(productData.categories_seen);
      }
    } catch (error) {
      console.error("Failed to load initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await axios.get(`/products/?${params}`);
      const productData = response.data;

      // Handle new API response structure
      setProducts(productData.products || productData.results || productData);

      // Update user activity data if available
      if (productData.last_viewed_product) {
        setLastViewedProduct(productData.last_viewed_product);
      }
      if (productData.categories_seen) {
        setCategoriesSeen(productData.categories_seen);
      }
    } catch (error) {
      console.error("Failed to load products:", error);
    }
  };

  const loadWishlist = async () => {
    try {
      const response = await axios.get("/wishlist/");
      setWishlist(response.data.results || response.data);
    } catch (error) {
      console.error("Failed to load wishlist:", error);
    }
  };

  const toggleWishlist = async (productId) => {
    if (!isAuthenticated) return;

    const isWishlisted = wishlist.some((item) => item.product.id === productId);

    try {
      if (isWishlisted) {
        const item = wishlist.find((item) => item.product.id === productId);
        await axios.delete(`/wishlist/${item.id}/`);
      } else {
        await axios.post("/wishlist/", { product_id: productId });
      }
      loadWishlist();
    } catch (error) {
      console.error("Failed to toggle wishlist:", error);
    }
  };

  const isProductWishlisted = (productId) => {
    return wishlist.some((item) => item.product.id === productId);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      condition: "",
      location_city: "",
      location_state: "",
      min_price: "",
      max_price: "",
      ordering: "-created_at",
    });
  };

  const getConditionBadge = (condition) => {
    const styles = {
      new: "bg-green-100 text-green-800 border-green-200",
      like_new: "bg-blue-100 text-blue-800 border-blue-200",
      used: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };
    return styles[condition] || styles.used;
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
          <p className="text-gray-600">Loading products...</p>
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
              Shop Smart. Negotiate Better.
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Because the best price is the one you agree on.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search for products..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-gray-900 bg-white rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none shadow-lg text-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Activity Section (for authenticated users) */}
        {isAuthenticated &&
          (lastViewedProduct || categoriesSeen.length > 0) && (
            <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Last Viewed Product */}
              {lastViewedProduct && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Continue Where You Left Off
                    </h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0">
                      <ShoppingCart className="w-8 h-8 text-gray-400 m-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {lastViewedProduct.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Last viewed product
                      </p>
                    </div>
                    <Link
                      to={`/products/${lastViewedProduct.id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      View Again
                    </Link>
                  </div>
                </div>
              )}

              {/* Categories You've Seen */}
              {categoriesSeen.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Your Interests
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categoriesSeen.slice(0, 5).map((category, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          handleFilterChange(
                            "category",
                            category.product__category__id
                          )
                        }
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm hover:bg-green-200 transition-colors"
                      >
                        {category.product__category__name}
                      </button>
                    ))}
                    {categoriesSeen.length > 5 && (
                      <span className="px-3 py-1 text-gray-500 text-sm">
                        +{categoriesSeen.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

        {/* Filters and Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Filter Toggle and View Mode */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <SlidersHorizontal size={18} />
                Filters
              </button>

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
            </div>

            {/* Sort */}
            <div className="flex items-center gap-4">
              <select
                value={filters.ordering}
                onChange={(e) => handleFilterChange("ordering", e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="-created_at">Newest First</option>
                <option value="created_at">Oldest First</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="-product_view_count">Most Viewed</option>
              </select>

              <span className="text-gray-600">{products.length} products</span>
            </div>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) =>
                      handleFilterChange("category", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition
                  </label>
                  <select
                    value={filters.condition}
                    onChange={(e) =>
                      handleFilterChange("condition", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Conditions</option>
                    <option value="new">New</option>
                    <option value="like_new">Like New</option>
                    <option value="used">Used</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Price
                  </label>
                  <input
                    type="number"
                    value={filters.min_price}
                    onChange={(e) =>
                      handleFilterChange("min_price", e.target.value)
                    }
                    placeholder="Min"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Price
                  </label>
                  <input
                    type="number"
                    value={filters.max_price}
                    onChange={(e) =>
                      handleFilterChange("max_price", e.target.value)
                    }
                    placeholder="Max"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid/List */}
        {products.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filters
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode={viewMode}
                isWishlisted={isProductWishlisted(product.id)}
                onToggleWishlist={toggleWishlist}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Product Card Component
const ProductCard = ({
  product,
  viewMode,
  isWishlisted,
  onToggleWishlist,
  isAuthenticated,
}) => {
  const getConditionBadge = (condition) => {
    const styles = {
      new: "bg-green-100 text-green-800",
      like_new: "bg-blue-100 text-blue-800",
      used: "bg-yellow-100 text-yellow-800",
    };
    return styles[condition] || styles.used;
  };

  const formatCondition = (condition) => {
    const labels = {
      new: "New",
      like_new: "Like New",
      used: "Used",
    };
    return labels[condition] || condition;
  };

  // Handle both view_count and product_view_count
  const viewCount = product.view_count || product.product_view_count || 0;

  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-6">
        <div className="flex gap-6">
          {/* Image */}
          <div className="w-32 h-32 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0].image}
                alt={product.title}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <ShoppingCart className="w-8 h-8 text-gray-400" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {product.title}
                </h3>
                <p className="text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center gap-4 mb-3">
                  {product.condition && (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionBadge(
                        product.condition
                      )}`}
                    >
                      {formatCondition(product.condition)}
                    </span>
                  )}

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
                    {viewCount}
                  </div>
                </div>
              </div>

              {/* Price and Actions */}
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600 mb-4">
                  ₹{Number(product.price).toLocaleString()}
                </div>

                <div className="flex items-center gap-2">
                  {isAuthenticated && (
                    <button
                      onClick={() => onToggleWishlist(product.id)}
                      className={`p-2 rounded-full transition-colors ${
                        isWishlisted
                          ? "bg-red-100 text-red-600 hover:bg-red-200"
                          : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                      }`}
                    >
                      <Heart size={18} />
                    </button>
                  )}

                  <Link
                    to={`/products/${product.id}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <MessageCircle size={16} />
                    View Details
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

        {/* Badges and Wishlist */}
        {product.condition && (
          <div className="absolute top-3 left-3">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionBadge(
                product.condition
              )}`}
            >
              {formatCondition(product.condition)}
            </span>
          </div>
        )}

        {isAuthenticated && (
          <button
            onClick={() => onToggleWishlist(product.id)}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
              isWishlisted
                ? "bg-red-500 text-white shadow-lg"
                : "bg-white text-gray-400 hover:text-red-500 shadow-md"
            }`}
          >
            <Heart size={18} />
          </button>
        )}
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
            {viewCount}
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

export default ProductList;
