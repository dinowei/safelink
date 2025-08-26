import React from 'react';
import { HistoryItem, RiskLevel } from '../types';

interface StatsPanelProps {
    history: HistoryItem[];
}

const StatsPanel: React.FC<StatsPanelProps> = ({ history }) => {
    const totalChecks = history.length;
    const lowRiskCount = history.filter(item => item.result.riskLevel === RiskLevel.LOW).length;
    const mediumRiskCount = history.filter(item => item.result.riskLevel === RiskLevel.MEDIUM).length;
    const highRiskCount = history.filter(item => item.result.riskLevel === RiskLevel.HIGH).length;

    const stats = [
        { label: 'Verificações Totais', value: totalChecks, color: 'text-blue-400' },
        { label: 'Baixo Risco', value: lowRiskCount, color: 'text-green-400' },
        { label: 'Risco Moderado', value: mediumRiskCount, color: 'text-yellow-400' },
        { label: 'Alto Risco', value: highRiskCount, color: 'text-red-400' },
    ];

    return (
        <div className="bg-[rgba(255,255,255,0.05)] rounded-lg p-6 shadow-lg h-fit sticky top-8">
            <h3 className="text-xl font-bold text-white mb-4 pb-3 border-b border-white/10">Estatísticas</h3>
            <div className="space-y-3">
                {stats.map(stat => (
                    <div key={stat.label} className="flex justify-between items-center text-base">
                        <span className="text-gray-300">{stat.label}:</span>
                        <span className={`font-bold text-lg ${stat.color}`}>{stat.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StatsPanel;