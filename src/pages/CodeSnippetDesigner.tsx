import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Copy,
  Download,
  Settings,
  Palette,
  Type,
  Image,
  Play,
  Square,
  RotateCcw,
} from "lucide-react";
import toast from "react-hot-toast";
import { GoogleAdSlot } from "../components/GoogleAdSlot";
import { useCodeMirrorLoader } from "../components/useCodeMirrorLoader";
import { SEOHead } from "../components/SEOHead";

// CodeMirror imports (lazy loaded)
let CodeMirror: any = null;
let loadCodeMirror: Promise<any> | null = null;

interface SnippetSettings {
  theme: string;
  language: string;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  padding: number;
  borderRadius: number;
  showLineNumbers: boolean;
  showWindowFrame: boolean;
  windowTitle: string;
  backgroundColor: string;
  shadowIntensity: number;
  width: number;
  exportFormat: "png" | "svg" | "pdf";
}

interface Preset {
  id: string;
  name: string;
  settings: SnippetSettings;
  createdAt: Date;
}

const defaultSettings: SnippetSettings = {
  theme: "dark",
  language: "javascript",
  fontFamily: "JetBrains Mono",
  fontSize: 14,
  lineHeight: 1.5,
  padding: 32,
  borderRadius: 12,
  showLineNumbers: true,
  showWindowFrame: true,
  windowTitle: "Code Snippet",
  backgroundColor: "#1e293b",
  shadowIntensity: 20,
  width: 800,
  exportFormat: "png",
};

const themes = [
  { value: "dark", label: "Dark", bg: "#1e293b" },
  { value: "light", label: "Light", bg: "#ffffff" },
  { value: "dracula", label: "Dracula", bg: "#282a36" },
  { value: "monokai", label: "Monokai", bg: "#272822" },
  { value: "github", label: "GitHub", bg: "#f6f8fa" },
  { value: "vscode", label: "VS Code", bg: "#1e1e1e" },
];

const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
  { value: "markdown", label: "Markdown" },
  { value: "sql", label: "SQL" },
];

const fontFamilies = [
  "JetBrains Mono",
  "Fira Code",
  "Source Code Pro",
  "Monaco",
  "Consolas",
  "Ubuntu Mono",
  "Roboto Mono",
];

export function CodeSnippetDesigner() {
  const [code, setCode] = useState(`function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Generate first 10 Fibonacci numbers
for (let i = 0; i < 10; i++) {
  console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}`);

  const [settings, setSettings] = useState<SnippetSettings>(defaultSettings);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [codeMirrorLoaded, setCodeMirrorLoaded] = useState(false);
   const isComingSoon = true;
  const previewRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  // const { initCodeMirror, loaded } = useCodeMirrorLoader();
  // Load presets from localStorage
  useEffect(() => {
    const savedPresets = localStorage.getItem("code-snippet-presets");
    if (savedPresets) {
      try {
        const parsedPresets = JSON.parse(savedPresets).map((preset: any) => ({
          ...preset,
          createdAt: new Date(preset.createdAt),
        }));
        setPresets(parsedPresets);
      } catch (error) {
        console.error("Error loading presets:", error);
      }
    }
  }, []);

  // useEffect(() => {
  //   (async () => {
  //     const cm = await initCodeMirror();
  //     if (editorRef.current) {
  //       cm(editorRef.current, {
  //         value: "console.log('Hello Dynamic CodeMirror!');",
  //         mode: "javascript",
  //         theme: "dracula",
  //         lineNumbers: true,
  //       });
  //     }
  //   })();
  // }, [initCodeMirror]);
  // Save presets to localStorage
  const savePresets = useCallback((newPresets: Preset[]) => {
    localStorage.setItem("code-snippet-presets", JSON.stringify(newPresets));
    setPresets(newPresets);
  }, []);

  // Lazy load CodeMirror
  // const initCodeMirror = useCallback(async () => {
  //   if (CodeMirror) return CodeMirror;

  //   if (!loadCodeMirror) {
  //     loadCodeMirror = import('codemirror').then(async (cm) => {
  //       // Load additional modes and themes
  //       await Promise.all([
  //         import('codemirror/mode/javascript/javascript'),
  //         import('codemirror/mode/python/python'),
  //         import('codemirror/mode/xml/xml'),
  //         import('codemirror/mode/css/css'),
  //         import('codemirror/theme/dracula.css'),
  //         import('codemirror/theme/monokai.css'),
  //         import('codemirror/lib/codemirror.css')
  //       ]);
  //       return cm.default || cm;
  //     });
  //   }

  //   CodeMirror = await loadCodeMirror;
  //   setCodeMirrorLoaded(true);
  //   return CodeMirror;
  // }, []);

  // Initialize CodeMirror editor
  // useEffect(() => {
  //   initCodeMirror();
  // }, [initCodeMirror]);

  // Syntax highlighting with Prism fallback
  const highlightCode = useCallback((code: string, language: string) => {
    // Simple syntax highlighting fallback
    const keywords = {
      javascript: [
        "function",
        "const",
        "let",
        "var",
        "if",
        "else",
        "for",
        "while",
        "return",
        "class",
      ],
      python: [
        "def",
        "class",
        "if",
        "else",
        "elif",
        "for",
        "while",
        "return",
        "import",
        "from",
      ],
      java: [
        "public",
        "private",
        "class",
        "interface",
        "if",
        "else",
        "for",
        "while",
        "return",
      ],
      cpp: [
        "int",
        "char",
        "float",
        "double",
        "if",
        "else",
        "for",
        "while",
        "return",
        "class",
      ],
    };

    let highlighted = code;
    const langKeywords = keywords[language as keyof typeof keywords] || [];

    langKeywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "g");
      highlighted = highlighted.replace(
        regex,
        `<span class="keyword">${keyword}</span>`
      );
    });

    // Highlight strings
    highlighted = highlighted.replace(
      /(["'`])((?:(?!\1)[^\\]|\\.)*)(\1)/g,
      '<span class="string">$1$2$3</span>'
    );

    // Highlight comments
    highlighted = highlighted.replace(
      /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,
      '<span class="comment">$1</span>'
    );

    return highlighted;
  }, []);

  // Export to PNG using html-to-image
  const exportToPNG = useCallback(async () => {
    if (!previewRef.current) return;

    setIsExporting(true);
    try {
      // Dynamic import of html-to-image
      const { toPng } = await import("html-to-image");

      const dataUrl = await toPng(previewRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: settings.backgroundColor,
      });

      const link = document.createElement("a");
      link.download = `code-snippet-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      toast.success("PNG exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export PNG");
    } finally {
      setIsExporting(false);
    }
  }, [settings.backgroundColor]);

  // Export to SVG
  const exportToSVG = useCallback(async () => {
    if (!previewRef.current) return;

    setIsExporting(true);
    try {
      const { toSvg } = await import("html-to-image");

      const dataUrl = await toSvg(previewRef.current, {
        backgroundColor: settings.backgroundColor,
      });

      const link = document.createElement("a");
      link.download = `code-snippet-${Date.now()}.svg`;
      link.href = dataUrl;
      link.click();

      toast.success("SVG exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export SVG");
    } finally {
      setIsExporting(false);
    }
  }, [settings.backgroundColor]);

  // Export to PDF using jsPDF
  const exportToPDF = useCallback(async () => {
    if (!previewRef.current) return;

    setIsExporting(true);
    try {
      const [{ toPng }, { jsPDF }] = await Promise.all([
        import("html-to-image"),
        import("jspdf"),
      ]);

      const dataUrl = await toPng(previewRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: settings.backgroundColor,
      });

      const pdf = new jsPDF({
        orientation: settings.width > 600 ? "landscape" : "portrait",
        unit: "px",
        format: [
          settings.width + settings.padding * 2,
          400 + settings.padding * 2,
        ],
      });

      pdf.addImage(
        dataUrl,
        "PNG",
        0,
        0,
        settings.width + settings.padding * 2,
        400 + settings.padding * 2
      );
      pdf.save(`code-snippet-${Date.now()}.pdf`);

      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export PDF");
    } finally {
      setIsExporting(false);
    }
  }, [settings]);

  // Handle export based on format
  const handleExport = useCallback(() => {
    switch (settings.exportFormat) {
      case "png":
        exportToPNG();
        break;
      case "svg":
        exportToSVG();
        break;
      case "pdf":
        exportToPDF();
        break;
    }
  }, [settings.exportFormat, exportToPNG, exportToSVG, exportToPDF]);

  // Save preset
  const savePreset = useCallback(() => {
    const name = prompt("Enter preset name:");
    if (!name) return;

    const newPreset: Preset = {
      id: Date.now().toString(),
      name,
      settings: { ...settings },
      createdAt: new Date(),
    };

    const newPresets = [newPreset, ...presets.slice(0, 19)]; // Keep last 20
    savePresets(newPresets);
    toast.success("Preset saved!");
  }, [settings, presets, savePresets]);

  // Load preset
  const loadPreset = useCallback((preset: Preset) => {
    setSettings(preset.settings);
    toast.success(`Preset "${preset.name}" loaded!`);
  }, []);

  // Delete preset
  const deletePreset = useCallback(
    (presetId: string) => {
      if (confirm("Delete this preset?")) {
        const newPresets = presets.filter((p) => p.id !== presetId);
        savePresets(newPresets);
        toast.success("Preset deleted!");
      }
    },
    [presets, savePresets]
  );

  // Copy code to clipboard
  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard!");
    } catch {
      toast.error("Failed to copy code");
    }
  }, [code]);

  // Reset to defaults
  const resetSettings = useCallback(() => {
    if (confirm("Reset all settings to default?")) {
      setSettings(defaultSettings);
      toast.success("Settings reset to default");
    }
  }, []);

  // Load example code
  const loadExample = useCallback((lang: string) => {
    const examples = {
      javascript: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`,
      python: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(fibonacci(10))`,
      java: `public class Fibonacci {
    public static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
    
    public static void main(String[] args) {
        System.out.println(fibonacci(10));
    }
}`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Hello World</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>Welcome to my website.</p>
</body>
</html>`,
    };

    setCode(examples[lang as keyof typeof examples] || examples.javascript);
  }, []);
  if (isComingSoon) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900">
        <div className="relative w-full max-w-2xl animate-fade-in">
          <img
            src="/25515.jpg"
            alt="Code Snippet Designer Banner"
            className="object-cover w-full h-64 shadow-lg sm:h-80 md:h-96 rounded-2xl mix-blend-overlay"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-3xl font-bold text-white md:text-5xl drop-shadow-lg">
              Coming Soon 🚀
            </h1>
          </div>
        </div>
      </div>
    );
  }
  

  return (
     <>
      
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8 animate-fade-in">
      <SEOHead
        title="Code Snippet Designer - Create Beautiful Code Screenshots"
        description="Create beautiful code screenshots with syntax highlighting, custom themes, and export to PNG, SVG, PDF. Perfect for documentation and social media."
        keywords="code screenshot, syntax highlighting, code snippet, programming, developer tools, code export"
        canonicalUrl="/code-snippet-designer"
      />
        {/* SEO Meta Tags */}
        <div style={{ display: "none" }}>
          <h1>Code Snippet Designer - Create Beautiful Code Screenshots</h1>
          <meta
            name="description"
            content="Create beautiful code screenshots with syntax highlighting, custom themes, and export to PNG, SVG, PDF. Perfect for documentation and social media."
          />
          <meta
            name="keywords"
            content="code screenshot, syntax highlighting, code snippet, programming, developer tools, code export"
          />
        </div>

        <div className="mb-8 text-center">
          <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Code Snippet Designer
          </h1>
          <p className="text-lg text-slate-400">
            Create beautiful code screenshots with syntax highlighting and
            custom styling
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
          {/* Code Editor */}
          <div className="xl:col-span-2">
            <div className="tool-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Code Editor
                </h3>
                <div className="flex items-center space-x-2">
                  <select
                    value={settings.language}
                    onChange={(e) => {
                      setSettings({ ...settings, language: e.target.value });
                      loadExample(e.target.value);
                    }}
                    className="text-sm input-field"
                  >
                    {languages.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={copyCode}
                    className="p-2 btn-secondary"
                    title="Copy code"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="font-mono text-sm textarea-field h-96"
                placeholder="Enter your code here..."
                style={{ fontFamily: settings.fontFamily }}
              />
            </div>
          </div>

          {/* Preview */}
          <div className="xl:col-span-2">
            <div className="tool-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Preview</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 btn-secondary"
                    title="Settings"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleExport}
                    disabled={isExporting}
                    className="inline-flex items-center space-x-2 btn-primary"
                  >
                    {isExporting ? (
                      <div className="w-4 h-4 border-b-2 border-white rounded-full animate-spin"></div>
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    <span>
                      {isExporting
                        ? "Exporting..."
                        : `Export ${settings.exportFormat.toUpperCase()}`}
                    </span>
                  </button>
                </div>
              </div>{" "}
              @inspitech
              <div className="p-4 overflow-auto rounded-lg bg-slate-900">
                <div
                  ref={previewRef}
                  className="inline-block"
                  style={{
                    backgroundColor: settings.backgroundColor,
                    padding: settings.padding,
                    borderRadius: settings.borderRadius,
                    boxShadow: `0 ${settings.shadowIntensity}px ${
                      settings.shadowIntensity * 2
                    }px rgba(0,0,0,0.3)`,
                    width: settings.width,
                    fontFamily: settings.fontFamily,
                    fontSize: settings.fontSize,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  {settings.showWindowFrame && (
                    <div className="flex items-center pb-3 mb-4 space-x-2 border-b border-slate-600">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="flex-1 text-sm font-medium text-center text-slate-400">
                        {settings.windowTitle}
                      </div>
                    </div>
                  )}

                  <pre className="overflow-x-auto text-slate-300">
                    <code
                      dangerouslySetInnerHTML={{
                        __html: highlightCode(code, settings.language),
                      }}
                    />
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mt-6 tool-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="flex items-center text-lg font-semibold text-white">
                <Settings className="w-5 h-5 mr-2 text-blue-500" />
                Customization Settings
              </h3>
              <div className="flex items-center space-x-2">
                <button onClick={savePreset} className="text-sm btn-secondary">
                  Save Preset
                </button>
                <button
                  onClick={resetSettings}
                  className="text-sm btn-secondary"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reset
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Theme & Colors */}
              <div className="space-y-4">
                <h4 className="flex items-center font-medium text-white">
                  <Palette className="w-4 h-4 mr-2" />
                  Theme & Colors
                </h4>

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-300">
                    Theme
                  </label>
                  <select
                    value={settings.theme}
                    onChange={(e) =>
                      setSettings({ ...settings, theme: e.target.value })
                    }
                    className="input-field"
                  >
                    {themes.map((theme) => (
                      <option key={theme.value} value={theme.value}>
                        {theme.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-300">
                    Background Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={settings.backgroundColor}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          backgroundColor: e.target.value,
                        })
                      }
                      className="w-12 h-10 border rounded border-slate-600"
                    />
                    <input
                      type="text"
                      value={settings.backgroundColor}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          backgroundColor: e.target.value,
                        })
                      }
                      className="flex-1 font-mono text-sm input-field"
                    />
                  </div>
                </div>
              </div>

              {/* Typography */}
              <div className="space-y-4">
                <h4 className="flex items-center font-medium text-white">
                  <Type className="w-4 h-4 mr-2" />
                  Typography
                </h4>

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-300">
                    Font Family
                  </label>
                  <select
                    value={settings.fontFamily}
                    onChange={(e) =>
                      setSettings({ ...settings, fontFamily: e.target.value })
                    }
                    className="input-field"
                  >
                    {fontFamilies.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-300">
                    Font Size: {settings.fontSize}px
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="24"
                    value={settings.fontSize}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        fontSize: parseInt(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-300">
                    Line Height: {settings.lineHeight}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="2"
                    step="0.1"
                    value={settings.lineHeight}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        lineHeight: parseFloat(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                </div>
              </div>

              {/* Layout & Export */}
              <div className="space-y-4">
                <h4 className="flex items-center font-medium text-white">
                  <Image className="w-4 h-4 mr-2" />
                  Layout & Export
                </h4>

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-300">
                    Width: {settings.width}px
                  </label>
                  <input
                    type="range"
                    min="400"
                    max="1200"
                    value={settings.width}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        width: parseInt(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-300">
                    Padding: {settings.padding}px
                  </label>
                  <input
                    type="range"
                    min="16"
                    max="64"
                    value={settings.padding}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        padding: parseInt(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-300">
                    Border Radius: {settings.borderRadius}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    value={settings.borderRadius}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        borderRadius: parseInt(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-300">
                    Export Format
                  </label>
                  <select
                    value={settings.exportFormat}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        exportFormat: e.target.value as "png" | "svg" | "pdf",
                      })
                    }
                    className="input-field"
                  >
                    <option value="png">PNG</option>
                    <option value="svg">SVG</option>
                    <option value="pdf">PDF</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.showWindowFrame}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          showWindowFrame: e.target.checked,
                        })
                      }
                      className="text-blue-600 rounded bg-slate-700 border-slate-600 focus:ring-blue-500"
                    />
                    <span className="text-slate-300">Show window frame</span>
                  </label>

                  {settings.showWindowFrame && (
                    <input
                      type="text"
                      value={settings.windowTitle}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          windowTitle: e.target.value,
                        })
                      }
                      placeholder="Window title"
                      className="text-sm input-field"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Presets */}
        {presets.length > 0 && (
          <div className="mt-6 tool-card">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Saved Presets
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {presets.map((preset) => (
                <div
                  key={preset.id}
                  className="p-4 border rounded-lg bg-slate-800 border-slate-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">{preset.name}</h4>
                    <button
                      onClick={() => deletePreset(preset.id)}
                      className="text-sm text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="mb-3 text-xs text-slate-400">
                    {preset.createdAt.toLocaleDateString()}
                  </div>
                  <button
                    onClick={() => loadPreset(preset)}
                    className="w-full text-sm btn-secondary"
                  >
                    Load Preset
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <GoogleAdSlot adSlotId="1234567890" />

        {/* Features Info */}
        <div className="mt-8 tool-card">
          <h3 className="mb-4 text-lg font-semibold text-white">Features</h3>
          <div className="grid grid-cols-1 gap-6 text-sm md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-medium text-white">Styling Options:</h4>
              <ul className="space-y-1 text-slate-400">
                <li>✓ Multiple themes and color schemes</li>
                <li>✓ Custom fonts and typography settings</li>
                <li>✓ Adjustable padding, radius, and shadows</li>
                <li>✓ Window frame with custom titles</li>
                <li>✓ Responsive width and layout options</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-medium text-white">Export & Sharing:</h4>
              <ul className="space-y-1 text-slate-400">
                <li>✓ Export to PNG, SVG, and PDF formats</li>
                <li>✓ High-resolution output for print</li>
                <li>✓ Save and load custom presets</li>
                <li>✓ Copy code to clipboard</li>
                <li>✓ Offline-capable, client-side processing</li>
              </ul>
            </div>
          </div>
        </div>

        <style jsx>{`
          .keyword {
            color: #ff79c6;
            font-weight: bold;
          }
          .string {
            color: #f1fa8c;
          }
          .comment {
            color: #6272a4;
            font-style: italic;
          }
        `}</style>
      </div>
    </>
  );
}
