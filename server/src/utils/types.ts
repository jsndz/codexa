export type ExtractedFunction = {
  filePath: string;
  functionName: string;
  startLine: number;
  endLine: number;
  code: string;
};

export interface FileChange {
  filePath: string;
  startLine: number;
  endLine: number;
  newCode: string;
  original: string;
  functionName: string;
  explanation: string;
}
