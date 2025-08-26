import React,{ useState, useCallback, useRef, useEffect } from 'react';
import { Copy, Download, QrCode, Upload, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import QRCodeReact from 'react-qr-code';
import { GoogleAdSlot } from '../components/GoogleAdSlot';

type QRType = 'text' | 'url' | 'file';

export function QRCodePage() {
  const [input, setInput] = useState('');
  const [qrType, setQRType] = useState<QRType>('text');
  const [qrValue, setQRValue] = useState('');
  const [size, setSize] = useState(256);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [fgColor, setFgColor] = useState('#000000');
  const qrRef = useRef<HTMLDivElement>(null);

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

  const generateQR = useCallback(() => {
    if (!input.trim()) {
      toast.error('Please enter some content');
      return;
    }

    let value = input.trim();

    // Add protocol if it's a URL and doesn't have one
    if (qrType === 'url' && !value.match(/^https?:\/\//)) {
      value = `https://${value}`;
    }

    setQRValue(value);
    toast.success('QR Code generated successfully!');
  }, [input, qrType]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    } catch {
      toast.error('Failed to copy');
    }
  };

  const downloadQR = useCallback(() => {
    if (!qrValue) {
      toast.error('Generate a QR code first');
      return;
    }

    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;

    // Create canvas and draw SVG
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;

    // Convert SVG to image
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      
      // Download as PNG
      canvas.toBlob((blob) => {
        if (blob) {
          const downloadUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = `qrcode-${Date.now()}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(downloadUrl);
          toast.success('QR Code downloaded!');
        }
      }, 'image/png');
      
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, [qrValue, size]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      generateQR();
    }
  };

  const qrTypes = [
    { value: 'text' as QRType, label: 'Text', icon: QrCode, placeholder: 'Enter any text...' },
    { value: 'url' as QRType, label: 'URL', icon: LinkIcon, placeholder: 'Enter website URL...' },
    { value: 'file' as QRType, label: 'File Link', icon: Upload, placeholder: 'Enter file sharing link...' }
  ];

  return (
    <div className="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">QR Code Generator</h1>
        <p className="text-lg text-slate-400">
          Generate QR codes for text, URLs, and file links with customizable styling
        </p>
      </div>

      {/* QR Type Selection */}
      <div className="mb-6 tool-card">
        <h3 className="mb-4 text-lg font-semibold text-white">QR Code Type</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {qrTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.value}
                onClick={() => setQRType(type.value)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  qrType === type.value
                    ? 'border-indigo-500 bg-indigo-500/10 text-white'
                    : 'border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white'
                }`}
              >
                <Icon className="w-6 h-6 mb-2" />
                <div className="font-medium">{type.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
        {/* Input Section */}
        <div className="tool-card">
          <h3 className="mb-4 text-lg font-semibold text-white">Content & Settings</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="content" className="block mb-2 text-sm font-medium text-slate-300">
                Content
              </label>
              <textarea
                id="content"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={qrTypes.find(t => t.value === qrType)?.placeholder}
                className="h-24 textarea-field"
                aria-label="QR code content"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="size" className="block mb-2 text-sm font-medium text-slate-300">
                  Size (px)
                </label>
                <select
                  id="size"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="input-field"
                >
                  <option value={128}>128x128</option>
                  <option value={256}>256x256</option>
                  <option value={512}>512x512</option>
                  <option value={1024}>1024x1024</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-300">
                  Colors
                </label>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-full h-10 border rounded border-slate-600 bg-slate-800"
                      title="Foreground color"
                    />
                    <span className="text-xs text-slate-400">Foreground</span>
                  </div>
                  <div className="flex-1">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-full h-10 border rounded border-slate-600 bg-slate-800"
                      title="Background color"
                    />
                    <span className="text-xs text-slate-400">Background</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={generateQR}
              disabled={!input.trim()}
              className="w-full btn-primary"
            >
              Generate QR Code
            </button>
          </div>
        </div>

        {/* QR Code Display */}
        <div className="tool-card">
          <h3 className="flex items-center mb-4 text-lg font-semibold text-white">
            <QrCode className="w-5 h-5 mr-2 text-indigo-500" />
            Generated QR Code
          </h3>
          {qrValue ? (
            <div className="space-y-4">
              <div 
                ref={qrRef}
                className="flex justify-center p-4 bg-white rounded-lg"
                style={{ backgroundColor: bgColor }}
              >
                <QRCodeReact
                  value={qrValue}
                  size={Math.min(size, 300)} // Limit display size
                  bgColor={bgColor}
                  fgColor={fgColor}
                  level="M"
                />
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-slate-400">
                  <strong>Content:</strong> {qrValue.length > 50 ? `${qrValue.substring(0, 50)}...` : qrValue}
                </div>
                <div className="text-sm text-slate-400">
                  <strong>Size:</strong> {size}x{size}px
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleCopy(qrValue)}
                  className="inline-flex items-center space-x-2 btn-copy"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Content</span>
                </button>
                <button
                  onClick={downloadQR}
                  className="inline-flex items-center space-x-2 btn-secondary"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PNG</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg bg-slate-900 border-slate-700">
              <div className="text-center">
                <QrCode className="w-12 h-12 mx-auto mb-2 text-slate-600" />
                <p className="text-slate-500">QR Code will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <GoogleAdSlot adSlotId="2345678901" />

      {/* Info Section */}
      <div className="mt-8 tool-card">
        <h3 className="mb-4 text-lg font-semibold text-white">About QR Codes</h3>
        <div className="prose prose-invert max-w-none">
          <p className="mb-4 text-slate-400">
            QR (Quick Response) codes are two-dimensional barcodes that can store various types 
            of information and be quickly scanned by smartphones and other devices.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-medium text-white">Supported Content:</h4>
              <ul className="space-y-1 text-sm text-slate-400">
                <li>Plain text and messages</li>
                <li>Website URLs and links</li>
                <li>Email addresses</li>
                <li>Phone numbers</li>
                <li>WiFi credentials</li>
                <li>File sharing links</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-medium text-white">Features:</h4>
              <ul className="space-y-1 text-sm text-slate-400">
                <li>Customizable colors and sizes</li>
                <li>High-quality PNG download</li>
                <li>Error correction level M</li>
                <li>Mobile-friendly scanning</li>
                <li>Google Lens compatible</li>
                <li>No data stored on servers</li>
              </ul>
            </div>
          </div>
          <div className="p-4 mt-6 border rounded-lg bg-indigo-900/20 border-indigo-700/30">
            <h4 className="mb-2 font-medium text-indigo-400">💡 Pro Tips:</h4>
            <ul className="space-y-1 text-sm text-indigo-200">
              <li>Keep URLs short for better scanning reliability</li>
              <li>Test QR codes on different devices before sharing</li>
              <li>Use high contrast colors for better readability</li>
              <li>Consider the scanning distance when choosing size</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}