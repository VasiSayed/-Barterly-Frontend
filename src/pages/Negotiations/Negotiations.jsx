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
  ChevronDown,
  ChevronUp,
  Flag,
  X,
} from "lucide-react";
import axios from "axios";

// Toast Notification Component
const Toast = ({ message, type = "error", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
  }[type];

  const icon = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <AlertCircle className="w-5 h-5" />,
  }[type];

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-full">
      <div
        className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 max-w-md`}
      >
        {icon}
        <span className="flex-1">{message}</span>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const Negotiations = () => {
  const [negotiations, setNegotiations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, open, accepted, rejected, canceled
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("buying"); // buying or selling
  const [buyingCount, setBuyingCount] = useState(0);
  const [sellingCount, setSellingCount] = useState(0);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "error") => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

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
        if (data.selling_count !== undefined) {
          setSellingCount(data.selling_count);
        }
      } else {
        setSellingCount(data.results?.length || data.length || 0);
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
      showToast("Offer accepted successfully!", "success");
      loadNegotiations();
    } catch (error) {
      console.error("Failed to accept offer:", error);
      showToast("Failed to accept offer. Please try again.", "error");
    }
  };

  const handleReject = async (negotiationId) => {
    try {
      await axios.post(`/negotiations/${negotiationId}/reject/`);
      showToast("Offer rejected", "info");
      loadNegotiations();
    } catch (error) {
      console.error("Failed to reject offer:", error);
      showToast("Failed to reject offer. Please try again.", "error");
    }
  };

  const handleCancel = async (negotiationId) => {
    try {
      await axios.post(`/negotiations/${negotiationId}/cancel/`);
      showToast("Negotiation cancelled", "info");
      loadNegotiations();
    } catch (error) {
      console.error("Failed to cancel negotiation:", error);
      showToast("Failed to cancel negotiation. Please try again.", "error");
    }
  };

  const handleCounterOffer = async (negotiationId, price, message) => {
    try {
      const endpoint = `/negotiations/${negotiationId}/offer/`;
      await axios.post(endpoint, {
        price: parseFloat(price),
        message: message,
      });
      showToast("Counter offer sent successfully!", "success");
      loadNegotiations();
    } catch (error) {
      console.error("Failed to make counter offer:", error);
      showToast("Failed to make counter offer. Please try again.", "error");
    }
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
      {/* Toast Notification */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Negotiations</h1>
              <p className="text-gray-600 mt-2">
                Manage your product negotiations and messages
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
                showToast={showToast}
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
  showToast,
}) => {
  const [showCounterOffer, setShowCounterOffer] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [counterOfferData, setCounterOfferData] = useState({
    price: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [reportingMessage, setReportingMessage] = useState(null);

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

  // Load messages when chat is opened
  const loadMessages = async () => {
    if (loadingMessages) return;

    setLoadingMessages(true);
    try {
      const response = await axios.get(
        `/negotiations/${negotiation.id}/messages/`
      );
      setMessages(response.data.results || response.data || []);
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Send a new message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSendingMessage(true);
    try {
      const response = await axios.post(
        `/negotiations/${negotiation.id}/send_message/`,
        {
          message: newMessage.trim(),
        }
      );

      setNewMessage("");
      // Add the new message directly to avoid waiting for refresh
      setMessages((prev) => [...prev, response.data]);
      showToast("Message sent successfully!", "success");
    } catch (error) {
      console.error("Failed to send message:", error);
      if (error.response?.data?.detail?.includes("blocked")) {
        showToast(
          `You are temporarily blocked from sending messages: ${error.response.data.detail}`,
          "warning"
        );
      } else {
        showToast("Failed to send message. Please try again.", "error");
      }
    } finally {
      setSendingMessage(false);
    }
  };

  // Report a message
  const reportMessage = async (messageId, reason = "Inappropriate content") => {
    if (reportingMessage === messageId) return;

    setReportingMessage(messageId);
    try {
      await axios.post(`/negotiations/${negotiation.id}/report-message/`, {
        message_id: messageId,
        reason: reason,
      });
      showToast(
        "Message reported successfully. Thank you for helping keep our platform safe.",
        "success"
      );
    } catch (error) {
      console.error("Failed to report message:", error);
      if (error.response?.data?.detail === "Already reported") {
        showToast("You have already reported this message.", "info");
      } else {
        showToast("Failed to report message. Please try again.", "error");
      }
    } finally {
      setReportingMessage(null);
    }
  };

  // Auto-refresh messages every 5 seconds when chat is open
  useEffect(() => {
    let interval;
    if (showMessages) {
      loadMessages(); // Initial load
      interval = setInterval(loadMessages, 5000); // Refresh every 5 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showMessages, negotiation.id]);

  const toggleMessages = () => {
    setShowMessages(!showMessages);
    if (!showMessages) {
      loadMessages();
    }
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
  const currentUser =
    userType === "buying" ? negotiation.buyer : negotiation.seller;

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
            to={`/products/${negotiation.product?.id || negotiation.product}`}
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
                  <DollarSign className="w-4 h-4 text-white" />
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

      {/* Messages Section */}
      <div className="border-b border-gray-200">
        <button
          onClick={toggleMessages}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-900">Messages</span>
            {messages.length > 0 && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                {messages.length}
              </span>
            )}
          </div>
          {showMessages ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {showMessages && (
          <div className="border-t border-gray-200 bg-gray-50">
            {/* Messages List */}
            <div className="max-h-80 overflow-y-auto p-4 space-y-3">
              {loadingMessages ? (
                <div className="text-center py-4">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm">No messages yet</p>
                  <p className="text-xs">Start a conversation below</p>
                </div>
              ) : (
                messages.map((message) => {
                  const isMyMessage =
                    message.sender?.username === currentUser?.username;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${
                        isMyMessage ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg relative group ${
                          isMyMessage
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-900 border border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium">
                            {message.sender?.username ||
                              message.sender?.full_name ||
                              "User"}
                          </span>
                          <span
                            className={`text-xs ${
                              isMyMessage ? "text-blue-100" : "text-gray-500"
                            }`}
                          >
                            {new Date(message.created_at).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                        <p className="text-sm">{message.message}</p>

                        {/* Report Button - only show for other user's messages */}
                        {!isMyMessage && (
                          <button
                            onClick={() => reportMessage(message.id)}
                            disabled={reportingMessage === message.id}
                            className={`absolute -top-2 -right-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
                              reportingMessage === message.id
                                ? "bg-gray-400"
                                : "bg-red-500 hover:bg-red-600"
                            } text-white text-xs`}
                            title="Report message"
                          >
                            {reportingMessage === message.id ? (
                              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Flag className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <form onSubmit={sendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={sendingMessage}
                />
                <button
                  type="submit"
                  disabled={sendingMessage || !newMessage.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {sendingMessage ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {!sendingMessage && "Send"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

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
                    Counter Offer (₹)
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
