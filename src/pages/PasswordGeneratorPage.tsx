import React,{ useState, useCallback, useEffect } from 'react';
import { Copy, RefreshCw, Shield, Eye, EyeOff, History, Download, Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import { GoogleAdSlot } from '../components/GoogleAdSlot';
import { SEOHead } from '../components/SEOHead';

interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
  customCharacters: string;
}

interface PasswordHistory {
  id: string;
  password: string;
  strength: number;
  createdAt: Date;
  options: PasswordOptions;
}

interface StrengthResult {
  score: number;
  feedback: string[];
  color: string;
  label: string;
}

export function PasswordGeneratorPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false,
    customCharacters: ''
  });
  const [strength, setStrength] = useState<StrengthResult>({
    score: 0,
    feedback: [],
    color: 'text-red-500',
    label: 'Very Weak'
  });
  const [history, setHistory] = useState<PasswordHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('password-history');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory).map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt)
        }));
        setHistory(parsedHistory);
      } catch (error) {
        console.error('Error loading password history:', error);
      }
    }
  }, []);

  // Save history to localStorage
  const saveHistory = useCallback((newHistory: PasswordHistory[]) => {
    localStorage.setItem('password-history', JSON.stringify(newHistory));
    setHistory(newHistory);
  }, []);

  // Character sets
  const getCharacterSet = useCallback(() => {
    let charset = '';
    
    if (options.includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (options.includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.includeNumbers) charset += '0123456789';
    if (options.includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (options.customCharacters) {
      charset += options.customCharacters;
    }
    
    // Remove similar characters if requested
    if (options.excludeSimilar) {
      charset = charset.replace(/[il1Lo0O]/g, '');
    }
    
    // Remove ambiguous characters if requested
    if (options.excludeAmbiguous) {
      charset = charset.replace(/[{}[\]()\/\\'"~,;.<>]/g, '');
    }
    
    return charset;
  }, [options]);

  // Password strength analysis
  const analyzeStrength = useCallback((pwd: string): StrengthResult => {
    let score = 0;
    const feedback: string[] = [];
    
    // Length scoring
    if (pwd.length >= 12) score += 25;
    else if (pwd.length >= 8) score += 15;
    else feedback.push('Use at least 8 characters');
    
    // Character variety scoring
    if (/[a-z]/.test(pwd)) score += 15;
    else feedback.push('Add lowercase letters');
    
    if (/[A-Z]/.test(pwd)) score += 15;
    else feedback.push('Add uppercase letters');
    
    if (/[0-9]/.test(pwd)) score += 15;
    else feedback.push('Add numbers');
    
    if (/[^A-Za-z0-9]/.test(pwd)) score += 20;
    else feedback.push('Add special characters');
    
    // Pattern analysis
    if (!/(.)\1{2,}/.test(pwd)) score += 10;
    else feedback.push('Avoid repeated characters');
    
    // Determine strength level
    let label = 'Very Weak';
    let color = 'text-red-500';
    
    if (score >= 80) {
      label = 'Very Strong';
      color = 'text-green-500';
    } else if (score >= 60) {
      label = 'Strong';
      color = 'text-blue-500';
    } else if (score >= 40) {
      label = 'Medium';
      color = 'text-yellow-500';
    } else if (score >= 20) {
      label = 'Weak';
      color = 'text-orange-500';
    }
    
    return { score, feedback, color, label };
  }, []);

  // Generate password
  const generatePassword = useCallback(() => {
    const charset = getCharacterSet();
    
    if (!charset) {
      toast.error('Please select at least one character type');
      return;
    }
    
    if (options.length < 4 || options.length > 128) {
      toast.error('Password length must be between 4 and 128 characters');
      return;
    }
    
    // Use crypto.getRandomValues for secure random generation
    const array = new Uint8Array(options.length);
    crypto.getRandomValues(array);
    
    let newPassword = '';
    for (let i = 0; i < options.length; i++) {
      newPassword += charset[array[i] % charset.length];
    }
    
    setPassword(newPassword);
    const strengthResult = analyzeStrength(newPassword);
    setStrength(strengthResult);
    
    // Add to history
    const historyItem: PasswordHistory = {
      id: Date.now().toString(),
      password: newPassword,
      strength: strengthResult.score,
      createdAt: new Date(),
      options: { ...options }
    };
    
    const newHistory = [historyItem, ...history.slice(0, 49)]; // Keep last 50
    saveHistory(newHistory);
    
    toast.success('Password generated successfully');
  }, [options, getCharacterSet, analyzeStrength, history, saveHistory]);

  // Generate on mount
  useEffect(() => {
    generatePassword();
  }, []);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Password copied to clipboard');
    } catch {
      toast.error('Failed to copy password');
    }
  };

  const handleDownloadHistory = () => {
    const data = history.map(item => ({
      password: item.password,
      strength: `${item.strength}/100`,
      strengthLabel: item.strength >= 80 ? 'Very Strong' : 
                   item.strength >= 60 ? 'Strong' :
                   item.strength >= 40 ? 'Medium' :
                   item.strength >= 20 ? 'Weak' : 'Very Weak',
      createdAt: item.createdAt.toISOString(),
      length: item.options.length,
      hasUppercase: item.options.includeUppercase,
      hasLowercase: item.options.includeLowercase,
      hasNumbers: item.options.includeNumbers,
      hasSymbols: item.options.includeSymbols
    }));
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `password-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Password history downloaded');
  };

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all password history?')) {
      saveHistory([]);
      toast.success('Password history cleared');
    }
  };

  const useHistoryPassword = (historyItem: PasswordHistory) => {
    setPassword(historyItem.password);
    setStrength(analyzeStrength(historyItem.password));
    setOptions(historyItem.options);
    toast.success('Password loaded from history');
  };

  return (
    <div className="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8 animate-fade-in">
      <SEOHead
        title="Password Generator - Create Strong, Secure Passwords Online"
        description="Generate strong, secure passwords with customizable options. Include uppercase, lowercase, numbers, symbols. Password strength analyzer and history tracking."
        keywords="password generator, secure password, strong password, random password, password strength, online password tool"
        canonicalUrl="/password-generator"
      />
      {/* SEO Meta Tags */}
      <div style={{ display: 'none' }}>
        <h1>Password Generator - Create Strong, Secure Passwords Online</h1>
        <meta name="description" content="Generate strong, secure passwords with customizable options. Include uppercase, lowercase, numbers, symbols. Password strength analyzer and history tracking." />
        <meta name="keywords" content="password generator, secure password, strong password, random password, password strength, online password tool" />
      </div>

      <div className="mb-8 text-center">
        <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Password Generator</h1>
        <p className="text-lg text-slate-400">
          Generate strong, secure passwords with advanced customization options
        </p>
      </div>

      {/* Generated Password Display */}
      <div className="mb-6 tool-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center text-lg font-semibold text-white">
            <Shield className="w-5 h-5 mr-2 text-blue-500" />
            Generated Password
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="p-2 btn-secondary"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={generatePassword}
              className="p-2 btn-secondary"
              title="Generate new password"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              readOnly
              className="pr-12 font-mono text-lg input-field"
              aria-label="Generated password"
            />
            <button
              onClick={() => handleCopy(password)}
              className="absolute p-2 transform -translate-y-1/2 right-3 top-1/2 btn-copy"
              title="Copy password"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>

          {/* Password Strength */}
          <div className="p-4 rounded-lg bg-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-slate-300">Password Strength</span>
              <span className={`font-bold ${strength.color}`}>{strength.label}</span>
            </div>
            <div className="w-full h-2 mb-3 rounded-full bg-slate-700">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  strength.score >= 80 ? 'bg-green-500' :
                  strength.score >= 60 ? 'bg-blue-500' :
                  strength.score >= 40 ? 'bg-yellow-500' :
                  strength.score >= 20 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${strength.score}%` }}
              />
            </div>
            <div className="text-sm text-slate-400">
              Score: {strength.score}/100
              {strength.feedback.length > 0 && (
                <div className="mt-2">
                  <span className="font-medium">Suggestions:</span>
                  <ul className="mt-1 list-disc list-inside">
                    {strength.feedback.map((feedback, index) => (
                      <li key={index}>{feedback}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Password Options */}
      <div className="mb-6 tool-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Password Options</h3>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="inline-flex items-center space-x-2 btn-secondary"
          >
            <Settings className="w-4 h-4" />
            <span>{showAdvanced ? 'Hide' : 'Show'} Advanced</span>
          </button>
        </div>

        <div className="space-y-4">
          {/* Length */}
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-300">
              Password Length: {options.length}
            </label>
            <input
              type="range"
              min="4"
              max="128"
              value={options.length}
              onChange={(e) => setOptions({ ...options, length: parseInt(e.target.value) })}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-700 slider"
            />
            <div className="flex justify-between mt-1 text-xs text-slate-500">
              <span>4</span>
              <span>128</span>
            </div>
          </div>

          {/* Character Types */}
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={options.includeUppercase}
                onChange={(e) => setOptions({ ...options, includeUppercase: e.target.checked })}
                className="text-blue-600 rounded bg-slate-700 border-slate-600 focus:ring-blue-500"
              />
              <span className="text-slate-300">Uppercase (A-Z)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={options.includeLowercase}
                onChange={(e) => setOptions({ ...options, includeLowercase: e.target.checked })}
                className="text-blue-600 rounded bg-slate-700 border-slate-600 focus:ring-blue-500"
              />
              <span className="text-slate-300">Lowercase (a-z)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={options.includeNumbers}
                onChange={(e) => setOptions({ ...options, includeNumbers: e.target.checked })}
                className="text-blue-600 rounded bg-slate-700 border-slate-600 focus:ring-blue-500"
              />
              <span className="text-slate-300">Numbers (0-9)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={options.includeSymbols}
                onChange={(e) => setOptions({ ...options, includeSymbols: e.target.checked })}
                className="text-blue-600 rounded bg-slate-700 border-slate-600 focus:ring-blue-500"
              />
              <span className="text-slate-300">Symbols (!@#$%)</span>
            </label>
          </div>

          {/* Advanced Options */}
          {showAdvanced && (
            <div className="pt-4 space-y-4 border-t border-slate-700">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={options.excludeSimilar}
                    onChange={(e) => setOptions({ ...options, excludeSimilar: e.target.checked })}
                    className="text-blue-600 rounded bg-slate-700 border-slate-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-300">Exclude similar (i, l, 1, L, o, 0, O)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={options.excludeAmbiguous}
                    onChange={(e) => setOptions({ ...options, excludeAmbiguous: e.target.checked })}
                    className="text-blue-600 rounded bg-slate-700 border-slate-600 focus:ring-blue-500"
                  />
                    <span className="text-slate-300">Exclude ambiguous ({' '} [ ] ( ) / \ ' " ~ , ; . &lt; &gt;)</span>
                </label>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-300">
                  Custom Characters (optional)
                </label>
                <input
                  type="text"
                  value={options.customCharacters}
                  onChange={(e) => setOptions({ ...options, customCharacters: e.target.value })}
                  placeholder="Add custom characters..."
                  className="input-field"
                />
              </div>
            </div>
          )}

          <button
            onClick={generatePassword}
            className="w-full btn-primary"
          >
            Generate New Password
          </button>
        </div>
      </div>

      {/* Password History */}
      <div className="mb-8 tool-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center text-lg font-semibold text-white">
            <History className="w-5 h-5 mr-2 text-purple-500" />
            Password History ({history.length})
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="btn-secondary"
            >
              {showHistory ? 'Hide' : 'Show'} History
            </button>
            {history.length > 0 && (
              <>
                <button
                  onClick={handleDownloadHistory}
                  className="p-2 btn-secondary"
                  title="Download history"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={clearHistory}
                  className="text-red-400 btn-secondary hover:text-red-300"
                >
                  Clear
                </button>
              </>
            )}
          </div>
        </div>

        {showHistory && (
          <div className="space-y-2 overflow-y-auto max-h-64">
            {history.length === 0 ? (
              <p className="py-4 text-center text-slate-500">No password history yet</p>
            ) : (
              history.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded bg-slate-800">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <code className="font-mono text-sm truncate text-slate-300">
                        {showPassword ? item.password : '•'.repeat(item.password.length)}
                      </code>
                      <div className={`text-xs font-medium ${
                        item.strength >= 80 ? 'text-green-500' :
                        item.strength >= 60 ? 'text-blue-500' :
                        item.strength >= 40 ? 'text-yellow-500' :
                        item.strength >= 20 ? 'text-orange-500' : 'text-red-500'
                      }`}>
                        {item.strength}/100
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {item.createdAt.toLocaleString()} • Length: {item.options.length}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleCopy(item.password)}
                      className="p-1 btn-copy"
                      title="Copy password"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => useHistoryPassword(item)}
                      className="px-2 py-1 text-xs btn-secondary"
                    >
                      Use
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <GoogleAdSlot adSlotId="5678901234" />

      {/* Security Tips */}
      <div className="mt-8 tool-card">
        <h3 className="mb-4 text-lg font-semibold text-white">Password Security Tips</h3>
        <div className="grid grid-cols-1 gap-6 text-sm md:grid-cols-2">
          <div>
            <h4 className="mb-2 font-medium text-white">Best Practices:</h4>
            <ul className="space-y-1 text-slate-400">
              <li>✓ Use at least 12 characters</li>
              <li>✓ Include uppercase, lowercase, numbers, and symbols</li>
              <li>✓ Use unique passwords for each account</li>
              <li>✓ Consider using a password manager</li>
              <li>✓ Enable two-factor authentication when available</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-medium text-white">Avoid:</h4>
            <ul className="space-y-1 text-slate-400">
              <li>✗ Personal information (names, birthdays)</li>
              <li>✗ Common words or phrases</li>
              <li>✗ Sequential characters (123, abc)</li>
              <li>✗ Reusing passwords across sites</li>
              <li>✗ Sharing passwords via insecure methods</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}