import React from 'react';
import { AnalysisResult, RiskLevel } from '../types';

interface ResultDisplayProps {
    result: AnalysisResult;
}

const resultConfig = {
    [RiskLevel.LOW]: {
        badgeClass: 'bg-green-500/20 text-green-300',
        borderColor: 'border-green-500',
        textColor: 'text-green-400',
        icon: 'fa-solid fa-circle-check',
        title: 'Baixo Risco'
    },
    [RiskLevel.MEDIUM]: {
        badgeClass: 'bg-yellow-500/20 text-yellow-300',
        borderColor: 'border-yellow-500',
        textColor: 'text-yellow-400',
        icon: 'fa-solid fa-triangle-exclamation',
        title: 'Risco Moderado'
    },
    [RiskLevel.HIGH]: {
        badgeClass: 'bg-red-500/20 text-red-300',
        borderColor: 'border-red-500',
        textColor: 'text-red-400',
        icon: 'fa-solid fa-shield-virus',
        title: 'Alto Risco'
    }
};

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
    const config = resultConfig[result.riskLevel] || resultConfig[RiskLevel.MEDIUM];

    return (
        <div className="mt-8 p-6 bg-[rgba(0,0,0,0.2)] rounded-lg">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6 pb-4 border-b border-white/10">
                <h3 className="text-2xl font-bold text-white">Resultado da Análise</h3>
                <span className={`px-4 py-1.5 rounded-full font-semibold text-sm ${config.badgeClass}`}>
                    {config.title}
                </span>
            </div>
            
            <div className="space-y-6">
                <div>
                    <h4 className="text-lg font-semibold text-gray-300 mb-2">Resumo</h4>
                    <p className="text-gray-300">{result.summary}</p>
                </div>

                <div>
                    <h4 className="text-lg font-semibold text-gray-300 mb-2">Detalhes da Verificação</h4>
                    <ul className="space-y-2">
                        {result.details.map((detail, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <i className={`${config.icon} ${config.textColor} mt-1`}></i>
                                <span className="text-gray-300">{detail}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                     <h4 className="text-lg font-semibold text-gray-300 mb-2">Recomendações</h4>
                     <div className={`p-4 border-l-4 ${config.borderColor} bg-white/5 rounded-r-md`}>
                        <p className="text-gray-300">{result.recommendation}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultDisplay;