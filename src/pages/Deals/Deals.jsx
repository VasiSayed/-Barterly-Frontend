import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Handshake,
  CheckCircle,
  Clock,
  Package,
  Truck,
  User,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  RefreshCw,
  ShoppingCart,
  Store,
} from "lucide-react";
import axios from "axios";

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("purchases");
  const [purchasesCount, setPurchasesCount] = useState(0);
  const [salesCount, setSalesCount] = useState(0);

  useEffect(() => {
    loadDeals();
  }, [activeTab]);

  const loadDeals = async () => {
    try {
      const endpoint =
        activeTab === "purchases"
          ? "/deals/purchases/"
          : "/deals/sales/";
      const response = await axios.get(endpoint);

      const data = response.data;
      setDeals(data.results || data);

      if (activeTab === "purchases") {
        setPurchasesCount(data.results?.length || data.length || 0);
        // If sales_count is provided in purchases response
        if (data.sales_count !== undefined) {
          setSalesCount(data.sales_count);
        }
      } else {
        setSalesCount(data.results?.length || data.length || 0);
        // If purchases_count is provided in sales response
        if (data.purchases_count !== undefined) {
          setPurchasesCount(data.purchases_count);
        }
      }
    } catch (error) {
      console.error("Failed to load deals:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadDeals();
  };

  const handleStatusUpdate = async (dealId, status) => {
    try {
      await axios.patch(`/deals/${dealId}/update-status/`, { status });
      loadDeals();
    } catch (error) {
      if (
        error.response?.data?.detail ===
        "You are not authorized to update this deal."
      ) {
        alert("You are not authorized to update this deal.");
      } else {
        console.error("Failed to update status:", error);
        alert("Failed to update status. Please try again.");
      }
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="w-5 h-5 text-yellow-600" />,
      paid: <CheckCircle className="w-5 h-5 text-green-600" />,
      shipped: <Truck className="w-5 h-5 text-blue-600" />,
      completed: <CheckCircle className="w-5 h-5 text-green-600" />,
      canceled: <Package className="w-5 h-5 text-red-600" />,
    };
    return icons[status] || icons.pending;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      paid: "bg-green-100 text-green-800 border-green-200",
      shipped: "bg-blue-100 text-blue-800 border-blue-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      canceled: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || colors.pending;
  };

  const filteredDeals = deals.filter(
    (deal) => filter === "all" || deal.status === filter
  );

  const statusCounts = {
    all: deals.length,
    pending: deals.filter((d) => d.status === "pending").length,
    paid: deals.filter((d) => d.status === "paid").length,
    shipped: deals.filter((d) => d.status === "shipped").length,
    completed: deals.filter((d) => d.status === "completed").length,
    canceled: deals.filter((d) => d.status === "canceled").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading deals...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Your Deals</h1>
              <p className="text-gray-600 mt-2">
                Track and manage your completed transactions
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

        {/* Purchases/Sales Toggle */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="flex">
            <button
              onClick={() => {
                setActiveTab("purchases");
                setLoading(true);
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "purchases"
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <ShoppingCart size={18} />
              My Purchases
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                {purchasesCount}
              </span>
            </button>
            <button
              onClick={() => {
                setActiveTab("sales");
                setLoading(true);
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "sales"
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Store size={18} />
              My Sales
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                {salesCount}
              </span>
            </button>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="flex overflow-x-auto">
            {[
              { key: "all", label: "All", count: statusCounts.all },
              { key: "pending", label: "Pending", count: statusCounts.pending },
              { key: "paid", label: "Paid", count: statusCounts.paid },
              { key: "shipped", label: "Shipped", count: statusCounts.shipped },
              {
                key: "completed",
                label: "Completed",
                count: statusCounts.completed,
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

        {/* Deals List */}
        {filteredDeals.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Handshake className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {filter === "all"
                ? `No ${activeTab === "purchases" ? "purchases" : "sales"} yet`
                : `No ${filter} ${activeTab}`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === "all"
                ? activeTab === "purchases"
                  ? "Complete negotiations to see your purchases here."
                  : "When your products are sold, they'll appear here."
                : `You don't have any ${filter} ${activeTab} at the moment.`}
            </p>
            <Link
              to="/negotiations"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Negotiations
              <ExternalLink size={16} />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredDeals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                userType={activeTab}
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Deal Card Component
const DealCard = ({ deal, userType, onStatusUpdate }) => {
  const [showContactInfo, setShowContactInfo] = useState(false);

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="w-5 h-5 text-yellow-600" />,
      paid: <CheckCircle className="w-5 h-5 text-green-600" />,
      shipped: <Truck className="w-5 h-5 text-blue-600" />,
      completed: <CheckCircle className="w-5 h-5 text-green-600" />,
      canceled: <Package className="w-5 h-5 text-red-600" />,
    };
    return icons[status] || icons.pending;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      paid: "bg-green-100 text-green-800 border-green-200",
      shipped: "bg-blue-100 text-blue-800 border-blue-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      canceled: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || colors.pending;
  };

  const getNextSteps = (status) => {
    if (userType === "purchases") {
      const steps = {
        pending: "Complete payment to proceed",
        paid: "Item will be shipped soon",
        shipped: "Package is on the way",
        completed: "Purchase completed successfully",
        canceled: "Purchase has been canceled",
      };
      return steps[status] || "Processing...";
    } else {
      const steps = {
        pending: "Waiting for buyer payment",
        paid: "Ready to ship item",
        shipped: "Item shipped to buyer",
        completed: "Sale completed successfully",
        canceled: "Sale has been canceled",
      };
      return steps[status] || "Processing...";
    }
  };

  const getActionButton = (status) => {
    if (userType === "purchases") {
      switch (status) {
        case "pending":
          return (
            <button
              onClick={() => onStatusUpdate(deal.id, "paid")}
              className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Mark as Paid
            </button>
          );
        case "shipped":
          return (
            <button
              onClick={() => onStatusUpdate(deal.id, "completed")}
              className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Confirm Received
            </button>
          );
        default:
          return null;
      }
    } else {
      switch (status) {
        case "paid":
          return (
            <button
              onClick={() => onStatusUpdate(deal.id, "shipped")}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Mark as Shipped
            </button>
          );
        default:
          return null;
      }
    }
  };

  const otherUser = userType === "purchases" ? deal.seller : deal.buyer;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Deal #{deal.id.slice(0, 8)}
              </h3>
              <span
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                  deal.status
                )}`}
              >
                {getStatusIcon(deal.status)}
                {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>
                  Created {new Date(deal.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign size={16} />
                <span>
                  Agreed Price: ₹{Number(deal.agreed_price).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>
                  {userType === "purchases" ? "Seller:" : "Buyer:"}{" "}
                  {otherUser?.username || otherUser?.full_name}
                </span>
              </div>
            </div>
          </div>

          <Link
            to={`/products/${deal.product}`}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
          >
            View Product
            <ExternalLink size={14} />
          </Link>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">
              {deal.product?.title || "Product"}
            </h4>
            <p className="text-sm text-gray-600">{getNextSteps(deal.status)}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              ₹{Number(deal.agreed_price).toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">Final Price</div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900">Contact Information</h4>
          <button
            onClick={() => setShowContactInfo(!showContactInfo)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {showContactInfo ? "Hide Details" : "Show Contact Details"}
          </button>
        </div>

        {showContactInfo && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Your Info */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h5 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <User size={16} />
                You ({userType === "purchases" ? "Buyer" : "Seller"})
              </h5>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-blue-700">
                  <User size={14} />
                  <span>Your Username</span>
                </div>
                <div className="flex items-center gap-2 text-blue-700">
                  <Mail size={14} />
                  <span>your@email.com</span>
                </div>
                <div className="flex items-center gap-2 text-blue-700">
                  <Phone size={14} />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-2 text-blue-700">
                  <MapPin size={14} />
                  <span>Your Location</span>
                </div>
              </div>
            </div>

            {/* Other User Info */}
            <div className="bg-green-50 rounded-lg p-4">
              <h5 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                <User size={16} />
                {userType === "purchases" ? "Seller" : "Buyer"}
              </h5>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-green-700">
                  <User size={14} />
                  <span>
                    {otherUser?.username || otherUser?.full_name || "Username"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-green-700">
                  <Mail size={14} />
                  <span>{otherUser?.email || "email@example.com"}</span>
                </div>
                <div className="flex items-center gap-2 text-green-700">
                  <Phone size={14} />
                  <span>{otherUser?.phone || "+91 98765 43210"}</span>
                </div>
                <div className="flex items-center gap-2 text-green-700">
                  <MapPin size={14} />
                  <span>{otherUser?.location || "Location"}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          {getActionButton(deal.status)}
          <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Report Issue
          </button>
          <button
            onClick={() => onStatusUpdate(deal.id, "canceled")}
            className="px-6 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            Cancel Deal
          </button>
        </div>
      </div>
    </div>
  );
};

export default Deals;
