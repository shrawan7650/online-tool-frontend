import React, { useState, useEffect } from "react";
import { Download, Copy, Plus, X, Search, Code, FileText } from "lucide-react";
import { GitIgnoreTemplateFetcher } from "../components/GitIgnoreTemplateFetcher";
import CustomGitIgnoreGenerator from "../components/CustomGitIgnoreGenerator";
const GitIgnore = () => {
  const [selectedTemplates, setSelectedTemplates] = useState([]);

  return (
    <div className="min-h-screen p-4 ">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            Advanced .gitignore Generator
          </h1>
          <p className="text-gray-600">
            Fetch official templates from GitHub and create custom .gitignore
            files
          </p>
        </div>

        <GitIgnoreTemplateFetcher onTemplateSelect={setSelectedTemplates} />
        <CustomGitIgnoreGenerator templates={selectedTemplates} />

        <div className="mt-8 text-sm text-center text-gray-500">
          <p>
            Templates sourced from{" "}
            <a
              href="https://github.com/github/gitignore"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              github/gitignore
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default GitIgnore;
