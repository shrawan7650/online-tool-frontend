import React, { useState, useEffect } from "react";
import { Download, Copy, Plus, X, Search, Code, FileText } from "lucide-react";
interface Template {
  name: string;
  content: string;
}
interface CustomGitIgnoreGeneratorProps {
  templates: Template[];
}
// Component 2: Custom GitIgnore Generator
// const CustomGitIgnoreGenerator: React.FC<CustomGitIgnoreGeneratorProps> = ({ templates }) => {
//   const [customRules, setCustomRules] = useState<string>('');
//   const [finalContent, setFinalContent] = useState<string>('');
//   const [copied, setCopied] = useState<boolean>(false);

//   useEffect(() => {
//     generateFinalContent();
//   }, [templates, customRules]);

//   const generateFinalContent = (): void => {
//     let content = '';

//     // Add header comment
//     if (templates.length > 0) {
//       content += `# Generated .gitignore for: ${templates.map(t => t.name).join(', ')}\n`;
//       content += `# Created on: ${new Date().toLocaleDateString()}\n\n`;
//     }

//     // Add templates content
//     templates.forEach((template, index) => {
//       if (index > 0) content += '\n';
//       content += `# ===== ${template.name} =====\n`;
//       content += template.content;
//       if (!template.content.endsWith('\n')) content += '\n';
//     });

//     // Add custom rules
//     if (customRules.trim()) {
//       if (content) content += '\n';
//       content += '# ===== Custom Rules =====\n';
//       content += customRules;
//       if (!customRules.endsWith('\n')) content += '\n';
//     }

//     setFinalContent(content);
//   };

//   const copyToClipboard = async (): Promise<void> => {
//     try {
//       await navigator.clipboard.writeText(finalContent);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     } catch (err) {
//       console.error('Failed to copy:', err);
//     }
//   };

//   const downloadFile = (): void => {
//     const blob = new Blob([finalContent], { type: 'text/plain' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = '.gitignore';
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div className="p-6 rounded-lg shadow-md">
//       <div className="flex items-center gap-2 mb-4">
//         <FileText className="w-5 h-5 text-green-600" />
//         <h2 className="text-xl font-semibold text-gray-800">Custom .gitignore Generator</h2>
//       </div>

//       <div className="mb-4">
//         <label className="block mb-2 text-sm font-medium text-gray-700">
//           Add Custom Rules (optional)
//         </label>
//         <textarea
//           placeholder="Add your custom ignore patterns here...&#10;Example:&#10;*.log&#10;.env&#10;/dist&#10;node_modules/"
//           className="w-full h-32 p-3 font-mono text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//           value={customRules}
//           onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCustomRules(e.target.value)}
//         />
//       </div>

//       {finalContent && (
//         <div>
//           <div className="flex items-center justify-between mb-2">
//             <label className="text-sm font-medium text-gray-700">
//               Generated .gitignore Content
//             </label>
//             <div className="flex gap-2">
//               <button
//                 onClick={copyToClipboard}
//                 className="flex items-center gap-1 px-3 py-1 text-sm text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
//               >
//                 <Copy className="w-4 h-4" />
//                 {copied ? 'Copied!' : 'Copy'}
//               </button>
//               <button
//                 onClick={downloadFile}
//                 className="flex items-center gap-1 px-3 py-1 text-sm text-white transition-colors bg-green-600 rounded-md hover:bg-green-700"
//               >
//                 <Download className="w-4 h-4" />
//                 Download
//               </button>
//             </div>
//           </div>
//           <div className="p-3 overflow-y-auto border border-gray-300 rounded-lg max-h-96">
//             <pre className="font-mono text-sm text-white whitespace-pre-wrap">
//               {finalContent}
//             </pre>
//           </div>
//           <div className="mt-2 text-xs text-gray-500">
//             Lines: {finalContent.split('\n').length} | Characters: {finalContent.length}
//           </div>
//         </div>
//       )}

//       {!finalContent && (
//         <div className="py-8 text-center text-gray-500">
//           <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
//           <p>Select templates or add custom rules to generate your .gitignore file</p>
//         </div>
//       )}
//     </div>
//   );
// };

const CustomGitIgnoreGenerator: React.FC<CustomGitIgnoreGeneratorProps> = ({
  templates,
}) => {
  const [customRules, setCustomRules] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("combined");
  const [copied, setCopied] = useState<{ [key: string]: boolean }>({});

  const generateTemplateContent = (template: Template): string => {
    let content = `# Generated .gitignore for: ${template.name}\n`;
    content += `# Created on: ${new Date().toLocaleDateString()}\n\n`;
    content += template.content;
    if (!template.content.endsWith("\n")) content += "\n";
    return content;
  };

  const generateCombinedContent = (): string => {
    let content = "";

    // Add header comment
    if (templates.length > 0) {
      content += `# Generated .gitignore for: ${templates.map((t) => t.name).join(", ")}\n`;
      content += `# Created on: ${new Date().toLocaleDateString()}\n\n`;
    }

    // Add templates content
    templates.forEach((template, index) => {
      if (index > 0) content += "\n";
      content += `# ===== ${template.name} =====\n`;
      content += template.content;
      if (!template.content.endsWith("\n")) content += "\n";
    });

    // Add custom rules
    if (customRules.trim()) {
      if (content) content += "\n";
      content += "# ===== Custom Rules =====\n";
      content += customRules;
      if (!customRules.endsWith("\n")) content += "\n";
    }

    return content;
  };

  const getActiveContent = (): string => {
    if (activeTab === "combined") {
      return generateCombinedContent();
    }
    if (activeTab === "custom") {
      return customRules;
    }
    const template = templates.find((t) => t.name === activeTab);
    return template ? generateTemplateContent(template) : "";
  };

  const copyToClipboard = async (
    content: string,
    tabId: string,
  ): Promise<void> => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied((prev) => ({ ...prev, [tabId]: true }));
      setTimeout(() => {
        setCopied((prev) => ({ ...prev, [tabId]: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const downloadFile = (content: string, filename: string): void => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const activeContent = getActiveContent();

  return (
    <div className="p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-green-600" />
        <h2 className="text-xl font-semibold text-gray-800">
          Generated .gitignore Files
        </h2>
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Add Custom Rules (optional)
        </label>
        <textarea
          placeholder="Add your custom ignore patterns here...&#10;Example:&#10;*.log&#10;.env&#10;/dist&#10;node_modules/"
          className="h-24 textarea-field"
          value={customRules}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setCustomRules(e.target.value)
          }
        />
      </div>

      {(templates.length > 0 || customRules.trim()) && (
        <div>
          {/* Tab Navigation */}
          <div className="flex items-center gap-2 mb-4 border-b border-gray-200">
            <div className="flex max-w-full gap-1 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {/* Combined Tab */}
              {templates.length > 0 && (
                <button
                  onClick={() => setActiveTab("combined")}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg whitespace-nowrap transition-colors ${
                    activeTab === "combined"
                      ? "bg-blue-100 text-blue-700 border-b-2 border-blue-500"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  Combined ({templates.length} templates)
                </button>
              )}

              {/* Individual Template Tabs */}
              {templates.map((template) => (
                <button
                  key={template.name}
                  onClick={() => setActiveTab(template.name)}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg whitespace-nowrap transition-colors ${
                    activeTab === template.name
                      ? "bg-green-100 text-green-700 border-b-2 border-green-500"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  {template.name}
                </button>
              ))}

              {/* Custom Rules Tab */}
              {customRules.trim() && (
                <button
                  onClick={() => setActiveTab("custom")}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg whitespace-nowrap transition-colors ${
                    activeTab === "custom"
                      ? "bg-purple-100 text-purple-700 border-b-2 border-purple-500"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  Custom Rules
                </button>
              )}
            </div>
          </div>

          {/* Tab Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                {activeTab === "combined" && "Combined .gitignore Content"}
                {activeTab === "custom" && "Custom Rules Only"}
                {templates.find((t) => t.name === activeTab) &&
                  `${activeTab} Template`}
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(activeContent, activeTab)}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  <Copy className="w-4 h-4" />
                  {copied[activeTab] ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={() => {
                    const filename =
                      activeTab === "combined"
                        ? ".gitignore"
                        : activeTab === "custom"
                          ? "custom-rules.txt"
                          : `${activeTab}.gitignore`;
                    downloadFile(activeContent, filename);
                  }}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-white transition-colors bg-green-600 rounded-md hover:bg-green-700"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
            <div className="p-3 overflow-y-auto text-white border border-gray-300 rounded-lg max-h-96">
              <pre className="font-mono text-sm text-gray-800 whitespace-pre-wrap">
                {activeContent || "No content available"}
              </pre>
            </div>
            <div className="mt-2 text-xs text-white">
              Lines: {activeContent.split("\n").length} | Characters:{" "}
              {activeContent.length}
              {activeTab === "combined" && templates.length > 1 && (
                <span className="ml-2">• Templates: {templates.length}</span>
              )}
            </div>
          </div>
        </div>
      )}

      {templates.length === 0 && !customRules.trim() && (
        <div className="py-8 text-center text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>
            Select templates or add custom rules to generate your .gitignore
            file
          </p>
        </div>
      )}
    </div>
  );
};
export default CustomGitIgnoreGenerator;
