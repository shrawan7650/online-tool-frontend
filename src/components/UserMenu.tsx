import React, { useState, useRef, useEffect } from "react";
import { User, LogOut, Crown, Settings, CreditCard } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { logout } from "../store/slices/userSlice";
import { SubscriptionModal } from "./auth/SubscriptionModal";
import toast from "react-hot-toast";

export function UserMenu() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.user,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    setIsOpen(false);
  };

  const formatExpiryDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const isSubscriptionExpired = () => {
    if (!user?.subscriptionExpiry) return false;
    return new Date(user.subscriptionExpiry) < new Date();
  };
  console.log("user", user);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center p-2 space-x-2 transition-colors rounded-lg hover:bg-slate-800"
          aria-label="User menu"
        >
          {user.profilePicture ? (
            <img
              src="https://lh3.googleusercontent.com/a/ACg8ocJcxQ4GzQb_HHG3EusycqzyevsR6Mk4rYChcliTb6PqnKTJ9kYi=s96-c"
              alt={user.name}
              className="object-cover w-8 h-8 rounded-full"
            />
          ) : (
            <div className="flex items-center justify-center w-8 h-8 text-sm font-semibold text-white bg-blue-600 rounded-full">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium text-white">{user.name}</p>
            <div className="flex items-center space-x-1">
              {user.isMaxPro ? (
                <>
                  <Crown className="w-3 h-3 text-purple-500" />
                  <span className="text-xs text-purple-400">Max Pro</span>
                </>
              ) : user.isPro ? (
                <>
                  <Crown className="w-3 h-3 text-blue-500" />
                  <span className="text-xs text-blue-400">Pro</span>
                </>
              ) : (
                <span className="text-xs text-slate-400">Free</span>
              )}
            </div>
          </div>
        </button>

        {isOpen && (
          <div className="absolute right-0 z-50 w-64 mt-2 border rounded-lg shadow-xl bg-slate-800 border-slate-700">
            <div className="p-4 border-b border-slate-700">
              <div className="flex items-center space-x-3">
                <img
                  src={
                    user.profilePicture ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.name,
                    )}&background=3b82f6&color=fff`
                  }
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium text-white">{user.name}</p>
                  <p className="text-sm text-slate-400">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="p-2">
              {/* Subscription Status */}
              <div className="px-3 py-2 mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-300">Subscription</span>
                  <div className="flex items-center space-x-1">
                    {user.isMaxPro ? (
                      <>
                        <Crown className="w-3 h-3 text-purple-500" />
                        <span className="text-xs font-medium text-purple-400">
                          Max Pro
                        </span>
                      </>
                    ) : user.isPro ? (
                      <>
                        <Crown className="w-3 h-3 text-blue-500" />
                        <span className="text-xs font-medium text-blue-400">
                          Pro
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-slate-400">Free</span>
                    )}
                  </div>
                </div>
                {(user.isPro || user.isMaxPro) && (
                  <div className="text-xs text-slate-400">
                    {isSubscriptionExpired() ? (
                      <span className="text-red-400">
                        Expired on {formatExpiryDate(user.subscriptionExpiry)}
                      </span>
                    ) : (
                      <span>
                        Expires on {formatExpiryDate(user.subscriptionExpiry)}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Menu Items */}
              <button
                onClick={() => {
                  setShowSubscriptionModal(true);
                  setIsOpen(false);
                }}
                className="flex items-center w-full px-3 py-2 space-x-2 transition-colors rounded text-slate-300 hover:text-white hover:bg-slate-700"
              >
                <CreditCard className="w-4 h-4" />
                <span className="text-sm">
                  {user.isPro || user.isMaxPro
                    ? "Manage Subscription"
                    : "Upgrade to Pro"}
                </span>
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="flex items-center w-full px-3 py-2 space-x-2 transition-colors rounded text-slate-300 hover:text-white hover:bg-slate-700"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm">Settings</span>
              </button>

              <div className="pt-2 mt-2 border-t border-slate-700">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 space-x-2 text-red-400 transition-colors rounded hover:text-red-300 hover:bg-slate-700"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
    </>
  );
}
