export type Role = 'ADMIN' | 'DEVELOPER' | 'AUDITOR' | 'VIEWER';

export interface Chapter {
  id: string;
  prompt: string;
  result: string;
  actor: string;
  source: string;
  model: string | null;
  temperature: number | null;
  seed: number | null;
  validationStatus: 'PASSED' | 'FAILED' | 'THREAT_DETECTED' | 'SKIPPED' | null;
  validationMessage: string | null;
  metadataJson?: string;
  timestamp: string;
}

export interface Book {
  id: string;
  title: string;
  chapterIdsJson: string;
  version: number;
  feature: string;
  parentBookId: string | null;
  metadataJson?: string;
  createdAt: string;
}

export interface Shelf {
  id: number;
  feature: string;
  bookCount: number;
  latestVersion: number;
  updatedAt: string;
}

export interface StepComparison {
  stepNumber: number;
  chapterA: Chapter;
  chapterB: Chapter;
  areIdentical: boolean;
  promptDiff: string[];
  resultDiff: string[];
}

export interface DiffResult {
  bookA: Book;
  bookB: Book;
  kept: string[];
  added: string[];
  removed: string[];
  stepComparisons: StepComparison[];
}

export interface ValidationResult {
  passed: boolean;
  status: 'PASSED' | 'FAILED' | 'THREAT_DETECTED' | 'SKIPPED';
  message: string;
  layerResults: string[];
  detectedThreats: string[];
  piiEntitiesFound: string[];
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
  active: boolean;
  createdAt: string;
}

export interface ApiKey {
  id: number;
  name: string;
  keyPrefix: string;
  role: Role;
  active: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: number;
  actor: string;
  action: String;
  resource: string;
  status: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface GlobalStats {
  totalBooks: number;
  totalChapters: number;
  totalFeatures: number;
  passRate: number;
}
