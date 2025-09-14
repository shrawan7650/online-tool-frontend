import React,{ useState, useCallback } from 'react';
import { Copy, Minimize2, Download, FileText, Code, Palette } from 'lucide-react';
import toast from 'react-hot-toast';
import { GoogleAdSlot } from '../components/GoogleAdSlot';
import { SEOHead } from '../components/SEOHead';

type MinifierType = 'html' | 'css' | 'js' | 'json';

export function MinifiersPage() {
  const [activeType, setActiveType] = useState<MinifierType>('html');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [compressionRatio, setCompressionRatio] = useState(0);

  const minifyHTML = useCallback((html: string): string => {
    return html
      // Remove comments
      .replace(/<!--[\s\S]*?-->/g, '')
      // Remove whitespace between tags
      .replace(/>\s+</g, '><')
      // Remove leading/trailing whitespace
      .replace(/^\s+|\s+$/gm, '')
      // Remove empty lines
      .replace(/\n\s*\n/g, '\n')
      // Collapse multiple spaces
      .replace(/\s{2,}/g, ' ')
      .trim();
  }, []);

  const minifyCSS = useCallback((css: string): string => {
    return css
      // Remove comments
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // Remove whitespace around selectors and properties
      .replace(/\s*{\s*/g, '{')
      .replace(/;\s*}/g, '}')
      .replace(/;\s*/g, ';')
      .replace(/:\s*/g, ':')
      .replace(/,\s*/g, ',')
      // Remove leading/trailing whitespace
      .replace(/^\s+|\s+$/gm, '')
      // Remove empty lines
      .replace(/\n\s*\n/g, '')
      // Remove all line breaks and extra spaces
      .replace(/\n/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }, []);

  const minifyJS = useCallback((js: string): string => {
    return js
      // Remove single-line comments (but preserve URLs)
      .replace(/\/\/(?![^\n]*https?:\/\/)[^\n]*/g, '')
      // Remove multi-line comments
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // Remove leading/trailing whitespace
      .replace(/^\s+|\s+$/gm, '')
      // Remove empty lines
      .replace(/\n\s*\n/g, '\n')
      // Collapse spaces around operators (basic)
      .replace(/\s*([{}();,=+\-*/<>!&|])\s*/g, '$1')
      // Remove spaces around dots
      .replace(/\s*\.\s*/g, '.')
      // Collapse multiple spaces
      .replace(/\s{2,}/g, ' ')
      // Remove line breaks (basic minification)
      .replace(/\n/g, '')
      .trim();
  }, []);

  const minifyJSON = useCallback((json: string): string => {
    try {
      const parsed = JSON.parse(json);
      return JSON.stringify(parsed);
    } catch (error) {
      throw new Error('Invalid JSON format');
    }
  }, []);

  const handleMinify = useCallback(() => {
    if (!input.trim()) {
      toast.error('Please enter some code to minify');
      return;
    }

    try {
      let minified = '';
      
      switch (activeType) {
        case 'html':
          minified = minifyHTML(input);
          break;
        case 'css':
          minified = minifyCSS(input);
          break;
        case 'js':
          minified = minifyJS(input);
          break;
        case 'json':
          minified = minifyJSON(input);
          break;
        default:
          throw new Error('Unknown minifier type');
      }

      setOutput(minified);
      
      // Calculate compression ratio
      const originalSize = new Blob([input]).size;
      const minifiedSize = new Blob([minified]).size;
      const ratio = originalSize > 0 ? ((originalSize - minifiedSize) / originalSize) * 100 : 0;
      setCompressionRatio(ratio);
      
      toast.success(`Code minified successfully! ${ratio.toFixed(1)}% reduction`);
    } catch (error: any) {
      toast.error(error.message || 'Error minifying code');
      setOutput('');
      setCompressionRatio(0);
    }
  }, [input, activeType, minifyHTML, minifyCSS, minifyJS, minifyJSON]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('File downloaded successfully');
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getPlaceholder = (type: MinifierType): string => {
    switch (type) {
      case 'html':
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Example</title>
</head>
<body>
    <!-- This is a comment -->
    <div class="container">
        <h1>Hello World</h1>
        <p>This is a paragraph with    extra spaces.</p>
    </div>
</body>
</html>`;
      case 'css':
        return `.container {
    margin: 0 auto;
    padding: 20px;
    max-width: 1200px;
}

/* This is a comment */
.header {
    background-color: #333;
    color: white;
    padding: 10px 0;
}

.button {
    display: inline-block;
    padding: 10px 20px;
    background: #007bff;
    color: white;
    text-decoration: none;
    border-radius: 4px;
}`;
      case 'js':
        return `function calculateSum(a, b) {
    // This function adds two numbers
    const result = a + b;
    return result;
}

/* Multi-line comment
   explaining the code */
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((acc, num) => {
    return acc + num;
}, 0);

console.log('Sum:', sum);`;
      case 'json':
        return `{
    "name": "John Doe",
    "age": 30,
    "city": "New York",
    "hobbies": [
        "reading",
        "swimming",
        "coding"
    ],
    "address": {
        "street": "123 Main St",
        "zipCode": "10001"
    }
}`;
      default:
        return '';
    }
  };

  const minifierTypes = [
    { value: 'html' as MinifierType, label: 'HTML', icon: FileText, color: 'text-orange-500' },
    { value: 'css' as MinifierType, label: 'CSS', icon: Palette, color: 'text-blue-500' },
    { value: 'js' as MinifierType, label: 'JavaScript', icon: Code, color: 'text-yellow-500' },
    { value: 'json' as MinifierType, label: 'JSON', icon: FileText, color: 'text-green-500' }
  ];

  const originalSize = new Blob([input]).size;
  const minifiedSize = new Blob([output]).size;

  return (
    <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 lg:px-8 animate-fade-in">
          <SEOHead
        title="Code Minifiers - Compress HTML, CSS, JavaScript Online"
        description="Minify and compress HTML, CSS, JavaScript, and JSON code online. Reduce file size, improve load times, and optimize web performance."
        keywords="code minifier, HTML minifier, CSS minifier, JavaScript minifier, JSON minifier, code compression"
        canonicalUrl="/minifiers"
      />
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Code Minifiers</h1>
        <p className="text-lg text-slate-400">
          Compress HTML, CSS, JavaScript, and JSON code to reduce file size
        </p>
      </div>

      {/* Minifier Type Selection */}
      <div className="mb-6 tool-card">
        <h3 className="mb-4 text-lg font-semibold text-white">Select Code Type</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {minifierTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.value}
                onClick={() => {
                  setActiveType(type.value);
                  setInput('');
                  setOutput('');
                  setCompressionRatio(0);
                }}
                className={`p-4 rounded-lg border-2 transition-all text-center ${
                  activeType === type.value
                    ? 'border-blue-500 bg-blue-500/10 text-white'
                    : 'border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white'
                }`}
              >
                <Icon className={`h-6 w-6 mx-auto mb-2 ${type.color}`} />
                <div className="font-medium">{type.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
        {/* Input Section */}
        <div className="tool-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              Original {minifierTypes.find(t => t.value === activeType)?.label}
            </h3>
            <button
              onClick={() => setInput(getPlaceholder(activeType))}
              className="text-sm btn-secondary"
            >
              Load Example
            </button>
          </div>
          
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Paste your ${activeType.toUpperCase()} code here...`}
            className="h-64 font-mono text-sm textarea-field"
            aria-label={`${activeType.toUpperCase()} input`}
          />
          
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-slate-400">
              Size: {formatBytes(originalSize)} | Lines: {input.split('\n').length}
            </div>
            <button
              onClick={handleMinify}
              disabled={!input.trim()}
              className="inline-flex items-center space-x-2 btn-primary"
            >
              <Minimize2 className="w-4 h-4" />
              <span>Minify Code</span>
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="tool-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              Minified {minifierTypes.find(t => t.value === activeType)?.label}
            </h3>
            {output && (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-green-400">
                  -{compressionRatio.toFixed(1)}%
                </span>
              </div>
            )}
          </div>

          {output ? (
            <>
              <textarea
                value={output}
                readOnly
                className="h-64 font-mono text-sm textarea-field bg-slate-900"
                aria-label="Minified output"
              />
              
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-slate-400">
                  Size: {formatBytes(minifiedSize)} | Saved: {formatBytes(originalSize - minifiedSize)}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleCopy(output)}
                    className="inline-flex items-center space-x-2 btn-copy"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={() => handleDownload(output, `minified.${activeType === 'js' ? 'js' : activeType}`)}
                    className="inline-flex items-center space-x-2 btn-secondary"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg bg-slate-900 border-slate-700">
              <div className="text-center">
                <Minimize2 className="w-12 h-12 mx-auto mb-2 text-slate-600" />
                <p className="text-slate-500">Minified code will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      {output && (
        <div className="mb-8 tool-card">
          <h3 className="mb-4 text-lg font-semibold text-white">Compression Statistics</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="p-4 text-center rounded-lg bg-slate-800">
              <div className="text-2xl font-bold text-white">{formatBytes(originalSize)}</div>
              <div className="text-sm text-slate-400">Original Size</div>
            </div>
            <div className="p-4 text-center rounded-lg bg-slate-800">
              <div className="text-2xl font-bold text-white">{formatBytes(minifiedSize)}</div>
              <div className="text-sm text-slate-400">Minified Size</div>
            </div>
            <div className="p-4 text-center rounded-lg bg-slate-800">
              <div className="text-2xl font-bold text-green-400">{formatBytes(originalSize - minifiedSize)}</div>
              <div className="text-sm text-slate-400">Bytes Saved</div>
            </div>
            <div className="p-4 text-center rounded-lg bg-slate-800">
              <div className="text-2xl font-bold text-green-400">{compressionRatio.toFixed(1)}%</div>
              <div className="text-sm text-slate-400">Reduction</div>
            </div>
          </div>
        </div>
      )}

      <GoogleAdSlot adSlotId="5678901234" />

      {/* Info Section */}
      <div className="mt-8 tool-card">
        <h3 className="mb-4 text-lg font-semibold text-white">About Code Minification</h3>
        <div className="prose prose-invert max-w-none">
          <p className="mb-4 text-slate-400">
            Code minification removes unnecessary characters from source code without changing 
            its functionality, reducing file size and improving load times.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-medium text-white">What Gets Removed:</h4>
              <ul className="space-y-1 text-sm text-slate-400">
                <li>• Whitespace and indentation</li>
                <li>• Comments and documentation</li>
                <li>• Empty lines and line breaks</li>
                <li>• Unnecessary semicolons</li>
                <li>• Redundant spaces around operators</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-medium text-white">Benefits:</h4>
              <ul className="space-y-1 text-sm text-slate-400">
                <li>• Faster page load times</li>
                <li>• Reduced bandwidth usage</li>
                <li>• Better SEO performance</li>
                <li>• Improved user experience</li>
                <li>• Lower hosting costs</li>
              </ul>
            </div>
          </div>
          <div className="p-4 mt-6 border rounded-lg bg-blue-900/20 border-blue-700/30">
            <h4 className="mb-2 font-medium text-blue-400">💡 Pro Tips:</h4>
            <ul className="space-y-1 text-sm text-blue-200">
              <li>• Always keep original files for development</li>
              <li>• Use source maps for debugging minified code</li>
              <li>• Test minified code thoroughly before deployment</li>
              <li>• Consider using build tools for automatic minification</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}