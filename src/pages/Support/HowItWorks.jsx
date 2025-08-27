import React from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MessageCircle,
  Handshake,
  Package,
  User,
  DollarSign,
  Shield,
  Star,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: <Search className="w-8 h-8 text-blue-600" />,
      title: "Browse Products",
      description:
        "Search through thousands of products from various categories and find exactly what you're looking for.",
      details: [
        "Filter by category, price, location, and condition",
        "View detailed product descriptions and images",
        "Check seller ratings and reviews",
      ],
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-green-600" />,
      title: "Start Negotiating",
      description:
        "Make an offer on any product and negotiate directly with the seller to get the best price.",
      details: [
        "Make your initial offer with a personal message",
        "Receive counter-offers from sellers",
        "Chat and negotiate until you reach an agreement",
      ],
    },
    {
      icon: <Handshake className="w-8 h-8 text-purple-600" />,
      title: "Complete the Deal",
      description:
        "Once you agree on a price, finalize the transaction and arrange payment and delivery.",
      details: [
        "Secure payment processing",
        "Exchange contact information",
        "Arrange pickup or delivery",
      ],
    },
    {
      icon: <Star className="w-8 h-8 text-yellow-600" />,
      title: "Rate & Review",
      description:
        "Share your experience and help build trust in the Barterly community.",
      details: [
        "Rate your transaction experience",
        "Leave feedback for other users",
        "Build your reputation as a trusted member",
      ],
    },
  ];

  const benefits = [
    {
      icon: <DollarSign className="w-6 h-6 text-green-500" />,
      title: "Better Prices",
      description: "Get the best deals through direct negotiation",
    },
    {
      icon: <Shield className="w-6 h-6 text-blue-500" />,
      title: "Safe & Secure",
      description: "Verified users and secure payment processing",
    },
    {
      icon: <User className="w-6 h-6 text-purple-500" />,
      title: "Personal Touch",
      description: "Direct communication with real people",
    },
    {
      icon: <Package className="w-6 h-6 text-orange-500" />,
      title: "Quality Products",
      description: "Curated marketplace with quality listings",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              How Barterly Works
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Your guide to buying and selling with confidence on Barterly
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-50 font-semibold text-lg transition-colors shadow-lg"
            >
              Get Started Today
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Steps Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Four Simple Steps
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Getting started with Barterly is easy. Follow these simple steps to
            start buying and selling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200"
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4">
                  {step.icon}
                </div>
                <div className="text-sm font-semibold text-blue-600 mb-2">
                  STEP {index + 1}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 mb-4">{step.description}</p>
              </div>
              <ul className="space-y-2">
                {step.details.map((detail, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-2xl p-8 mb-16 shadow-sm border border-gray-200">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Barterly?
            </h2>
            <p className="text-lg text-gray-600">
              Join thousands of satisfied users who trust Barterly for their
              buying and selling needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-50 rounded-lg mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* For Sellers Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-blue-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              For Sellers
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <strong className="text-gray-900">List for Free:</strong>
                  <span className="text-gray-700 ml-2">
                    Create product listings at no cost
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <strong className="text-gray-900">Set Your Price:</strong>
                  <span className="text-gray-700 ml-2">
                    Accept, reject, or counter any offer
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <strong className="text-gray-900">Reach More Buyers:</strong>
                  <span className="text-gray-700 ml-2">
                    Access thousands of potential customers
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <strong className="text-gray-900">
                    Secure Transactions:
                  </strong>
                  <span className="text-gray-700 ml-2">
                    Safe payment processing and user verification
                  </span>
                </div>
              </li>
            </ul>
            <Link
              to="/sell"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Start Selling
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="bg-green-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              For Buyers
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <strong className="text-gray-900">Browse Free:</strong>
                  <span className="text-gray-700 ml-2">
                    Search and explore products without any fees
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <strong className="text-gray-900">Negotiate Prices:</strong>
                  <span className="text-gray-700 ml-2">
                    Make offers and get the best deals
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <strong className="text-gray-900">Quality Assurance:</strong>
                  <span className="text-gray-700 ml-2">
                    Verified sellers and detailed product information
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <strong className="text-gray-900">
                    Direct Communication:
                  </strong>
                  <span className="text-gray-700 ml-2">
                    Chat directly with sellers before buying
                  </span>
                </div>
              </li>
            </ul>
            <Link
              to="/"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
            >
              Start Shopping
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-xl opacity-90 mb-8">
            Join Barterly today and discover a better way to buy and sell
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-50 font-semibold transition-colors"
            >
              Sign Up Free
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white rounded-xl hover:bg-white hover:text-blue-600 font-semibold transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
