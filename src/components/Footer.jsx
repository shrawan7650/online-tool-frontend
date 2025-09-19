import React from "react";
import { Link } from "react-router-dom";
import {
  Instagram,
  Twitter,
  Github,
  Linkedin,
  Youtube,
} from "lucide-react";

function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-800 bg-slate-950/50">
      <div className="px-4 py-10 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Top grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand + description */}
          <div className="md:col-span-2">
            <h1 className="mb-4 text-3xl font-bold sm:text-5xl lg:text-6xl">
              {/* inspi */}
              <span className="text-[#222529] font-bold">
                <span className="relative inline-block">
                  i
                  <span className="absolute -top-2 md:-top-2 left-1/2 -translate-x-1/2 text-[#25B7ED] text-base sm:text-lg md:text-2xl">
                    •
                  </span>
                </span>
                nsp
                <span className="relative inline-block">
                  i
                  <span className="absolute -top-2 md:-top-2 left-1/2 -translate-x-1/2 text-[#25B7ED] text-base sm:text-lg md:text-2xl">
                    •
                  </span>
                </span>
              </span>

              {/* Te */}
              <span className="text-[#25B7ED] font-bold">Te</span>

              {/* ch */}
              <span className="text-[#222529] font-bold">ch</span>

              {/* Tagline */}
              <span className="block mt-1 text-lg font-semibold text-transparent sm:text-xl md:text-2xl bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Online Tools
              </span>
            </h1>

            <p className="max-w-md text-sm leading-relaxed text-slate-400">
              Professional developer utilities for encoding, hashing, file
              sharing, and more. Built with modern web technologies for speed
              and reliability.
            </p>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 gap-8 md:col-span-2">
            {/* Tools */}
            <div>
              <h4 className="mb-3 font-semibold text-white">Tools</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/url-encode" className="hover:text-white">URL Encode/Decode</Link></li>
                <li><Link to="/base64" className="hover:text-white">Base64 Tools</Link></li>
                <li><Link to="/hash" className="hover:text-white">Hash Generator</Link></li>
                <li><Link to="/qr-code" className="hover:text-white">QR Code Generator</Link></li>
                <li><Link to="/clipboard" className="hover:text-white">Secure Clipboard</Link></li>
              </ul>
            </div>

            {/* Company + Legal */}
            <div className="space-y-6">
              {/* <div>
                <h4 className="mb-3 font-semibold text-white">Company</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><a href="https://onlinetools.com" className="hover:text-white">Official Website</a></li>
                  <li><a href="https://blog.onlinetools.com" className="hover:text-white">Blog</a></li>
                  <li><a href="https://docs.onlinetools.com" className="hover:text-white">Documentation</a></li>
                  <li><a href="https://status.onlinetools.com" className="hover:text-white">Status Page</a></li>
                </ul>
              </div> */}

              <div>
                <h4 className="mb-3 font-semibold text-white">Legal</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="hover:text-white">Terms & Conditions</Link></li>
                  <li><Link to="/disclaimer" className="hover:text-white">Disclaimer</Link></li>
                  <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Socials */}
          <div className="flex flex-wrap gap-3 md:col-span-4">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 transition-colors rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://github.com/shrawan7650"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 transition-colors rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com/shrawan-kumar-rai"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 transition-colors rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-800"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com/inspitech/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 transition-colors rounded-lg text-slate-400 hover:text-pink-500 hover:bg-slate-800"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://youtube.com/@inspitech"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 transition-colors rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-800"
              aria-label="YouTube"
            >
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Bottom */}
        <p className="mt-8 text-xs text-center text-slate-500">
          &copy; {new Date().getFullYear()} Online Tools Portal. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
