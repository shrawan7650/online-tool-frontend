import { useState, useCallback } from 'react';
import { Copy, Hash as HashIcon, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { GoogleAdSlot } from '../components/GoogleAdSlot';

type HashAlgorithm = 'md5' | 'sha1' | 'sha256' | 'sha512';

export function HashPage() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<Record<HashAlgorithm, string>>({
    md5: '',
    sha1: '',
    sha256: '',
    sha512: ''
  });
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<HashAlgorithm>('sha256');

  const generateHash = useCallback(async (text: string, algorithm: HashAlgorithm): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    
    let hashBuffer: ArrayBuffer;
    
    switch (algorithm) {
      case 'md5':
        // MD5 is not available in Web Crypto API, we'll use a simplified version
        // In a real app, you'd use a crypto library like crypto-js
        return 'MD5 not available in browser (use crypto library)';
      case 'sha1':
        hashBuffer = await crypto.subtle.digest('SHA-1', data);
        break;
      case 'sha256':
        hashBuffer = await crypto.subtle.digest('SHA-256', data);
        break;
      case 'sha512':
        hashBuffer = await crypto.subtle.digest('SHA-512', data);
        break;
      default:
        throw new Error('Unsupported algorithm');
    }
    
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }, []);

  const handleProcess = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!input.trim()) {
      toast.error('Please enter some text');
      return;
    }

    try {
      const newResults = { ...results };
      
      if (selectedAlgorithm === 'md5') {
        // For MD5, we'll show a message about using server-side API
        newResults.md5 = 'Use backend API for MD5 hashing';
      } else {
        newResults[selectedAlgorithm] = await generateHash(input, selectedAlgorithm);
      }
      
      setResults(newResults);
      toast.success(`${selectedAlgorithm.toUpperCase()} hash generated successfully`);
    } catch (error) {
      toast.error('Error generating hash');
    }
  }, [input, selectedAlgorithm, results, generateHash]);

  const handleGenerateAll = useCallback(async () => {
    if (!input.trim()) {
      toast.error('Please enter some text');
      return;
    }

    try {
      const newResults: Record<HashAlgorithm, string> = {
        md5: 'Use backend API for MD5 hashing',
        sha1: await generateHash(input, 'sha1'),
        sha256: await generateHash(input, 'sha256'),
        sha512: await generateHash(input, 'sha512')
      };
      
      setResults(newResults);
      toast.success('All hashes generated successfully');
    } catch (error) {
      toast.error('Error generating hashes');
    }
  }, [input, generateHash]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleProcess();
    }
  };

  const algorithms: { value: HashAlgorithm; label: string; description: string }[] = [
    { value: 'md5', label: 'MD5', description: '128-bit hash (legacy, not cryptographically secure)' },
    { value: 'sha1', label: 'SHA-1', description: '160-bit hash (legacy, use SHA-256+ for security)' },
    { value: 'sha256', label: 'SHA-256', description: '256-bit hash (recommended for security)' },
    { value: 'sha512', label: 'SHA-512', description: '512-bit hash (highest security)' }
  ];

  return (
    <div className="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Hash Generator</h1>
        <p className="text-lg text-slate-400">
          Generate secure cryptographic hashes using MD5, SHA-1, SHA-256, and SHA-512 algorithms

        </p>
      </div>

      {/* Algorithm Selection */}
      <div className="mb-6 tool-card">
        <h3 className="mb-4 text-lg font-semibold text-white">Select Hash Algorithm</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {algorithms.map((algo) => (
            <button
              key={algo.value}
              onClick={() => setSelectedAlgorithm(algo.value)}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                selectedAlgorithm === algo.value
                  ? 'border-purple-500 bg-purple-500/10 text-white'
                  : 'border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white'
              }`}
            >
              <div className="font-medium">{algo.label}</div>
              <div className="mt-1 text-xs text-slate-400">{algo.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Input Section */}
      <div className="mb-6 tool-card">
        <h3 className="flex items-center mb-4 text-lg font-semibold text-white">
          <HashIcon className="w-5 h-5 mr-2 text-purple-500" />
          Input Text
        </h3>
        <form onSubmit={handleProcess} className="space-y-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter text to hash..."
            className="h-24 textarea-field"
            aria-label="Text to hash"
          />
          <div className="flex flex-wrap gap-3">
            <button 
              type="submit" 
              className="btn-primary"
              disabled={!input.trim()}
            >
              Generate {selectedAlgorithm.toUpperCase()} Hash
            </button>
            <button
              type="button"
              onClick={handleGenerateAll}
              className="btn-secondary"
              disabled={!input.trim()}
            >
              Generate All Hashes
            </button>
            <button
              type="button"
              onClick={() => setInput('')}
              className="btn-secondary"
              disabled={!input}
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      <div className="mb-8 tool-card">
        <h3 className="flex items-center mb-4 text-lg font-semibold text-white">
          <Shield className="w-5 h-5 mr-2 text-purple-500" />
          Hash Results
        </h3>
        <div className="space-y-4">
          {algorithms.map((algo) => (
            <div key={algo.value} className="p-4 border rounded-lg border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-white">{algo.label}</span>
                <span className="text-sm text-slate-400">{algo.description}</span>
              </div>
              {results[algo.value] ? (
                <div className="flex items-center space-x-3">
                  <div className="flex-1 p-3 font-mono text-sm break-all rounded bg-slate-900 text-slate-300">
                    {results[algo.value]}
                  </div>
                  <button
                    onClick={() => handleCopy(results[algo.value])}
                    className="btn-copy"
                    disabled={!results[algo.value] || results[algo.value].includes('Use backend')}
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="p-3 text-center rounded bg-slate-900 text-slate-500">
                  Hash will appear here
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <GoogleAdSlot adSlotId="5678901234" />

      {/* Info Section */}
      <div className="mt-8 tool-card">
        <h3 className="mb-4 text-lg font-semibold text-white">About Cryptographic Hashing</h3>
        <div className="prose prose-invert max-w-none">
          <p className="mb-4 text-slate-400">
            Cryptographic hash functions are mathematical algorithms that map data of arbitrary 
            size to a fixed-size string. They are designed to be one-way functions, making it 
            computationally infeasible to reverse the process.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-medium text-white">Hash Properties:</h4>
              <ul className="space-y-1 text-sm text-slate-400">
                <li>Deterministic (same input = same output)</li>
                <li>Fixed output size</li>
                <li>Avalanche effect (small input change = big output change)</li>
                <li>One-way function (irreversible)</li>
                <li>Collision resistant</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-medium text-white">Common Use Cases:</h4>
              <ul className="space-y-1 text-sm text-slate-400">
                <li>Password storage (with salt)</li>
                <li>Digital signatures</li>
                <li>File integrity checking</li>
                <li>Blockchain and cryptocurrencies</li>
                <li>Data deduplication</li>
                <li>Checksums</li>
              </ul>
            </div>
          </div>
          <div className="p-4 mt-6 border rounded-lg bg-red-900/20 border-red-700/30">
            <h4 className="mb-2 font-medium text-red-400">⚠️ Security Notes:</h4>
            <ul className="space-y-1 text-sm text-red-200">
              <li>MD5 and SHA-1 are cryptographically broken - use SHA-256 or better</li>
              <li>Never use plain hashes for passwords - always use salt + slow hash functions</li>
              <li>Hashing alone doesn't provide authentication or encryption</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}