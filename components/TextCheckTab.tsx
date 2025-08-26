import React, { useState, useCallback } from 'react';
import Spinner from './Spinner';
import ResultDisplay from './ResultDisplay';
import { AnalysisResult } from '../types';
import { analyzeTextContent } from '../services/geminiService';

interface TextCheckTabProps {
    onAnalysisComplete: (type: 'Text', input: string, result: AnalysisResult) => void;
}

const TextCheckTab: React.FC<TextCheckTabProps> = ({ onAnalysisComplete }) => {
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = useCallback(async () => {
        if (!text.trim()) {
            setError('Por favor, cole algum texto para verificar.');
            return;
        }

        setIsLoading(true);
        setResult(null);
        setError(null);

        try {
            const analysisResult = await analyzeTextContent(text);
            setResult(analysisResult);
            const truncatedText = text.length > 100 ? `${text.substring(0, 100)}...` : text;
            onAnalysisComplete('Text', truncatedText, analysisResult);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    }, [text, onAnalysisComplete]);

    const clearInput = () => {
        setText('');
        setError(null);
        setResult(null);
    }

    return (
        <div className="bg-[rgba(255,255,255,0.05)] p-6 sm:p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-white">Verificar por texto</h2>
            <p className="mt-2 text-gray-400">Cole abaixo o texto suspeito (ex: email, mensagem) ou informações sobre o site:</p>
            <div className="mt-6">
                <label htmlFor="text-input" className="block text-sm font-medium text-gray-300 sr-only">Texto para análise:</label>
                 <div className="relative">
                    <textarea
                        id="text-input"
                        rows={8}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Cole aqui o texto suspeito..."
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base text-white resize-vertical"
                        disabled={isLoading}
                    />
                     {text && !isLoading && (
                        <button onClick={clearInput} className="absolute top-3 right-3 flex items-center pr-3 text-gray-400 hover:text-white">
                            <i className="fa-solid fa-times-circle"></i>
                        </button>
                    )}
                </div>
            </div>
            <div className="mt-6">
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !text.trim()}
                    className="w-full inline-flex justify-center items-center px-8 py-3 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                >
                    <i className="fa-solid fa-search -ml-1 mr-2"></i>
                    Verificar Texto
                </button>
            </div>
            {error && <p className="mt-3 text-red-400">{error}</p>}
            {isLoading && <Spinner message="Analisando texto..." />}
            {result && <ResultDisplay result={result} />}
        </div>
    );
};

export default TextCheckTab;