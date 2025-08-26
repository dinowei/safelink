import React, { useState } from 'react';
import { HistoryItem, RiskLevel } from '../types';
import { AnalysisResult } from '../types';

interface HistoryTabProps {
    history: HistoryItem[];
    onClearHistory: () => void;
}

const riskConfig = {
    [RiskLevel.LOW]: {
        borderColor: 'border-green-500',
        textColor: 'text-green-400',
        bgColor: 'bg-green-500/10',
    },
    [RiskLevel.MEDIUM]: {
        borderColor: 'border-yellow-500',
        textColor: 'text-yellow-400',
        bgColor: 'bg-yellow-500/10',
    },
    [RiskLevel.HIGH]: {
        borderColor: 'border-red-500',
        textColor: 'text-red-400',
        bgColor: 'bg-red-500/10',
    }
};

const HistoryTab: React.FC<HistoryTabProps> = ({ history, onClearHistory }) => {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    if (history.length === 0) {
        return (
            <div className="bg-[rgba(255,255,255,0.05)] p-6 sm:p-8 rounded-lg shadow-lg text-center">
                <i className="fa-solid fa-clock-rotate-left text-4xl text-gray-500"></i>
                <h2 className="mt-4 text-2xl font-bold text-white">Nenhum histórico de análise</h2>
                <p className="mt-2 text-gray-400">Os resultados das suas verificações aparecerão aqui.</p>
            </div>
        );
    }
    
    return (
        <div className="bg-[rgba(255,255,255,0.05)] p-6 sm:p-8 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                <h2 className="text-2xl font-bold text-white">Histórico de Análises</h2>
                <button
                    onClick={onClearHistory}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-red-500"
                    aria-label="Limpar histórico de análises"
                >
                    <i className="fa-solid fa-trash-can -ml-1 mr-2 h-5 w-5" aria-hidden="true"></i>
                    Limpar Histórico
                </button>
            </div>

            <div className="space-y-4">
                {history.map((item) => {
                    const config = riskConfig[item.result.riskLevel];
                    const isExpanded = expandedId === item.id;
                    return (
                        <div key={item.id} className={`border-l-4 ${config.borderColor} ${config.bgColor} rounded-r-md transition-all`}>
                            <button 
                                className="w-full p-4 text-left" 
                                onClick={() => toggleExpand(item.id)}
                                aria-expanded={isExpanded}
                                aria-controls={`history-details-${item.id}`}
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center min-w-0">
                                        <span className={`font-bold text-lg ${config.textColor} flex-shrink-0`}>{item.type}:</span>
                                        <span className="ml-3 text-gray-300 truncate" title={item.input}>{item.input}</span>
                                    </div>
                                    <div className="flex items-center flex-shrink-0 ml-4">
                                        <span className={`text-sm font-semibold ${config.textColor}`}>{item.result.riskLevel}</span>
                                        <i className={`fa-solid ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'} ml-4 text-gray-400 transition-transform`} aria-hidden="true"></i>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {new Date(item.timestamp).toLocaleString()}
                                </div>
                            </button>
                            {isExpanded && (
                                <div className="p-4 border-t border-white/10" id={`history-details-${item.id}`}>
                                     <p className={`font-semibold ${config.textColor}`}>{item.result.summary}</p>
                                     <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-gray-400">
                                         {item.result.details.map((detail, index) => (
                                             <li key={index}>{detail}</li>
                                         ))}
                                     </ul>
                                     <p className="mt-3 text-sm text-gray-400"><span className="font-semibold">Recomendação:</span> {item.result.recommendation}</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HistoryTab;