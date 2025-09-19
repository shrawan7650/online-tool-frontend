import React, { useState, useEffect } from "react";
import { X, Crown, Zap, Check, Loader2, AlertCircle } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { LoginModal } from "./LoginModal";
import { updateUser } from "../../store/slices/userSlice";
import axios from "axios";
import toast from "react-hot-toast";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiresLogin?: boolean;
  requiredPlan?: "pro" | "maxpro";
  isExpired?: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function SubscriptionModal({
  isOpen,
  onClose,
  requiresLogin = false,
  requiredPlan = "pro",
  isExpired = false,
}: SubscriptionModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>(requiredPlan);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL_PRODUCTION || "http://localhost:8080";

  useEffect(() => {
    if (isOpen) {
      fetchPlans();
      loadRazorpayScript();
    }
  }, [isOpen]);

  const fetchPlans = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/subscription/plans`
      );
      setPlans(response.data.plans);
    } catch (error) {
      toast.error("Failed to load subscription plans");
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = resolve;
      document.body.appendChild(script);
    });
  };

  const handleSubscribe = async (planType: string) => {
    if (!isAuthenticated || !user) {
      setShowLoginModal(true);
      return;
    }

    setLoading(true);
    try {
      // Create subscription
      const response = await axios.post(
        `${API_BASE_URL}/api/subscription/create`,
        { planType },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "online-tool-token"
            )}`,
          },
        }
      );

      const { subscription } = response.data;

      // Initialize Razorpay payment
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        subscription_id: subscription.id,
        name: "Online Tools Pro",
        description: `${subscription.planName} Subscription`,
        image: "/favicon.svg",
        handler: async (response: any) => {
          try {
            // Verify payment
            await axios.post(
              `${API_BASE_URL}/api/subscription/verify`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "online-tool-token"
                  )}`,
                },
              }
            );

            // Update user state
            dispatch(
              updateUser({
                isPro: true,
                isMaxPro: planType === "maxpro",
                subscriptionStatus: "active",
              })
            );

            toast.success("Subscription activated successfully!");
            onClose();
          } catch (error) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#3B82F6",
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(
        error.response?.data?.error?.message || "Failed to create subscription"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    // After login, proceed with subscription
    handleSubscribe(selectedPlan);
  };

  if (!isOpen) return null;

  const freePlan = plans.find((p) => p.id === "free");
  const proPlan = plans.find((p) => p.id === "pro");
  const maxProPlan = plans.find((p) => p.id === "maxpro");

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center h-screen p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-slate-900 relative rounded-xl border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {isExpired
                  ? "Subscription Expired"
                  : requiresLogin
                  ? "Login Required"
                  : "Upgrade to Pro"}
              </h2>
              <p className="mt-1 text-slate-400">
                {isExpired
                  ? "Your subscription has expired. Renew to continue using Pro features."
                  : requiresLogin
                  ? "Please sign in to access this feature."
                  : "Unlock all features with a Pro subscription."}
              </p>
            </div>
            <button
              onClick={onClose}
              className="transition-colors text-slate-400 hover:text-white"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            {isExpired && (
              <div className="flex items-center p-4 mb-6 space-x-3 border rounded-lg bg-red-900/20 border-red-700/30">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <div>
                  <p className="font-medium text-red-200">
                    Subscription Expired
                  </p>
                  <p className="text-sm text-red-300">
                    Your subscription expired on{" "}
                    {user?.subscriptionExpiry
                      ? new Date(user.subscriptionExpiry).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Free Plan */}
              {freePlan && (
                <div className="p-6 border rounded-lg bg-slate-800 border-slate-700">
                  <div className="mb-6 text-center">
                    <h3 className="text-lg font-semibold text-white">
                      {freePlan.name}
                    </h3>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-white">
                        Free
                      </span>
                    </div>
                  </div>
                  <ul className="mb-6 space-y-3">
                    {freePlan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-slate-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <button
                    disabled
                    className="w-full px-4 py-2 rounded-lg cursor-not-allowed bg-slate-700 text-slate-400"
                  >
                    Current Plan
                  </button>
                </div>
              )}

              {/* Pro Plan */}
              {proPlan && (
                <div
                  className={`bg-slate-800 rounded-lg p-6 border-2 ${
                    requiredPlan === "pro"
                      ? "border-blue-500"
                      : "border-slate-700"
                  } relative`}
                >
                  {requiredPlan === "pro" && (
                    <div className="absolute transform -translate-x-1/2 -top-3 left-1/2">
                      <span className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-full">
                        Recommended
                      </span>
                    </div>
                  )}
                  <div className="mb-6 text-center">
                    <div className="flex items-center justify-center mb-2 space-x-2">
                      <Crown className="w-5 h-5 text-blue-500" />
                      <h3 className="text-lg font-semibold text-white">
                        {proPlan.name}
                      </h3>
                    </div>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-white">
                        ₹{proPlan.price}
                      </span>
                      <span className="text-slate-400">/month</span>
                    </div>
                  </div>
                  <ul className="mb-6 space-y-3">
                    {proPlan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-slate-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleSubscribe("pro")}
                    disabled={loading}
                    className="flex items-center justify-center w-full px-4 py-3 space-x-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-800"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Crown className="w-4 h-4" />
                    )}
                    <span>{loading ? "Processing..." : "Upgrade to Pro"}</span>
                  </button>
                </div>
              )}

              {/* Max Pro Plan */}
              {maxProPlan && (
                <div
                  className={`bg-slate-800 rounded-lg p-6 border-2 ${
                    requiredPlan === "maxpro"
                      ? "border-purple-500"
                      : "border-slate-700"
                  } relative`}
                >
                  {requiredPlan === "maxpro" && (
                    <div className="absolute transform -translate-x-1/2 -top-3 left-1/2">
                      <span className="px-3 py-1 text-xs font-medium text-white bg-purple-600 rounded-full">
                        Required
                      </span>
                    </div>
                  )}
                  <div className="mb-6 text-center">
                    <div className="flex items-center justify-center mb-2 space-x-2">
                      <Zap className="w-5 h-5 text-purple-500" />
                      <h3 className="text-lg font-semibold text-white">
                        {maxProPlan.name}
                      </h3>
                    </div>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-white">
                        ₹{maxProPlan.price}
                      </span>
                      <span className="text-slate-400">/month</span>
                    </div>
                  </div>
                  <ul className="mb-6 space-y-3">
                    {maxProPlan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-slate-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleSubscribe("maxpro")}
                    disabled={loading}
                    className="flex items-center justify-center w-full px-4 py-3 space-x-2 font-medium text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700 disabled:bg-purple-800"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Zap className="w-4 h-4" />
                    )}
                    <span>
                      {loading ? "Processing..." : "Upgrade to Max Pro"}
                    </span>
                  </button>
                </div>
              )}
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-400">
                Secure payments powered by Razorpay • Cancel anytime • 30-day
                money-back guarantee
              </p>
            </div>
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
}
