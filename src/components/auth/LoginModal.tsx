import React, { useState, useEffect } from 'react';
import { X, Chrome, AlertCircle, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { loginWithGoogle, clearError } from '../../store/slices/userSlice';
import { RootState, AppDispatch } from '../../store/store';
import toast from 'react-hot-toast';
import { GoogleButtonSignup } from './googleLoginOrSignup';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

declare global {
  interface Window {
    google: any;
  }
}

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {

  const { error, isLoading } = useSelector((state: RootState) => state.user);


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md border bg-slate-900 rounded-xl border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">Sign In</h2>
          <button
            onClick={onClose}
            className="transition-colors text-slate-400 hover:text-white"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="mb-6 text-center">
            <h3 className="mb-2 text-lg font-medium text-white">
              Welcome to Online Tools
            </h3>
            <p className="text-sm text-slate-400">
              Sign in with your Google account to access Pro features and sync your data across devices.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center p-3 mb-4 space-x-2 border rounded-lg bg-red-900/20 border-red-700/30">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-200">{error}</span>
            </div>
          )}

          {/* Google Login Button */}
         <GoogleButtonSignup onClose={onClose}/>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
