import React, { useState } from "react";
import {
  Code2,
  ChevronDown,
  ChevronRight,
  X,
  Rocket,
  Sparkles,
} from "lucide-react";

interface FileChange {
  filename: string;
  original: string;
  suggested: string;
}

const mockFiles: FileChange[] = [
  {
    filename: "utils/math.js",
    original: `export function add(a, b) {\n  return a + b;\n}`,
    suggested: `export function add(a, b) {\n  console.log("Adding");\n  return a + b;\n}`,
  },
  {
    filename: "index.js",
    original: `import { add } from './utils/math';\nconsole.log(add(2, 3));`,
    suggested: `import { add } from './utils/math';\nconsole.log("Result:", add(2, 3));`,
  },
];

function App() {
  const [files, setFiles] = useState<FileChange[]>(mockFiles);
  const [editedContent, setEditedContent] = useState<Record<string, string>>(
    {}
  );
  const [collapsedFiles, setCollapsedFiles] = useState<Set<string>>(new Set());

  const removeFile = (filename: string) => {
    setFiles(files.filter((file) => file.filename !== filename));
    const newEditedContent = { ...editedContent };
    delete newEditedContent[filename];
    setEditedContent(newEditedContent);
  };

  const toggleFileCollapse = (filename: string) => {
    const newCollapsed = new Set(collapsedFiles);
    if (newCollapsed.has(filename)) {
      newCollapsed.delete(filename);
    } else {
      newCollapsed.add(filename);
    }
    setCollapsedFiles(newCollapsed);
  };

  const handleCodeEdit = (filename: string, newContent: string) => {
    setEditedContent({
      ...editedContent,
      [filename]: newContent,
    });
  };

  const createPullRequest = () => {
    const finalContent: Record<string, string> = {};
    files.forEach((file) => {
      finalContent[file.filename] =
        editedContent[file.filename] || file.suggested;
    });

    console.log("Creating PR with content:", finalContent);
    alert("PR content logged to console! 🚀");
  };

  const generateDiffLines = (original: string, suggested: string) => {
    const originalLines = original.split("\n");
    const suggestedLines = suggested.split("\n");
    const diffLines: Array<{
      type: "unchanged" | "added" | "removed";
      content: string;
      lineNumber?: number;
      originalLineNumber?: number;
    }> = [];

    let originalIndex = 0;
    let suggestedIndex = 0;

    while (
      originalIndex < originalLines.length ||
      suggestedIndex < suggestedLines.length
    ) {
      const originalLine = originalLines[originalIndex];
      const suggestedLine = suggestedLines[suggestedIndex];

      if (originalLine === suggestedLine) {
        diffLines.push({
          type: "unchanged",
          content: originalLine || "",
          lineNumber: suggestedIndex + 1,
          originalLineNumber: originalIndex + 1,
        });
        originalIndex++;
        suggestedIndex++;
      } else {
        // Handle removed lines
        if (
          originalIndex < originalLines.length &&
          !suggestedLines.slice(suggestedIndex).includes(originalLine)
        ) {
          diffLines.push({
            type: "removed",
            content: originalLine,
            originalLineNumber: originalIndex + 1,
          });
          originalIndex++;
        }
        // Handle added lines
        else if (suggestedIndex < suggestedLines.length) {
          diffLines.push({
            type: "added",
            content: suggestedLine,
            lineNumber: suggestedIndex + 1,
          });
          suggestedIndex++;
        } else {
          originalIndex++;
          suggestedIndex++;
        }
      }
    }

    return diffLines;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-mono">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Code2 className="w-8 h-8 text-teal-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Codexa
              </h1>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-400">
              <Sparkles className="w-4 h-4" />
              <span>AI Code Review Assistant</span>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            {files.length} file{files.length !== 1 ? "s" : ""} to review
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {files.map((file) => {
            const isCollapsed = collapsedFiles.has(file.filename);
            const currentContent =
              editedContent[file.filename] || file.suggested;
            const diffLines = generateDiffLines(file.original, file.suggested);

            return (
              <div
                key={file.filename}
                className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
              >
                {/* File Header */}
                <div className="bg-gray-750 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
                  <button
                    onClick={() => toggleFileCollapse(file.filename)}
                    className="flex items-center space-x-2 text-left hover:text-teal-400 transition-colors"
                  >
                    {isCollapsed ? (
                      <ChevronRight className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                    <span className="font-semibold text-gray-100">
                      {file.filename}
                    </span>
                  </button>
                  <button
                    onClick={() => removeFile(file.filename)}
                    className="p-1 hover:bg-red-500/20 rounded text-red-400 hover:text-red-300 transition-colors"
                    title="Remove file from changes"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {!isCollapsed && (
                  <div className="divide-y divide-gray-700">
                    {/* Diff View */}
                    <div className="bg-gray-850">
                      <div className="text-xs text-gray-400 px-4 py-2 bg-gray-800 border-b border-gray-700">
                        Diff Preview
                      </div>
                      <div className="max-h-60 overflow-auto">
                        {diffLines.map((line, index) => (
                          <div
                            key={index}
                            className={`flex ${
                              line.type === "added"
                                ? "bg-teal-500/10 border-l-2 border-teal-500"
                                : line.type === "removed"
                                ? "bg-red-400/10 border-l-2 border-red-400"
                                : "hover:bg-gray-800/50"
                            }`}
                          >
                            <div className="w-12 text-center py-1 text-xs text-gray-500 bg-gray-800 border-r border-gray-700">
                              {line.type === "removed"
                                ? line.originalLineNumber
                                : line.lineNumber || ""}
                            </div>
                            <div
                              className={`w-8 text-center py-1 text-xs font-bold ${
                                line.type === "added"
                                  ? "text-teal-400 bg-teal-500/10"
                                  : line.type === "removed"
                                  ? "text-red-400 bg-red-400/10"
                                  : "bg-gray-800 text-gray-600"
                              }`}
                            >
                              {line.type === "added"
                                ? "+"
                                : line.type === "removed"
                                ? "-"
                                : ""}
                            </div>
                            <div className="flex-1 px-4 py-1 text-sm whitespace-pre">
                              {line.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Editable Code */}
                    <div>
                      <div className="text-xs text-gray-400 px-4 py-2 bg-gray-800 border-b border-gray-700">
                        Edit Suggested Code
                      </div>
                      <div className="relative">
                        <textarea
                          value={currentContent}
                          onChange={(e) =>
                            handleCodeEdit(file.filename, e.target.value)
                          }
                          className="w-full bg-gray-900 text-gray-100 p-4 pl-16 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/50 min-h-[200px]"
                          spellCheck={false}
                        />
                        {/* Line Numbers */}
                        <div className="absolute left-0 top-0 px-2 py-4 bg-gray-800 border-r border-gray-700 text-xs text-gray-500 select-none pointer-events-none">
                          {currentContent.split("\n").map((_, index) => (
                            <div
                              key={index}
                              className="leading-[1.375rem] text-right"
                            >
                              {index + 1}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {files.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Code2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No files to review</p>
            </div>
          )}

          {files.length > 0 && (
            <div className="flex justify-center pt-6">
              <button
                onClick={createPullRequest}
                className="flex items-center space-x-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Rocket className="w-5 h-5" />
                <span>Create Pull Request with These Suggestions</span>
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
