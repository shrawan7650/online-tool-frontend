import React, { useState, useEffect } from "react";
import { Download, Copy, Plus, X, Search, Code, FileText } from "lucide-react";

interface Template {
  name: string;
  content: string;
}

interface GitIgnoreTemplateFetcherProps {
  onTemplateSelect: (templates: Template[]) => void;
}

// Component 1: Template Fetcher from GitHub
// export const GitIgnoreTemplateFetcher: React.FC<GitIgnoreTemplateFetcherProps> = ({ onTemplateSelect }) => {
//   const [templates, setTemplates] = useState<Template[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [selectedTemplates, setSelectedTemplates] = useState<Template[]>([]);

//   // Popular templates list
//   const popularTemplates: string[] = [
//     'Node', 'Python', 'Java', 'C++', 'C', 'Go', 'Rust', 'PHP',
//     'Ruby', 'Swift', 'Kotlin', 'Android', 'iOS', 'React', 'Vue',
//     'Angular', 'Laravel', 'Django', 'Rails', 'Unity', 'Unreal'
//   ];

//   const fetchTemplate = async (templateName: string): Promise<Template | null> => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         `https://raw.githubusercontent.com/github/gitignore/main/${templateName}.gitignore`
//       );
//       if (response.ok) {
//         const content = await response.text();
//         return { name: templateName, content };
//       }
//       throw new Error('Template not found');
//     } catch (error) {
//       console.error(`Failed to fetch ${templateName}:`, error);
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTemplateAdd = async (templateName: string): Promise<void> => {
//     if (selectedTemplates.find(t => t.name === templateName)) return;

//     const template = await fetchTemplate(templateName);
//     if (template) {
//       const updatedTemplates = [...selectedTemplates, template];
//       setSelectedTemplates(updatedTemplates);
//       onTemplateSelect(updatedTemplates);
//     }
//   };

//   const removeTemplate = (templateName: string): void => {
//     const updatedTemplates = selectedTemplates.filter(t => t.name !== templateName);
//     setSelectedTemplates(updatedTemplates);
//     onTemplateSelect(updatedTemplates);
//   };

//   const filteredTemplates: string[] = popularTemplates.filter(template =>
//     template.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="p-6 shadow-md mb-6rounded-lg">
//       <div className="flex items-center gap-2 mb-4">
//         <Code className="w-5 h-5 text-blue-600" />
//         <h2 className="text-xl font-semibold text-gray-800">GitHub Templates</h2>
//       </div>

//       <div className="relative mb-4">
//         <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
//         <input
//           type="text"
//           placeholder="Search templates (Node, Python, React...)"
//           className="w-full py-2 pl-10 pr-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       <div className="grid grid-cols-2 gap-2 mb-4 sm:grid-cols-3 md:grid-cols-4">
//         {filteredTemplates.map((template) => (
//           <button
//             key={template}
//             onClick={() => handleTemplateAdd(template)}
//             disabled={loading || selectedTemplates.find(t => t.name === template)}
//             className={`p-2 rounded-md border transition-colors ${
//               selectedTemplates.find(t => t.name === template)
//                 ? ' border-green-300 text-green-700'
//                 : 'b border-gray-200  hover:border-blue-300'
//             } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
//           >
//             <div className="flex items-center justify-center gap-1">
//               {selectedTemplates.find(t => t.name === template) ? (
//                 <span className="text-sm">✓ {template}</span>
//               ) : (
//                 <>
//                   <Plus className="w-3 h-3" />
//                   <span className="text-sm">{template}</span>
//                 </>
//               )}
//             </div>
//           </button>
//         ))}
//       </div>

//       {selectedTemplates.length > 0 && (
//         <div>
//           <h3 className="mb-2 font-medium text-gray-700">Selected Templates:</h3>
//           <div className="flex flex-wrap gap-2">
//             {selectedTemplates.map((template) => (
//               <div
//                 key={template.name}
//                 className="flex items-center gap-1 px-3 py-1 text-blue-800 bg-blue-100 rounded-full"
//               >
//                 <span className="text-sm">{template.name}</span>
//                 <button
//                   onClick={() => removeTemplate(template.name)}
//                   className="text-blue-600 hover:text-blue-800"
//                 >
//                   <X className="w-3 h-3" />
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {loading && (
//         <div className="py-4 text-center">
//           <div className="inline-block w-6 h-6 border-b-2 border-blue-600 rounded-full animate-spin"></div>
//           <p className="mt-2 text-sm text-gray-600">Fetching template...</p>
//         </div>
//       )}
//     </div>
//   );
// };

export const GitIgnoreTemplateFetcher: React.FC<
  GitIgnoreTemplateFetcherProps
> = ({ onTemplateSelect }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTemplates, setSelectedTemplates] = useState<Template[]>([]);

  // Popular templates list
  const popularTemplates: string[] = [
    "Node",
    "Python",
    "Java",
    "C++",
    "C",
    "Go",
    "Rust",
    "PHP",
    "Ruby",
    "Swift",
    "Kotlin",
    "Android",
    "iOS",
    "react",
    "Vue",
    "Angular",
    "Laravel",
    "Django",
    "Rails",
    "Unity",
    "Unreal",
  ];

  const fetchTemplate = async (
    templateName: string,
  ): Promise<Template | null> => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://raw.githubusercontent.com/github/gitignore/main/${templateName}.gitignore`,
      );
      if (response.ok) {
        const content = await response.text();
        return { name: templateName, content };
      }
      throw new Error("Template not found");
    } catch (error) {
      console.error(`Failed to fetch ${templateName}:`, error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateAdd = async (templateName: string): Promise<void> => {
    if (selectedTemplates.find((t) => t.name === templateName)) return;

    const template = await fetchTemplate(templateName);
    if (template) {
      const updatedTemplates = [...selectedTemplates, template];
      setSelectedTemplates(updatedTemplates);
      onTemplateSelect(updatedTemplates);
    }
  };

  const removeTemplate = (templateName: string): void => {
    const updatedTemplates = selectedTemplates.filter(
      (t) => t.name !== templateName,
    );
    setSelectedTemplates(updatedTemplates);
    onTemplateSelect(updatedTemplates);
  };

  const filteredTemplates: string[] = popularTemplates.filter((template) =>
    template.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-6 mb-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <Code className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">
          GitHub Templates
        </h2>
      </div>

      <div className="relative mb-4">
        <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 right-3 top-1/2" />
        <input
          type="text"
          placeholder="Search templates (Node, Python, React...)"
          className="pr-10 input-field"
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4 sm:grid-cols-3 md:grid-cols-4">
        {filteredTemplates.map((template) => (
          <button
            key={template}
            onClick={() => handleTemplateAdd(template)}
            disabled={
              loading || selectedTemplates.find((t) => t.name === template)
            }
            className={`p-2 rounded-md border transition-colors ${
              selectedTemplates.find((t) => t.name === template)
                ? " border-green-300 text-green-700"
                : " hover:border-blue-300"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <div className="flex items-center justify-center gap-1">
              {selectedTemplates.find((t) => t.name === template) ? (
                <span className="text-sm">✓ {template}</span>
              ) : (
                <>
                  <Plus className="w-3 h-3" />
                  <span className="text-sm">{template}</span>
                </>
              )}
            </div>
          </button>
        ))}
      </div>

      {selectedTemplates.length > 0 && (
        <div>
          <h3 className="mb-2 font-medium text-gray-700">
            Selected Templates:
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedTemplates.map((template) => (
              <div
                key={template.name}
                className="flex items-center gap-1 px-3 py-1 text-blue-800 bg-blue-100 rounded-full"
              >
                <span className="text-sm">{template.name}</span>
                <button
                  onClick={() => removeTemplate(template.name)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="py-4 text-center">
          <div className="inline-block w-6 h-6 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <p className="mt-2 text-sm text-gray-600">Fetching template...</p>
        </div>
      )}
    </div>
  );
};
