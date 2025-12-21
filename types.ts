
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface StructuredContent {
  introduction: string[];
  sentences: string[];
  numbers: string[];
  symbols: string[];
}

export interface Extraction {
  id: string;
  projectId: string;
  fileName: string;
  timestamp: number;
  content: string;
  structuredContent?: StructuredContent;
  translatedContent?: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  image?: string; 
  enhancedImage?: string; 
  wordCount: number;
  language?: string;
  mode: OCRMode;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  color?: string;
}

export type OCRMode = 'standard' | 'table' | 'handwriting' | 'invoice';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface AppState {
  view: 'landing' | 'login' | 'dashboard' | 'projects' | 'history' | 'stats' | 'settings';
  currentUser: User | null;
  projects: Project[];
  extractions: Extraction[];
  activeProjectId: string;
  loading: boolean;
  theme: 'dark' | 'light';
  language: 'ar' | 'en';
  selectedItems: string[];
  ocrMode: OCRMode;
  toasts: Toast[];
}
