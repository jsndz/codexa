import { useEffect, useRef, useState } from "react";
import {
  Code2,
  ChevronDown,
  ChevronRight,
  X,
  Rocket,
  Sparkles,
} from "lucide-react";
import axios from "axios";

interface FileChange {
  functionName: string;
  original: string;
  newCode: string;
  explantion: string;
  filePath: string;
  startLine: number;
  endLine: number;
}
type GroupedFiles = Record<string, FileChange[]>;
const getKey = (filePath: string, functionName: string) =>
  `${filePath}:${functionName}`;

function App() {
  const params = new URLSearchParams(window.location.search);
  const repo = params.get("repo");
  const sha = params.get("sha");
  const iid = params.get("iid");
  const owner = params.get("owner");
  const [files, setFiles] = useState<FileChange[]>();
  const [editedContent, setEditedContent] = useState<Record<string, string>>(
    {}
  );
  const groupedFiles: GroupedFiles = {};
  files?.forEach((fc) => {
    if (!groupedFiles[fc.filePath]) groupedFiles[fc.filePath] = [];
    groupedFiles[fc.filePath].push(fc);
  });
  const [isLoading, setIsLoading] = useState(true);

  const [collapsedFiles, setCollapsedFiles] = useState<Set<string>>(new Set());

  const removeFile = (filePath: string) => {
    const filteredFiles = files?.filter((file) => file.filePath !== filePath);
    setFiles(filteredFiles);

    const newEditedContent: Record<string, string> = {};
    for (const key in editedContent) {
      if (!key.startsWith(filePath + ":")) {
        newEditedContent[key] = editedContent[key];
      }
    }
    setEditedContent(newEditedContent);
  };

  const toggleFileCollapse = (filePath: string) => {
    const newCollapsed = new Set(collapsedFiles);
    if (newCollapsed.has(filePath)) {
      newCollapsed.delete(filePath);
    } else {
      newCollapsed.add(filePath);
    }
    setCollapsedFiles(newCollapsed);
  };

  const handleCodeEdit = (
    filePath: string,
    functionName: string,
    newContent: string
  ) => {
    setEditedContent({
      ...editedContent,
      [getKey(filePath, functionName)]: newContent,
    });
  };

  const createPullRequest = async () => {
    const finalChanges: Record<
      string,
      { startLine: number; endLine: number; newCode: string }[]
    > = {};

    files?.forEach((f) => {
      const key = getKey(f.filePath, f.functionName);
      const content = editedContent[key] || f.newCode;

      if (!finalChanges[f.filePath]) {
        finalChanges[f.filePath] = [];
      }

      finalChanges[f.filePath].push({
        startLine: f.startLine,
        endLine: f.endLine,
        newCode: content,
      });
    });

    const payload = {
      repo,
      owner,
      sha,
      iid,
      changes: finalChanges,
    };

    try {
      console.log(payload);
    } catch (err) {
      console.error("❌ Failed to create PR", err);
      alert("Failed to create PR. See console.");
    }
  };

  const generateDiffLines = (original: string, newCode: string) => {
    const originalLines = original.split("\n");
    const newCodeLines = newCode.split("\n");
    const diffLines: Array<{
      type: "unchanged" | "added" | "removed";
      content: string;
      lineNumber?: number;
      originalLineNumber?: number;
    }> = [];

    let originalIndex = 0;
    let newCodeIndex = 0;

    while (
      originalIndex < originalLines.length ||
      newCodeIndex < newCodeLines.length
    ) {
      const originalLine = originalLines[originalIndex];
      const newCodeLine = newCodeLines[newCodeIndex];

      if (originalLine === newCodeLine) {
        diffLines.push({
          type: "unchanged",
          content: originalLine || "",
          lineNumber: newCodeIndex + 1,
          originalLineNumber: originalIndex + 1,
        });
        originalIndex++;
        newCodeIndex++;
      } else {
        if (
          originalIndex < originalLines.length &&
          !newCodeLines.slice(newCodeIndex).includes(originalLine)
        ) {
          diffLines.push({
            type: "removed",
            content: originalLine,
            originalLineNumber: originalIndex + 1,
          });
          originalIndex++;
        } else if (newCodeIndex < newCodeLines.length) {
          diffLines.push({
            type: "added",
            content: newCodeLine,
            lineNumber: newCodeIndex + 1,
          });
          newCodeIndex++;
        } else {
          originalIndex++;
          newCodeIndex++;
        }
      }
    }

    return diffLines;
  };
  const hasRun = useRef(false);
  const init = async () => {
    try {
      const data = { repo, sha, iid, owner };
      const res = await axios.post("http://localhost:3001/", data);
      setFiles(res.data.data);
    } catch (err) {
      console.error("Failed to fetch:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    init();
  }, []);
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-teal-400 border-opacity-50 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-300">
            Analyzing code with AI...
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This might take a few seconds.
          </p>
        </div>
      </div>
    );
  }

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
            {files?.length} file{files?.length !== 1 ? "s" : ""} to review
          </div>
        </div>
        <div>
          <h1>Code Report</h1>
          <p>
            <strong>Repo:</strong> {repo}
          </p>
          <p>
            <strong>SHA:</strong> {sha}
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {Object.entries(groupedFiles).map(([filePath, functions]) => {
            const isCollapsed = collapsedFiles.has(filePath);

            return (
              <div
                key={filePath}
                className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
              >
                {/* File Header */}
                <div className="bg-gray-750 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
                  <button
                    onClick={() => toggleFileCollapse(filePath)}
                    className="flex items-center space-x-2 text-left hover:text-teal-400 transition-colors"
                  >
                    {isCollapsed ? (
                      <ChevronRight className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                    <span className="font-semibold text-gray-100">
                      {filePath}
                    </span>
                  </button>
                  <button
                    onClick={() => removeFile(filePath)}
                    className="p-1 hover:bg-red-500/20 rounded text-red-400 hover:text-red-300 transition-colors"
                    title="Remove file from changes"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {!isCollapsed && (
                  <div className="divide-y divide-gray-700">
                    {functions.map((func) => {
                      const key = getKey(func.filePath, func.functionName);
                      const currentContent = editedContent[key] || func.newCode;
                      const diffLines = generateDiffLines(
                        func.original,
                        func.newCode
                      );

                      return (
                        <div key={key}>
                          {/* Function Name & Lines */}
                          <div className="px-4 py-2 text-sm text-gray-400 bg-gray-850 border-b border-gray-700">
                            <span className="font-semibold text-teal-400">
                              {func.functionName}
                            </span>{" "}
                            (Lines {func.startLine}–{func.endLine}) —{" "}
                            <em className="text-xs">{func.explantion}</em>
                          </div>

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
                                      ? func.startLine +
                                        (line.originalLineNumber ?? 1) -
                                        1
                                      : line.lineNumber
                                      ? func.startLine + line.lineNumber - 1
                                      : ""}
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

                          {/* Editable Section */}
                          <div>
                            <div className="text-xs text-gray-400 px-4 py-2 bg-gray-800 border-b border-gray-700">
                              Edit Suggested Code
                            </div>
                            <div className="relative">
                              <textarea
                                value={currentContent}
                                onChange={(e) =>
                                  handleCodeEdit(
                                    func.filePath,
                                    func.functionName,
                                    e.target.value
                                  )
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
                                    {func.startLine + index}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {files?.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Code2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No files to review</p>
            </div>
          )}

          {(files?.length ?? 0) > 0 && (
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
