import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import React from "react";
import { SEOHead } from "../components/SEOHead";
export function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
            <SEOHead
        title="Page Not Found - 404 Error"
        description="The page you're looking for doesn't exist. Return to Online Tools Portal homepage to access our developer utilities."
        noIndex={true}
      />
      <div className="text-center">
        <div className="mb-8">
          <h1 className="mb-4 font-bold text-9xl text-slate-800">404</h1>
          <h2 className="mb-2 text-3xl font-bold text-white">Page Not Found</h2>
          <p className="text-lg text-slate-400">
            Sorry, the page you're looking for doesn't exist.
          </p>
        </div>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 btn-primary"
          >
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center space-x-2 btn-secondary"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}
