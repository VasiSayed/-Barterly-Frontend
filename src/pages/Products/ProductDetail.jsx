import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  Heart,
  MapPin,
  Eye,
  MessageCircle,
  ArrowLeft,
  Share2,
  Flag,
  Calendar,
  Tag,
  User,
  ShoppingCart,
  Send,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import axios from "axios";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Offer modal state
  const [offerData, setOfferData] = useState({
    price: "",
    message: "",
  });
  const [offerLoading, setOfferLoading] = useState(false);
  const [offerError, setOfferError] = useState("");
  const [offerSuccess, setOfferSuccess] = useState(false);

  useEffect(() => {
    loadProduct();
    if (isAuthenticated) {
      checkWishlistStatus();
    }
  }, [id, isAuthenticated]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/products/${id}/`);
      setProduct(response.data);

      // Record product view
      try {
        await axios.post(`/products/${id}/click/`);
      } catch (clickError) {
        console.log("Click tracking failed:", clickError);
      }
    } catch (err) {
      setError("Product not found");
    } finally {
      setLoading(false);
    }
  };

  const checkWishlistStatus = async () => {
    try {
      const response = await axios.get("/wishlist/");
      const wishlist = response.data.results || response.data;
      setIsWishlisted(wishlist.some((item) => item.product.id === id));
    } catch (error) {
      console.error("Failed to check wishlist status:", error);
    }
  };

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      if (isWishlisted) {
        // Find and remove from wishlist
        const response = await axios.get("/wishlist/");
        const wishlist = response.data.results || response.data;
        const item = wishlist.find((item) => item.product.id === id);
        if (item) {
          await axios.delete(`/wishlist/${item.id}/`);
        }
      } else {
        await axios.post("/wishlist/", { product_id: id });
      }
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      console.error("Failed to toggle wishlist:", error);
    }
  };

  const handleMakeOffer = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setOfferLoading(true);
    setOfferError("");

    try {
      await axios.post("/negotiations/start/", {
        product: id,
        price: parseFloat(offerData.price),
        message: offerData.message,
      });

      setOfferSuccess(true);
      setTimeout(() => {
        setShowOfferModal(false);
        setOfferSuccess(false);
        setOfferData({ price: "", message: "" });
      }, 2000);
    } catch (err) {
      setOfferError(
        err.response?.data?.detail ||
          "Failed to submit offer. Please try again."
      );
    } finally {
      setOfferLoading(false);
    }
  };

  const getConditionColor = (condition) => {
    const colors = {
      new: "bg-green-100 text-green-800 border-green-200",
      like_new: "bg-blue-100 text-blue-800 border-blue-200",
      used: "bg-yellow-100 text-yellow-800 border-yellow-200",
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
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <img
                  src={
                    product.images[currentImageIndex]?.image ||
                    product.images[0].image
                  }
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingCart className="w-24 h-24 text-gray-400" />
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      currentImageIndex === index
                        ? "border-blue-600"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image.image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {product.title}
                </h1>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleWishlist}
                    className={`p-2 rounded-full transition-colors ${
                      isWishlisted
                        ? "bg-red-100 text-red-600 hover:bg-red-200"
                        : "bg-gray-100 text-gray-400 hover:text-red-600"
                    }`}
                  >
                    <Heart size={20} />
                  </button>
                  <button className="p-2 bg-gray-100 text-gray-400 hover:text-gray-600 rounded-full">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl font-bold text-blue-600">
                  ₹{Number(product.price).toLocaleString()}
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getConditionColor(
                    product.condition
                  )}`}
                >
                  {formatCondition(product.condition)}
                </span>
              </div>

              {/* {product.min_offer_price > 0 && (
                <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                  <Tag size={16} />
                  Minimum offer: ₹
                  {Number(product.min_offer_price).toLocaleString()}
                </div>
              )} */}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {product.description || "No description provided."}
              </p>
            </div>

            {/* Details */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Product Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">
                    Listed on{" "}
                    {new Date(product.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">
                    {product.view_count} views
                  </span>
                </div>

                {(product.location_city || product.location_state) && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">
                      {[
                        product.location_city,
                        product.location_state,
                        product.location_country,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                )}

                {product.category && (
                  <div className="flex items-center gap-3">
                    <Tag className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">
                      Category: {product.category.name}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Seller Information
              </h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {product.seller.username}
                  </h4>
                  <p className="text-sm text-gray-600">Seller on Barterly</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              {isAuthenticated && user?.id !== product.seller.id ? (
                <button
                  onClick={() => setShowOfferModal(true)}
                  className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-3 font-semibold text-lg"
                >
                  <MessageCircle size={20} />
                  Make an Offer
                </button>
              ) : !isAuthenticated ? (
                <button
                  onClick={() => navigate("/login")}
                  className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-3 font-semibold text-lg"
                >
                  <MessageCircle size={20} />
                  Login to Make Offer
                </button>
              ) : (
                <div className="flex-1 bg-gray-200 text-gray-500 py-4 px-6 rounded-xl flex items-center justify-center gap-3 font-semibold text-lg">
                  <ShoppingCart size={20} />
                  Your Product
                </div>
              )}

              <button className="px-6 py-4 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                <Flag size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Make Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            {offerSuccess ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Offer Submitted!
                </h3>
                <p className="text-gray-600">
                  Your offer has been sent to the seller.
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Make an Offer
                  </h3>
                  <button
                    onClick={() => setShowOfferModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900">
                    {product.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Listed at: ₹{Number(product.price).toLocaleString()}
                  </p>
                  {/* {product.min_offer_price > 0 && (
                    <p className="text-sm text-amber-600">
                      Minimum offer: ₹
                      {Number(product.min_offer_price).toLocaleString()}
                    </p>
                  )} */}
                </div>

                {offerError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-red-700 text-sm">{offerError}</span>
                  </div>
                )}

                <form onSubmit={handleMakeOffer} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Offer (₹)
                    </label>
                    <input
                      type="number"
                      value={offerData.price}
                      onChange={(e) =>
                        setOfferData({ ...offerData, price: e.target.value })
                      }
                      min={product.min_offer_price || 1}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message (Optional)
                    </label>
                    <textarea
                      value={offerData.message}
                      onChange={(e) =>
                        setOfferData({ ...offerData, message: e.target.value })
                      }
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Add a message to your offer..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowOfferModal(false)}
                      className="flex-1 px-4 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={offerLoading}
                      className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {offerLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Send Offer
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
