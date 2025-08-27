import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Check,
  X,
  Star,
  Zap,
  Crown,
  ArrowRight,
  Users,
  Package,
  Shield,
  Headphones,
} from "lucide-react";

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState("monthly"); // monthly or yearly

  const plans = [
    {
      name: "Free",
      description: "Perfect for getting started",
      price: { monthly: 0, yearly: 0 },
      color: "gray",
      icon: <Users className="w-6 h-6" />,
      features: [
        "List up to 5 products",
        "Basic negotiation tools",
        "Community support",
        "Standard listing visibility",
        "Basic seller profile"
      ],
      limitations: [
        "Limited to 5 active listings",
        "No priority support",
        "Standard search ranking"
      ],
      cta: "Get Started Free",
      popular: false
    },
    {
      name: "Pro",
      description: "For serious sellers",
      price: { monthly: 499, yearly: 4990 },
      color: "blue",
      icon: <Zap className="w-6 h-6" />,
      features: [
        "List up to 50 products",
        "Advanced negotiation tools",
        "Priority customer support",
        "Featured listing placement",
        "Enhanced seller profile",
        "Sales analytics dashboard",
        "Bulk listing tools",
        "Custom offer templates"
      ],
      limitations: [],
      cta: "Start Pro Trial",
      popular: true
    },
    {
      name: "Business",
      description: "For large-scale operations",
      price: { monthly: 1499, yearly: 14990 },
      color: "purple",
      icon: <Crown className="w-6 h-6" />,
      features: [
        "Unlimited product listings",
        "Advanced analytics & insights",
        "Dedicated account manager",
        "Priority listing placement",
        "Custom branding options",
        "API access",
        "Bulk import/export tools",
        "Advanced seller verification",
        "Custom negotiation workflows",
        "White-label options"
      ],
      limitations: [],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const getColorClasses = (color, popular = false) => {
    const colors = {
      gray: {
        bg: "bg-gray-50",
        border: popular ? "border-gray-500" : "border-gray-200",
        text: "text-gray-600",
        button: "bg-gray-600 hover:bg-gray-700",
        icon: "text-gray-500"
      },
      blue: {
        bg: "bg-blue-50",
        border: popular ? "border-blue-500" : "border-blue-200",
        text: "text-blue-600",
        button: "bg-blue-600 hover:bg-blue-700",
        icon: "text-blue-500"
      },
      purple: {
        bg: "bg-purple-50",
        border: popular ? "border-purple-500" : "border-purple-200",
        text: "text-purple-600",
        button: "bg-purple-600 hover:bg-purple-700",
        icon: "text-purple-500"
      }
    };
    return colors[color];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Choose the plan that fits your needs. Start free and upgrade as you grow.
            </p>
            
            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-white bg-opacity-20 rounded-lg p-1 mb-8">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  billingCycle === "monthly"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-white hover:text-blue-100"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  billingCycle === "yearly"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-white hover:text-blue-100"
                }`}
              >
                Yearly
                <span className="ml-2 text-xs bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full">
                  Save 17%
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const colors = getColorClasses(plan.color, plan.popular);
            const price = plan.price[billingCycle];
            const yearlyPrice = plan.price.yearly;
            const monthlyEquivalent = Math.round(yearlyPrice / 12);
            
            return (
              <div
                key={plan.name}
                className={`relative bg-white rounded-2xl shadow-lg border-2 ${colors.border} overflow-hidden ${
                  plan.popular ? "transform scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                
                <div className={`${colors.bg} px-6 pt-6 ${plan.popular ? "pt-10" : ""} pb-6`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg bg-white ${colors.icon}`}>
                      {plan.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                      <p className="text-gray-600">{plan.description}</p>
                    </div>
                  </div>
                  
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-900">₹{price}</span>
                      <span className="text-gray-600 ml-1">
                        /{billingCycle === "monthly" ? "month" : "year"}
                      </span>
                    </div>
                    {billingCycle === "yearly" && price > 0 && (
                      <p className="text-sm text-gray-600 mt-1">
                        ₹{monthlyEquivalent}/month billed annually
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <button
                    className={`w-full ${colors.button} text-white py-3 px-6 rounded-lg font-semibold transition-colors mb-6`}
                  >
                    {plan.cta}
                  </button>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Features included:</h4>
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                    
                    {plan.limitations.length > 0 && (
                      <div className="pt-3 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-3">Limitations:</h4>
                        {plan.limitations.map((limitation, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-500 text-sm">{limitation}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Features Comparison */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-16">
          <div className="px-6 py-8 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 text-center">
              Compare Plans
            </h2>
            <p className="text-gray-600 text-center mt-2">
              See what's included in each plan
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Features
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Free
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Pro
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Business
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { feature: "Product Listings", free: "5", pro: "50", business: "Unlimited" },
                  { feature: "Basic Support", free: true, pro: true, business: true },
                  { feature: "Priority Support", free: false, pro: true, business: true },
                  { feature: "Analytics Dashboard", free: false, pro: true, business: true },
                  { feature: "Featured Listings", free: false, pro: true, business: true },
                  { feature: "API Access", free: false, pro: false, business: true },
                  { feature: "Dedicated Account Manager", free: false, pro: false, business: true },
                  { feature: "Custom Branding", free: false, pro: false, business: true }
                ].map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {row.feature}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {typeof row.free === 'boolean' ? (
                        row.free ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm text-gray-600">{row.free}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm text-gray-600">{row.pro}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {typeof row.business === 'boolean' ? (
                        row.business ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm text-gray-600">{row.business}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                question: "Can I change my plan at any time?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and you'll be charged or credited accordingly."
              },
              {
                question: "Is there a free trial for paid plans?",
                answer: "Yes, we offer a 14-day free trial for both Pro and Business plans. No credit card required to start your trial."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, UPI, net banking, and popular digital wallets. All transactions are secure and encrypted."
              },
              {
                question: "Do you offer refunds?",
                answer: "Yes, we offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, we'll refund your payment in full."
              },
              {
                question: "Is there a setup fee?",
                answer: "No, there are no setup fees or hidden charges. You only pay the plan price, and that includes everything listed in the features."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-xl opacity-90 mb-8">
            Join thousands of sellers who trust Barterly to grow their business
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-50 font-semibold transition-colors"
            >
              Start Free Trial
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white rounded-xl hover:bg-white hover:text-blue-600 font-semibold transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;