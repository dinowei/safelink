import React, { useState, useCallback } from 'react';
import Spinner from './Spinner';
import ResultDisplay from './ResultDisplay';
import { AnalysisResult } from '../types';
import { analyzeUrl } from '../services/geminiService';

interface UrlCheckTabProps {
    onAnalysisComplete: (type: 'URL', input: string, result: AnalysisResult) => void;
}

const UrlCheckTab: React.FC<UrlCheckTabProps> = ({ onAnalysisComplete }) => {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = useCallback(async () => {
        if (!url.trim()) {
            setError('Por favor, digite uma URL para verificar.');
            return;
        }
        
        let validUrl = url;
        if (!validUrl.startsWith('http://') && !validUrl.startsWith('https://')) {
            validUrl = `https://${validUrl}`;
        }

        try {
            new URL(validUrl);
        } catch (_) {
            setError('Por favor, insira uma URL válida (ex: exemplo.com).');
            return;
        }

        setIsLoading(true);
        setResult(null);
        setError(null);

        try {
            const analysisResult = await analyzeUrl(url);
            setResult(analysisResult);
            onAnalysisComplete('URL', url, analysisResult);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    }, [url, onAnalysisComplete]);

    const clearInput = () => {
        setUrl('');
        setError(null);
        setResult(null);
    }

    return (
        <div className="bg-[rgba(255,255,255,0.05)] p-6 sm:p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-white">Verificar site por URL</h2>
            <p className="mt-2 text-gray-400">Digite o endereço do site que deseja verificar:</p>
            <div className="mt-6">
                <label htmlFor="url-input" className="block text-sm font-medium text-gray-300 sr-only">URL do site:</label>
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-grow">
                         <input
                            type="text"
                            id="url-input"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSubmit()}
                            placeholder="exemplo.com"
                            className="w-full pl-4 pr-10 py-3 bg-white/5 border border-white/10 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg text-white"
                            disabled={isLoading}
                        />
                        {url && !isLoading && (
                            <button onClick={clearInput} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white">
                                <i className="fa-solid fa-times-circle"></i>
                            </button>
                        )}
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="inline-flex justify-center items-center px-8 py-3 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                    >
                        <i className="fa-solid fa-search -ml-1 mr-2"></i>
                        Verificar
                    </button>
                </div>
            </div>
            {error && <p className="mt-3 text-red-400">{error}</p>}
            {isLoading && <Spinner message="Analisando URL..." />}
            {result && <ResultDisplay result={result} />}
        </div>
    );
};

export default UrlCheckTab;