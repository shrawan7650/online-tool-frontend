import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { loginWithGoogle, setShowLoginModal } from "../../store/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react"; // loader spinner


export const GoogleButtonSignup = () => {

  const { error, isLoading,showLoginModal } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true);

      try {
        const result = await dispatch(
          loginWithGoogle(tokenResponse.access_token),
        );
        console.log("Google login result:", result);
        if (result?.type === "user/loginWithGoogle/fulfilled") {
          toast.success("Signed up successfully");
          

    
          

          // Close modal if provided
          dispatch(setShowLoginModal(false));
        } else {
          const errorMessage =
            (result as any)?.payload ||
            "Google login failed. Please try again.";
          toast.error(errorMessage);
        }
      } catch (err) {
        console.error("Google login failed", err.response?.data || err.message);
        toast.error("Google login failed. Try again.");
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: () => {
      toast.error("Google OAuth failed");
    },
  });

  return (
    <button
      onClick={() => login()}
      disabled={isGoogleLoading}
      className="flex items-center justify-center w-full gap-3 px-5 py-3 text-sm font-medium text-gray-700 transition-all duration-200 bg-white border border-gray-300 shadow-sm rounded-xl hover:bg-gray-50 hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {isGoogleLoading ? (
        <>
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
          <span>Signing in...</span>
        </>
      ) : (
        <>
          <FcGoogle className="text-xl" />
          <span className="font-semibold">Sign up with Google</span>
        </>
      )}
    </button>
  );
};
