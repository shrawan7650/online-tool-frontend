import React,{ useState, useCallback, useEffect } from 'react';
import { Copy, Code, ArrowRight, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { GoogleAdSlot } from '../components/GoogleAdSlot';

type Language = 'python' | 'javascript' | 'java' | 'cpp' | 'php' | 'go' | 'ruby' | 'json';

interface EscapeRule {
  from: string | RegExp;
  to: string;
}

const LANGUAGE_CONFIGS: Record<Language, {
  label: string;
  escapeRules: EscapeRule[];
  unescapeRules: EscapeRule[];
  example: string;
}> = {
  python: {
    label: 'Python',
    escapeRules: [
      { from: /\\/g, to: '\\\\' },
      { from: /'/g, to: "\\'" },
      { from: /"/g, to: '\\"' },
      { from: /\n/g, to: '\\n' },
      { from: /\r/g, to: '\\r' },
      { from: /\t/g, to: '\\t' }
    ],
    unescapeRules: [
      { from: /\\n/g, to: '\n' },
      { from: /\\r/g, to: '\r' },
      { from: /\\t/g, to: '\t' },
      { from: /\\"/g, to: '"' },
      { from: /\\'/g, to: "'" },
      { from: /\\\\/g, to: '\\' }
    ],
    example: 'Hello "World"!\nNew line'
  },
  javascript: {
    label: 'JavaScript',
    escapeRules: [
      { from: /\\/g, to: '\\\\' },
      { from: /'/g, to: "\\'" },
      { from: /"/g, to: '\\"' },
      { from: /`/g, to: '\\`' },
      { from: /\n/g, to: '\\n' },
      { from: /\r/g, to: '\\r' },
      { from: /\t/g, to: '\\t' }
    ],
    unescapeRules: [
      { from: /\\n/g, to: '\n' },
      { from: /\\r/g, to: '\r' },
      { from: /\\t/g, to: '\t' },
      { from: /\\`/g, to: '`' },
      { from: /\\"/g, to: '"' },
      { from: /\\'/g, to: "'" },
      { from: /\\\\/g, to: '\\' }
    ],
    example: 'console.log("Hello World!");'
  },
  java: {
    label: 'Java',
    escapeRules: [
      { from: /\\/g, to: '\\\\' },
      { from: /"/g, to: '\\"' },
      { from: /\n/g, to: '\\n' },
      { from: /\r/g, to: '\\r' },
      { from: /\t/g, to: '\\t' },
      { from: /\f/g, to: '\\f' },
      { from: /\b/g, to: '\\b' }
    ],
    unescapeRules: [
      { from: /\\n/g, to: '\n' },
      { from: /\\r/g, to: '\r' },
      { from: /\\t/g, to: '\t' },
      { from: /\\f/g, to: '\f' },
      { from: /\\b/g, to: '\b' },
      { from: /\\"/g, to: '"' },
      { from: /\\\\/g, to: '\\' }
    ],
    example: 'System.out.println("Hello World!");'
  },
  cpp: {
    label: 'C++',
    escapeRules: [
      { from: /\\/g, to: '\\\\' },
      { from: /"/g, to: '\\"' },
      { from: /\n/g, to: '\\n' },
      { from: /\r/g, to: '\\r' },
      { from: /\t/g, to: '\\t' },
      { from: /\0/g, to: '\\0' }
    ],
    unescapeRules: [
      { from: /\\n/g, to: '\n' },
      { from: /\\r/g, to: '\r' },
      { from: /\\t/g, to: '\t' },
      { from: /\\0/g, to: '\0' },
      { from: /\\"/g, to: '"' },
      { from: /\\\\/g, to: '\\' }
    ],
    example: 'std::cout << "Hello World!" << std::endl;'
  },
  php: {
    label: 'PHP',
    escapeRules: [
      { from: /\\/g, to: '\\\\' },
      { from: /'/g, to: "\\'" },
      { from: /"/g, to: '\\"' },
      { from: /\$/g, to: '\\$' },
      { from: /\n/g, to: '\\n' },
      { from: /\r/g, to: '\\r' },
      { from: /\t/g, to: '\\t' }
    ],
    unescapeRules: [
      { from: /\\n/g, to: '\n' },
      { from: /\\r/g, to: '\r' },
      { from: /\\t/g, to: '\t' },
      { from: /\\\$/g, to: '$' },
      { from: /\\"/g, to: '"' },
      { from: /\\'/g, to: "'" },
      { from: /\\\\/g, to: '\\' }
    ],
    example: 'echo "Hello $name!";'
  },
  go: {
    label: 'Go',
    escapeRules: [
      { from: /\\/g, to: '\\\\' },
      { from: /"/g, to: '\\"' },
      { from: /`/g, to: '\\`' },
      { from: /\n/g, to: '\\n' },
      { from: /\r/g, to: '\\r' },
      { from: /\t/g, to: '\\t' }
    ],
    unescapeRules: [
      { from: /\\n/g, to: '\n' },
      { from: /\\r/g, to: '\r' },
      { from: /\\t/g, to: '\t' },
      { from: /\\`/g, to: '`' },
      { from: /\\"/g, to: '"' },
      { from: /\\\\/g, to: '\\' }
    ],
    example: 'fmt.Println("Hello World!")'
  },
  ruby: {
    label: 'Ruby',
    escapeRules: [
      { from: /\\/g, to: '\\\\' },
      { from: /'/g, to: "\\'" },
      { from: /"/g, to: '\\"' },
      { from: /#/g, to: '\\#' },
      { from: /\n/g, to: '\\n' },
      { from: /\r/g, to: '\\r' },
      { from: /\t/g, to: '\\t' }
    ],
    unescapeRules: [
      { from: /\\n/g, to: '\n' },
      { from: /\\r/g, to: '\r' },
      { from: /\\t/g, to: '\t' },
      { from: /\\#/g, to: '#' },
      { from: /\\"/g, to: '"' },
      { from: /\\'/g, to: "'" },
      { from: /\\\\/g, to: '\\' }
    ],
    example: 'puts "Hello #{name}!"'
  },
  json: {
    label: 'JSON',
    escapeRules: [
      { from: /\\/g, to: '\\\\' },
      { from: /"/g, to: '\\"' },
      { from: /\n/g, to: '\\n' },
      { from: /\r/g, to: '\\r' },
      { from: /\t/g, to: '\\t' },
      { from: /\f/g, to: '\\f' },
      { from: /\b/g, to: '\\b' }
    ],
    unescapeRules: [
      { from: /\\n/g, to: '\n' },
      { from: /\\r/g, to: '\r' },
      { from: /\\t/g, to: '\t' },
      { from: /\\f/g, to: '\f' },
      { from: /\\b/g, to: '\b' },
      { from: /\\"/g, to: '"' },
      { from: /\\\\/g, to: '\\' }
    ],
    example: '{"message": "Hello World!", "newline": "Line 1\\nLine 2"}'
  }
};

export function EscapeToolkitPage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [language, setLanguage] = useState<Language>('javascript');
  const [mode, setMode] = useState<'escape' | 'unescape'>('escape');

  // Listen for clipboard paste events
  useEffect(() => {
    const handleClipboardPaste = (event: CustomEvent) => {
      setInput(event.detail.text);
      toast.success('Clipboard content pasted!');
    };

    window.addEventListener('clipboard-paste', handleClipboardPaste as EventListener);
    return () => {
      window.removeEventListener('clipboard-paste', handleClipboardPaste as EventListener);
    };
  }, []);

  const applyRules = useCallback((text: string, rules: EscapeRule[]): string => {
    return rules.reduce((acc, rule) => {
      return acc.replace(rule.from, rule.to);
    }, text);
  }, []);

  const handleProcess = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!input.trim()) {
      toast.error('Please enter some text');
      return;
    }

    try {
      const config = LANGUAGE_CONFIGS[language];
      const rules = mode === 'escape' ? config.escapeRules : config.unescapeRules;
      const processed = applyRules(input, rules);
      
      setResult(processed);
      toast.success(`Text ${mode}d for ${config.label} successfully`);
    } catch (error) {
      toast.error(`Error ${mode}ing text`);
      setResult('');
    }
  }, [input, language, mode, applyRules]);

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

  const loadExample = () => {
    const config = LANGUAGE_CONFIGS[language];
    setInput(config.example);
    setResult('');
  };

  return (
    <div className="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Escape Toolkit</h1>
        <p className="text-lg text-slate-400">
          String escape/unescape for multiple programming languages
        </p>
      </div>

      {/* Language & Mode Selection */}
      <div className="mb-6 tool-card">
        <h3 className="mb-4 text-lg font-semibold text-white">Configuration</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="language" className="block mb-2 text-sm font-medium text-slate-300">
              Programming Language
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="input-field"
            >
              {Object.entries(LANGUAGE_CONFIGS).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-300">
              Operation Mode
            </label>
            <div className="p-1 rounded-lg bg-slate-800">
              <button
                onClick={() => setMode('escape')}
                className={`px-4 py-2 rounded transition-colors ${
                  mode === 'escape' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Escape
              </button>
              <button
                onClick={() => setMode('unescape')}
                className={`px-4 py-2 rounded transition-colors ${
                  mode === 'unescape' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Unescape
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
        {/* Input Section */}
        <div className="tool-card">
          <h3 className="flex items-center mb-4 text-lg font-semibold text-white">
            Input Text
            {mode === 'escape' ? (
              <ArrowRight className="w-5 h-5 ml-2 text-cyan-500" />
            ) : (
              <ArrowLeft className="w-5 h-5 ml-2 text-cyan-500" />
            )}
          </h3>
          <form onSubmit={handleProcess} className="space-y-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={mode === 'escape' 
                ? `Enter text to escape for ${LANGUAGE_CONFIGS[language].label}` 
                : `Enter escaped ${LANGUAGE_CONFIGS[language].label} string`
              }
              className="h-32 font-mono textarea-field"
              aria-label={`Text to ${mode}`}
            />
            <div className="flex flex-wrap gap-3">
              <button 
                type="submit" 
                className="btn-primary"
                disabled={!input.trim()}
              >
                {mode === 'escape' ? 'Escape String' : 'Unescape String'}
              </button>
              <button
                type="button"
                onClick={loadExample}
                className="btn-secondary"
              >
                Load Example
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

        {/* Result Section */}
        <div className="tool-card">
          <h3 className="flex items-center mb-4 text-lg font-semibold text-white">
            <Code className="w-5 h-5 mr-2 text-cyan-500" />
            Result
          </h3>
          {result ? (
            <div className="space-y-4">
              <textarea
                value={result}
                readOnly
                className="h-32 font-mono text-sm textarea-field bg-slate-900"
                aria-label="Processed result"
              />
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleCopy(result)}
                  className="inline-flex items-center space-x-2 btn-copy"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Result</span>
                </button>
                <span className="text-sm text-slate-500">
                  {result.length} characters
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg bg-slate-900 border-slate-700">
              <p className="text-slate-500">Result will appear here</p>
            </div>
          )}
        </div>
      </div>

      <GoogleAdSlot adSlotId="1234567890" />

      {/* Language-Specific Info */}
      <div className="mt-8 tool-card">
        <h3 className="mb-4 text-lg font-semibold text-white">
          {LANGUAGE_CONFIGS[language].label} Escape Rules
        </h3>
        <div className="prose prose-invert max-w-none">
          <p className="mb-4 text-slate-400">
            String escaping for {LANGUAGE_CONFIGS[language].label} ensures special characters 
            are properly encoded for use in string literals and prevents syntax errors.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-medium text-white">Common Escape Sequences:</h4>
              <ul className="space-y-1 font-mono text-sm text-slate-400">
                <li>\\ → \\\\ (backslash)</li>
                <li>" → \\" (double quote)</li>
                <li>\n → \\n (newline)</li>
                <li>\t → \\t (tab)</li>
                <li>\r → \\r (carriage return)</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-medium text-white">Example Usage:</h4>
              <div className="p-3 font-mono text-sm rounded bg-slate-900 text-slate-300">
                {LANGUAGE_CONFIGS[language].example}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}