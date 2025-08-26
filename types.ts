export enum ActiveTab {
    URL = 'url',
    FILE = 'file',
    TEXT = 'text',
    HISTORY = 'history'
}

export enum RiskLevel {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH'
}

export interface AnalysisResult {
    riskLevel: RiskLevel;
    summary: string;
    details: string[];
    recommendation: string;
}

export interface HistoryItem {
    id: string;
    timestamp: string;
    type: 'URL' | 'File' | 'Text';
    input: string;
    result: AnalysisResult;
}