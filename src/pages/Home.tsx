import { Link } from 'react-router-dom';
import { 
  Link as LinkIcon, 
  FileText, 
  Hash, 
  Clipboard,
  Upload,
  FileCheck,
  Code,
  QrCode,
  Clock,
  Globe,
  Shield,
  Zap,
  ArrowRight
} from 'lucide-react';
import { GoogleAdSlot } from '../components/GoogleAdSlot';
import React from 'react'; 
const tools = [
  {
    title: 'URL Encode/Decode',
    description: 'Encode and decode URLs for safe transmission',
    icon: LinkIcon,
    path: '/url-encode',
    color: 'text-blue-500'
  },
  {
    title: 'Base64 Encode/Decode', 
    description: 'Convert text to Base64 and back with URL-safe options',
    icon: FileText,
    path: '/base64',
    color: 'text-emerald-500'
  },
  {
    title: 'JSON Escape/Unescape',
    description: 'Safely escape JSON strings for embedding',
    icon: Globe,
    path: '/json', 
    color: 'text-yellow-500'
  },
  {
    title: 'Hash Generator',
    description: 'Generate MD5, SHA1, SHA256, and SHA512 hashes',
    icon: Hash,
    path: '/hash',
    color: 'text-purple-500'
  },
  {
    title: 'File Hash Online',
    description: 'Generate hashes for uploaded files with drag & drop',
    icon: FileCheck,
    path: '/file-hash',
    color: 'text-orange-500'
  },
  {
    title: 'File Sharing',
    description: 'Upload and share files with expiry and auto-delete',
    icon: Upload,
    path: '/file-sharing',
    color: 'text-pink-500'
  },
  {
    title: 'Escape Toolkit',
    description: 'String escape/unescape for multiple programming languages',
    icon: Code,
    path: '/escape-toolkit',
    color: 'text-cyan-500'
  },
  {
    title: 'QR Code Generator',
    description: 'Generate QR codes for text, URLs, and file links',
    icon: QrCode,
    path: '/qr-code',
    color: 'text-indigo-500'
  },
  {
    title: 'Time-Locked Sharing',
    description: 'Schedule content to unlock at specific date/time',
    icon: Clock,
    path: '/scheduler',
    color: 'text-amber-500'
  },
  {
    title: 'Online Clipboard',
    description: 'Share text securely with temporary codes',
    icon: Clipboard,
    path: '/clipboard',
    color: 'text-red-500'
  }
];


const features = [
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Client-side processing and encrypted clipboard storage'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Instant results with optimized algorithms'
  },
  {
    icon: Globe,
    title: 'Works Offline',
    description: 'PWA support for offline functionality'
  }
];

export function Home() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="relative px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8 sm:py-24">
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-bold text-white sm:text-6xl">
              Professional
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Online Tools
              </span>
            </h1>
            <p className="max-w-3xl mx-auto mb-8 text-xl text-slate-300">
              Essential developer utilities for encoding, hashing, and secure text sharing. 
              Fast, reliable, and built for professionals.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link 
                to="/clipboard" 
                className="inline-flex items-center px-8 py-4 space-x-2 text-lg btn-primary"
              >
                <Clipboard className="w-5 h-5" />
                <span>Try Secure Clipboard</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a 
                href="#tools"
                className="inline-flex items-center px-8 py-4 space-x-2 text-lg btn-secondary"
              >
                <span>Browse All Tools</span>
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-slate-900/50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-slate-800">
                    <Icon className="w-8 h-8 text-blue-500" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ad Slot */}
      <section className="py-8">
        <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
          <GoogleAdSlot adSlotId="1234567890" />
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="py-16">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="mb-12 text-3xl font-bold text-center text-white">Available Tools</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Link 
                  key={index}
                  to={tool.path}
                  className="tool-card group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg bg-slate-700 group-hover:scale-110 transition-transform ${tool.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-2 text-lg font-semibold text-white transition-colors group-hover:text-blue-400">
                        {tool.title}
                      </h3>
                      <p className="text-sm text-slate-400">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 mt-4 ml-auto transition-all text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}