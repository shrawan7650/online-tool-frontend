import { Link } from 'react-router-dom';
import { 
  Link as LinkIcon, 
  FileText, 
  Hash, 
  Clipboard,
  Globe,
  Shield,
  Zap,
  ArrowRight
} from 'lucide-react';
import { GoogleAdSlot } from '../components/GoogleAdSlot';

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
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
              Professional
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Online Tools
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Essential developer utilities for encoding, hashing, and secure text sharing. 
              Fast, reliable, and built for professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/clipboard" 
                className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4"
              >
                <Clipboard className="h-5 w-5" />
                <span>Try Secure Clipboard</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a 
                href="#tools"
                className="btn-secondary inline-flex items-center space-x-2 text-lg px-8 py-4"
              >
                <span>Browse All Tools</span>
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800 rounded-full mb-4">
                    <Icon className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ad Slot */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <GoogleAdSlot adSlotId="1234567890" />
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Available Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-slate-400 text-sm">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all ml-auto mt-4" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}