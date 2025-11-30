export enum AnalysisMode {
  EXPLAIN = 'Explain Code',
  IMPROVE = 'Improve Code',
  BUGS = 'Find Bugs',
}

export interface HistoryItem {
  id: string;
  userId: string;
  codeSnippet: string;
  mode: AnalysisMode;
  response: string;
  timestamp: number; // Store as milliseconds
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}
