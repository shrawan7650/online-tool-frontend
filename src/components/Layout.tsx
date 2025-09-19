import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Settings, Github, LogIn } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { UserMenu } from "./UserMenu";
import { LoginModal } from "./auth/LoginModal";
import React, { useState } from "react";
import { setShowLoginModal } from "../store/slices/userSlice";
import LogoWordmark from "./LogoWordmark";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-sm">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/"
              className="flex items-center space-x-3 text-white transition-colors hover:text-blue-400"
              aria-label="Go to home page"
            >
              <h1 className="font-bold text-1xl sm:text-5xl md:text-6xl lg:text-3xl">
                {/* inspi */}
                <span className="text-[#fffff] font-bold">
                  <span className="relative inline-block">
                    i
                    <span className="absolute -top-2f md:-top-3 left-1/2 -translate-x-1/2 text-[#25B7ED] text-base sm:text-lg md:text-2xl">
                      •
                    </span>
                  </span>
                  nsp
                  <span className="relative inline-block">
                    i
                    <span className="absolute -top-2 left-1/2 md:-top-3 -translate-x-1/2 text-[#25B7ED] text-base sm:text-lg md:text-2xl">
                      •
                    </span>
                  </span>
                </span>

                {/* Te */}
                <span className="text-[#25B7ED] font-bold">Te</span>

                {/* ch */}
                <span className="text-[#fffff] font-bold">ch</span>
              </h1>
            </Link>

            <div className="flex items-center space-x-6">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === "/"
                    ? "text-blue-400 bg-blue-500/10"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
                aria-label="Home"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>

              {isAuthenticated ? (
                <UserMenu />
              ) : (
                <button
                  onClick={() => dispatch(setShowLoginModal(true))}
                  className="flex items-center px-3 py-2 space-x-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}

              <a
                href="https://github.com/shrawan7650"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 transition-colors rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
                aria-label="View source code on GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">{children}</main>

      <Footer/>



      <LoginModal />
    </div>
  );
}


