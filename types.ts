
export interface AppInfo {
  name: string;
  version: string;
  description: string;
  category: string;
  iconUrl: string;
  isUploaded?: boolean;
}

export interface ScanDetail {
    check: string;
    result: 'Passed' | 'Failed' | 'Warning' | 'Not applicable';
    details: string;
}

export interface ScanResult {
    status: 'Clean' | 'Warning' | 'Error';
    details: ScanDetail[];
}

export interface User {
    email: string;
}

export interface VirusTotalScanDetail {
  engine: string;
  result: 'clean' | 'detected';
  threat_name: string | null;
}

export interface VirusTotalScanResult {
  status: 'Clean' | 'Infected';
  details: VirusTotalScanDetail[];
  positives: number;
  total: number;
}
