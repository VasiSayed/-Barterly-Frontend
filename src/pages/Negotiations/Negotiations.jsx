import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MessageCircle,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
  ArrowRight,
  User,
  Calendar,
  DollarSign,
  Filter,
  RefreshCw,
  ShoppingCart,
  Store,
} from "lucide-react";
import axios from "axios";

const Negotiations = () => {
  const [negotiations, setNegotiations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, open, accepted, rejected, canceled
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("buying"); // buying or selling
  const [buyingCount, setBuyingCount] = useState(0);
  const [sellingCount, setSellingCount] = useState(0);

  useEffect(() => {
    loadNegotiations();
  }, [activeTab]);

  const loadNegotiations = async () => {
    try {
      const endpoint =
        activeTab === "buying"
          ? "/negotiations/buying/"
          : "/negotiations/selling/";
      const response = await axios.get(endpoint);

      const data = response.data;
      setNegotiations(data.results || data);

      // Handle the counts from API response
      if (activeTab === "buying") {
        setBuyingCount(data.results?.length || data.length || 0);
        // If selling_count is provided in buying response
        if (data.selling_count !== undefined) {
          setSellingCount(data.selling_count);
        }
      } else {
        setSellingCount(data.results?.length || data.length || 0);
        // If buying_count is provided in selling response
        if (data.buying_count !== undefined) {
          setBuyingCount(data.buying_count);
        }
      }
    } catch (error) {
      console.error("Failed to load negotiations:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadNegotiations();
  };

  const handleAccept = async (negotiationId) => {
    try {
      await axios.post(`/negotiations/${negotiationId}/accept/`);
      loadNegotiations();
    } catch (error) {
      console.error("Failed to accept offer:", error);
      alert("Failed to accept offer. Please try again.");
    }
  };

  const handleReject = async (negotiationId) => {
    try {
      await axios.post(`/negotiations/${negotiationId}/reject/`);
      loadNegotiations();
    } catch (error) {
      console.error("Failed to reject offer:", error);
      alert("Failed to reject offer. Please try again.");
    }
  };

  const handleCancel = async (negotiationId) => {
    try {
      await axios.post(`/negotiations/${negotiationId}/cancel/`);
      loadNegotiations();
    } catch (error) {
      console.error("Failed to cancel negotiation:", error);
      alert("Failed to cancel negotiation. Please try again.");
    }
  };

  const handleCounterOffer = async (negotiationId, price, message) => {
    try {
      // All counter offers on existing negotiations use the /offer/ endpoint
      // regardless of whether user is buying or selling
      const endpoint = `/negotiations/${negotiationId}/offer/`;

      await axios.post(endpoint, {
        price: parseFloat(price),
        message: message,
      });
      loadNegotiations();
    } catch (error) {
      console.error("Failed to make counter offer:", error);
      alert("Failed to make counter offer. Please try again.");
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      open: <Clock className="w-5 h-5 text-blue-600" />,
      accepted: <CheckCircle className="w-5 h-5 text-green-600" />,
      rejected: <XCircle className="w-5 h-5 text-red-600" />,
      canceled: <AlertCircle className="w-5 h-5 text-gray-600" />,
    };
    return icons[status] || icons.open;
  };

  const getStatusColor = (status) => {
    const colors = {
      open: "bg-blue-100 text-blue-800 border-blue-200",
      accepted: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
      canceled: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[status] || colors.open;
  };

  const filteredNegotiations = negotiations.filter(
    (neg) => filter === "all" || neg.status === filter
  );

  const statusCounts = {
    all: negotiations.length,
    open: negotiations.filter((n) => n.status === "open").length,
    accepted: negotiations.filter((n) => n.status === "accepted").length,
    rejected: negotiations.filter((n) => n.status === "rejected").length,
    canceled: negotiations.filter((n) => n.status === "canceled").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading negotiations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Negotiations</h1>
              <p className="text-gray-600 mt-2">
                Manage your product negotiations
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
        </div>

        {/* Buying/Selling Toggle */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="flex">
            <button
              onClick={() => {
                setActiveTab("buying");
                setLoading(true);
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "buying"
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <ShoppingCart size={18} />
              My Offers (Buying)
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                {buyingCount}
              </span>
            </button>
            <button
              onClick={() => {
                setActiveTab("selling");
                setLoading(true);
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "selling"
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Store size={18} />
              Received Offers (Selling)
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                {sellingCount}
              </span>
            </button>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="flex overflow-x-auto">
            {[
              { key: "all", label: "All", count: statusCounts.all },
              { key: "open", label: "Active", count: statusCounts.open },
              {
                key: "accepted",
                label: "Accepted",
                count: statusCounts.accepted,
              },
              {
                key: "rejected",
                label: "Rejected",
                count: statusCounts.rejected,
              },
              {
                key: "canceled",
                label: "Canceled",
                count: statusCounts.canceled,
              },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex-1 min-w-0 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  filter === key
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>{label}</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {count}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Negotiations List */}
        {filteredNegotiations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {filter === "all"
                ? `No ${
                    activeTab === "buying" ? "offers made" : "offers received"
                  } yet`
                : `No ${filter} negotiations`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === "all"
                ? activeTab === "buying"
                  ? "Start making offers on products to see negotiations here."
                  : "When buyers make offers on your products, they'll appear here."
                : `You don't have any ${filter} negotiations at the moment.`}
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {activeTab === "buying" ? "Browse Products" : "View My Products"}
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredNegotiations.map((negotiation) => (
              <NegotiationCard
                key={negotiation.id}
                negotiation={negotiation}
                onAccept={handleAccept}
                onReject={handleReject}
                onCancel={handleCancel}
                onCounterOffer={handleCounterOffer}
                userType={activeTab}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Negotiation Card Component
const NegotiationCard = ({
  negotiation,
  onAccept,
  onReject,
  onCancel,
  onCounterOffer,
  userType,
}) => {
  const [showCounterOffer, setShowCounterOffer] = useState(false);
  const [counterOfferData, setCounterOfferData] = useState({
    price: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const getStatusIcon = (status) => {
    const icons = {
      open: <Clock className="w-5 h-5 text-blue-600" />,
      accepted: <CheckCircle className="w-5 h-5 text-green-600" />,
      rejected: <XCircle className="w-5 h-5 text-red-600" />,
      canceled: <AlertCircle className="w-5 h-5 text-gray-600" />,
    };
    return icons[status] || icons.open;
  };

  const getStatusColor = (status) => {
    const colors = {
      open: "bg-blue-100 text-blue-800 border-blue-200",
      accepted: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
      canceled: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[status] || colors.open;
  };

  const handleSubmitCounterOffer = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onCounterOffer(
        negotiation.id,
        counterOfferData.price,
        counterOfferData.message
      );
      setShowCounterOffer(false);
      setCounterOfferData({ price: "", message: "" });
    } catch (error) {
      console.error("Counter offer failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const otherUser =
    userType === "buying" ? negotiation.seller : negotiation.buyer;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {negotiation.product?.title || "Product"}
              </h3>
              <span
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                  negotiation.status
                )}`}
              >
                {getStatusIcon(negotiation.status)}
                {negotiation.status.charAt(0).toUpperCase() +
                  negotiation.status.slice(1)}
              </span>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                Started {new Date(negotiation.created_at).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <DollarSign size={16} />
                Current offer: ₹
                {Number(negotiation.last_offer_price).toLocaleString()}
              </div>
              <div className="flex items-center gap-1">
                <User size={16} />
                {userType === "buying" ? "Seller:" : "Buyer:"}{" "}
                {otherUser?.username || otherUser?.full_name}
              </div>
            </div>
          </div>

          <Link
            to={`/products/${negotiation.product}`}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View Product →
          </Link>
        </div>
      </div>

      {/* Offer History */}
      {negotiation.rounds && negotiation.rounds.length > 0 && (
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">
            Recent Offers
          </h4>
          <div className="space-y-3">
            {negotiation.rounds.slice(-3).map((round, index) => (
              <div
                key={round.id}
                className={`flex items-start gap-3 p-4 rounded-lg ${
                  index === negotiation.rounds.slice(-3).length - 1
                    ? "bg-blue-50 border border-blue-200"
                    : "bg-gray-50"
                }`}
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">
                      {round.offered_by?.username ||
                        round.offered_by?.full_name ||
                        "User"}
                    </span>
                    <span className="text-lg font-bold text-blue-600">
                      ₹{Number(round.price).toLocaleString()}
                    </span>
                  </div>
                  {round.message && (
                    <p className="text-sm text-gray-600">{round.message}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(round.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {negotiation.status === "open" && (
        <div className="p-6 bg-gray-50">
          {!showCounterOffer ? (
            <div className="flex gap-3">
              {userType === "selling" && (
                <>
                  <button
                    onClick={() => onAccept(negotiation.id)}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} />
                    Accept Offer
                  </button>
                  <button
                    onClick={() => onReject(negotiation.id)}
                    className="px-6 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Reject
                  </button>
                </>
              )}
              <button
                onClick={() => setShowCounterOffer(true)}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Send size={18} />
                {userType === "buying" ? "Make Counter Offer" : "Counter Offer"}
              </button>
              <button
                onClick={() => onCancel(negotiation.id)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitCounterOffer} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {userType === "buying" ? "Counter Offer" : "Counter Offer"}{" "}
                    (₹)
                  </label>
                  <input
                    type="number"
                    value={counterOfferData.price}
                    onChange={(e) =>
                      setCounterOfferData({
                        ...counterOfferData,
                        price: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message (Optional)
                  </label>
                  <input
                    type="text"
                    value={counterOfferData.message}
                    onChange={(e) =>
                      setCounterOfferData({
                        ...counterOfferData,
                        message: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Add a message..."
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Counter Offer
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCounterOffer(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Accepted Deal Info */}
      {negotiation.status === "accepted" && (
        <div className="p-6 bg-green-50 border-t border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-900">
              {userType === "buying" ? "Offer Accepted!" : "Deal Confirmed!"}
            </span>
          </div>
          <p className="text-sm text-green-700">
            {userType === "buying"
              ? "The seller has accepted your offer. Check your deals page for contact information and next steps."
              : "You've accepted this offer. Check your deals page for contact information and next steps."}
          </p>
          <Link
            to="/deals"
            className="inline-flex items-center gap-2 mt-3 text-green-600 hover:text-green-700 font-medium"
          >
            View Deal Details
            <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default Negotiations;
