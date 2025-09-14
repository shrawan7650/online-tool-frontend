import { useState, useCallback } from "react";

let CodeMirrorInstance: any = null;
let loader: Promise<any> | null = null;

// Helper: dynamically load theme
async function loadTheme(theme: string) {
  const themeUrl = (await import(`codemirror/theme/${theme}.css?url`)).default;
  if (!document.querySelector(`link[href="${themeUrl}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = themeUrl;
    document.head.appendChild(link);
  }
}

export function useCodeMirrorLoader() {
  const [loaded, setLoaded] = useState(false);

  const initCodeMirror = useCallback(async () => {
    if (CodeMirrorInstance) return CodeMirrorInstance;

    if (!loader) {
      loader = import("codemirror").then(async (cm) => {
        // Always load base css
        await import("codemirror/lib/codemirror.css");

        // Load some common modes dynamically
        await Promise.all([
          import("codemirror/mode/javascript/javascript.js"),
          import("codemirror/mode/python/python.js"),
          import("codemirror/mode/xml/xml.js"),
          import("codemirror/mode/css/css.js"),
        ]);

        return cm.default || cm;
      });
    }

    CodeMirrorInstance = await loader;
    setLoaded(true);
    return CodeMirrorInstance;
  }, []);

  return { initCodeMirror, loaded, loadTheme };
}
