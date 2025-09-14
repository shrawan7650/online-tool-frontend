import { useState, useCallback, useEffect } from "react";
import {
  Copy,
  Eye,
  EyeOff,
  Download,
  Upload,
  FileText,
  Code,
} from "lucide-react";
import toast from "react-hot-toast";
import { GoogleAdSlot } from "../components/GoogleAdSlot";
import React from "react";
import { ToggleSwitch } from "../components/ToggleSwitch";
import { SEOHead } from "../components/SEOHead";
export function MarkdownEditorPage() {
  const [markdown, setMarkdown] = useState("");
  const [html, setHtml] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const [isLivePreview, setIsLivePreview] = useState(true);

  // Simple markdown to HTML converter
  const convertMarkdownToHTML = useCallback((md: string): string => {
    let html = md;

    // Headers
    html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
    html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
    html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>");
    html = html.replace(/__(.*?)__/gim, "<strong>$1</strong>");

    // Italic
    html = html.replace(/\*(.*?)\*/gim, "<em>$1</em>");
    html = html.replace(/_(.*?)_/gim, "<em>$1</em>");

    // Code blocks
    html = html.replace(/```([\s\S]*?)```/gim, "<pre><code>$1</code></pre>");

    // Inline code
    html = html.replace(/`(.*?)`/gim, "<code>$1</code>");

    // Links
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/gim,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    // Images
    html = html.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/gim,
      '<img alt="$1" src="$2" />'
    );

    // Lists
    html = html.replace(/^\* (.*$)/gim, "<li>$1</li>");
    html = html.replace(/^\- (.*$)/gim, "<li>$1</li>");
    html = html.replace(/^\+ (.*$)/gim, "<li>$1</li>");
    html = html.replace(/^(\d+)\. (.*$)/gim, "<li>$2</li>");

    // Wrap consecutive list items in ul/ol
    html = html.replace(/(<li>.*<\/li>)/gims, (match) => {
      if (match.includes("<li>")) {
        return `<ul>${match}</ul>`;
      }
      return match;
    });

    // Blockquotes
    html = html.replace(/^> (.*$)/gim, "<blockquote>$1</blockquote>");

    // Horizontal rules
    html = html.replace(/^---$/gim, "<hr>");
    html = html.replace(/^\*\*\*$/gim, "<hr>");

    // Line breaks
    html = html.replace(/\n\n/gim, "</p><p>");
    html = html.replace(/\n/gim, "<br>");

    // Wrap in paragraphs
    html = `<p>${html}</p>`;

    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/gim, "");
    html = html.replace(/<p>(<h[1-6]>.*<\/h[1-6]>)<\/p>/gim, "$1");
    html = html.replace(/<p>(<ul>.*<\/ul>)<\/p>/gims, "$1");
    html = html.replace(/<p>(<blockquote>.*<\/blockquote>)<\/p>/gim, "$1");
    html = html.replace(/<p>(<hr>)<\/p>/gim, "$1");
    html = html.replace(
      /<p>(<pre><code>[\s\S]*?<\/code><\/pre>)<\/p>/gim,
      "$1"
    );

    return html;
  }, []);

  // Convert markdown to HTML
  useEffect(() => {
    if (isLivePreview) {
      setHtml(convertMarkdownToHTML(markdown));
    }
  }, [markdown, isLivePreview, convertMarkdownToHTML]);

  const handleConvert = useCallback(() => {
    if (!markdown.trim()) {
      toast.error("Please enter some Markdown text");
      return;
    }
    setHtml(convertMarkdownToHTML(markdown));
    toast.success("Markdown converted to HTML");
  }, [markdown, convertMarkdownToHTML]);

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${type} copied to clipboard`);
    } catch {
      toast.error(`Failed to copy ${type.toLowerCase()}`);
    }
  };

  const handleDownload = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`${type} downloaded successfully`);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".md") && !file.name.endsWith(".txt")) {
      toast.error("Please select a Markdown (.md) or text (.txt) file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setMarkdown(content);
      toast.success("File loaded successfully");
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const loadExample = () => {
    const exampleMarkdown = `# Markdown Editor Example

This is a **bold** text and this is *italic* text.

## Features

- Convert Markdown to HTML
- Live preview
- Download files
- Copy to clipboard

### Code Example

Here's some \`inline code\` and a code block:

\`\`\`javascript
function hello() {
    console.log("Hello, World!");
}
\`\`\`

### Links and Images

[Visit GitHub](https://github.com)

![Sample Image](https://via.placeholder.com/300x200)

### Blockquote

> This is a blockquote.
> It can span multiple lines.

### Lists

1. First item
2. Second item
3. Third item

- Unordered item
- Another item
- Last item

---

That's all for now!`;

    setMarkdown(exampleMarkdown);
    toast.success("Example loaded");
  };

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8 animate-fade-in">
            <SEOHead
        title="Markdown Editor - Write Markdown with Live Preview"
        description="Online Markdown editor with live HTML preview. Write Markdown and get clean HTML output. Support for tables, code blocks, and all standard syntax."
        keywords="markdown editor, markdown to HTML, markdown converter, live preview, markdown writer"
        canonicalUrl="/markdown-editor"
      />
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
          Markdown Editor
        </h1>
        <p className="text-lg text-slate-400">
          Write Markdown and get clean HTML output with live preview
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 tool-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <ToggleSwitch
                label="Live Preview"
                checked={isLivePreview}
                onChange={setIsLivePreview}
              />
              <span className="text-slate-300">Live Preview</span>
            </label>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="inline-flex items-center space-x-2 btn-secondary"
            >
              {showPreview ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              <span>{showPreview ? "Hide" : "Show"} Preview</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button onClick={loadExample} className="btn-secondary">
              Load Example
            </button>
            <label className="inline-flex items-center space-x-2 cursor-pointer btn-secondary">
              <Upload className="w-4 h-4" />
              <span>Upload .md</span>
              <input
                type="file"
                accept=".md,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            {!isLivePreview && (
              <button
                onClick={handleConvert}
                className="btn-primary"
                disabled={!markdown.trim()}
              >
                Convert to HTML
              </button>
            )}
          </div>
        </div>
      </div>

      <div
        className={`grid gap-6 mb-8 ${
          showPreview ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
        }`}
      >
        {/* Markdown Input */}
        <div className="tool-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center text-lg font-semibold text-white">
              <FileText className="w-5 h-5 mr-2 text-blue-500" />
              Markdown Input
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-400">
                {markdown.length} chars | {markdown.split("\n").length} lines
              </span>
              <button
                onClick={() =>
                  handleDownload(markdown, "document.md", "Markdown")
                }
                className="p-2 btn-secondary"
                disabled={!markdown.trim()}
                title="Download Markdown"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="# Start writing your Markdown here...

Use **bold**, *italic*, `code`, and more!"
            className="font-mono text-sm textarea-field h-96"
            aria-label="Markdown input"
          />
        </div>

        {/* HTML Output & Preview */}
        {showPreview && (
          <div className="space-y-6">
            {/* HTML Code */}
            <div className="tool-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="flex items-center text-lg font-semibold text-white">
                  <Code className="w-5 h-5 mr-2 text-green-500" />
                  HTML Output
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopy(html, "HTML")}
                    className="btn-copy"
                    disabled={!html.trim()}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy HTML
                  </button>
                  <button
                    onClick={() =>
                      handleDownload(html, "document.html", "HTML")
                    }
                    className="p-2 btn-secondary"
                    disabled={!html.trim()}
                    title="Download HTML"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <textarea
                value={html}
                readOnly
                className="h-48 font-mono text-sm textarea-field bg-slate-900"
                aria-label="HTML output"
              />
            </div>

            {/* Live Preview */}
            <div className="tool-card">
              <h3 className="flex items-center mb-4 text-lg font-semibold text-white">
                <Eye className="w-5 h-5 mr-2 text-purple-500" />
                Live Preview
              </h3>

              <div className="p-6 prose bg-white rounded-lg min-h-48 prose-slate max-w-none">
                {html ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: html }}
                    className="markdown-preview"
                  />
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    Preview will appear here as you type...
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <GoogleAdSlot adSlotId="6789012345" />

      {/* Markdown Cheatsheet */}
      <div className="mt-8 tool-card">
        <h3 className="mb-4 text-lg font-semibold text-white">
          Markdown Cheatsheet
        </h3>
        <div className="grid grid-cols-1 gap-6 text-sm md:grid-cols-2 lg:grid-cols-3">
          <div>
            <h4 className="mb-2 font-medium text-white">Headers:</h4>
            <div className="space-y-1 font-mono text-slate-400">
              <div># H1 Header</div>
              <div>## H2 Header</div>
              <div>### H3 Header</div>
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-medium text-white">Text Formatting:</h4>
            <div className="space-y-1 font-mono text-slate-400">
              <div>**bold text**</div>
              <div>*italic text*</div>
              <div>`inline code`</div>
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-medium text-white">Lists:</h4>
            <div className="space-y-1 font-mono text-slate-400">
              <div>- Unordered item</div>
              <div>1. Ordered item</div>
              <div>* Alternative bullet</div>
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-medium text-white">Links & Images:</h4>
            <div className="space-y-1 font-mono text-slate-400">
              <div>[Link](url)</div>
              <div>![Image](url)</div>
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-medium text-white">Code Blocks:</h4>
            <div className="space-y-1 font-mono text-slate-400">
              <div>```javascript</div>
              <div>code here</div>
              <div>```</div>
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-medium text-white">Other:</h4>
            <div className="space-y-1 font-mono text-slate-400">
              <div> Blockquote</div>
              <div>--- Horizontal rule</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .markdown-preview h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.5em 0;
        }
        .markdown-preview h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.5em 0;
        }
        .markdown-preview h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin: 0.5em 0;
        }
        .markdown-preview p {
          margin: 1em 0;
        }
        .markdown-preview ul,
        .markdown-preview ol {
          margin: 1em 0;
          padding-left: 2em;
        }
        .markdown-preview li {
          margin: 0.25em 0;
        }
        .markdown-preview blockquote {
          border-left: 4px solid #ccc;
          margin: 1em 0;
          padding-left: 1em;
          color: #666;
        }
        .markdown-preview code {
          background: #f5f5f5;
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-family: monospace;
        }
        .markdown-preview pre {
          background: #f5f5f5;
          padding: 1em;
          border-radius: 5px;
          overflow-x: auto;
        }
        .markdown-preview pre code {
          background: none;
          padding: 0;
        }
        .markdown-preview hr {
          border: none;
          border-top: 1px solid #ccc;
          margin: 2em 0;
        }
        .markdown-preview img {
          max-width: 100%;
          height: auto;
        }
        .markdown-preview a {
          color: #0066cc;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
