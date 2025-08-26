import React, { useState, useCallback, useRef } from 'react';
import Spinner from './Spinner';
import ResultDisplay from './ResultDisplay';
import { AnalysisResult } from '../types';
import { analyzeImageContent, analyzeTextContent } from '../services/geminiService';

interface FileCheckTabProps {
    onAnalysisComplete: (type: 'File', input: string, result: AnalysisResult) => void;
}

const FileCheckTab: React.FC<FileCheckTabProps> = ({ onAnalysisComplete }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (selectedFile: File | null) => {
        if (selectedFile) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'text/plain', 'text/html'];
            if (!allowedTypes.includes(selectedFile.type)) {
                setError('Tipo de arquivo não suportado. Por favor, envie uma imagem (jpeg, png, webp) ou arquivo de texto (txt, html).');
                setFile(null);
                return;
            }
            setError(null);
            setResult(null);
            setFile(selectedFile);
        }
    };
    
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };
    
    const clearFile = () => {
        setFile(null);
        setError(null);
        setResult(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = useCallback(async () => {
        if (!file) {
            setError('Por favor, selecione um arquivo para verificar.');
            return;
        }

        setIsLoading(true);
        setResult(null);
        setError(null);
        const fileName = file.name;

        try {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = async () => {
                    try {
                        const base64String = (reader.result as string).split(',')[1];
                        const analysisResult = await analyzeImageContent(base64String, file.type);
                        setResult(analysisResult);
                        onAnalysisComplete('File', fileName, analysisResult);
                    } catch (err) {
                         setError((err as Error).message);
                    } finally {
                        setIsLoading(false);
                    }
                };
                reader.onerror = () => {
                    setError("Failed to read the file.");
                    setIsLoading(false);
                };
            } else {
                const text = await file.text();
                const analysisResult = await analyzeTextContent(text);
                setResult(analysisResult);
                onAnalysisComplete('File', fileName, analysisResult);
                setIsLoading(false);
            }
        } catch (err) {
            setError((err as Error).message);
            setIsLoading(false);
        }
    }, [file, onAnalysisComplete]);

    return (
        <div className="bg-[rgba(255,255,255,0.05)] p-6 sm:p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-white">Verificar por arquivo</h2>
            <p className="mt-2 text-gray-400">Faça upload de uma imagem (screenshot), arquivo HTML ou de texto para análise.</p>
            
            <div className="mt-6">
                 <div 
                    className={`relative p-6 text-center border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-white/20 hover:border-blue-400'}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/jpeg,image/png,image/webp,text/plain,text/html"
                    />
                    <i className="fa-solid fa-cloud-arrow-up text-4xl text-gray-400"></i>
                    <p className="mt-2 text-sm text-gray-300">Arraste e solte o arquivo aqui, ou <span className="font-semibold text-blue-400">clique para selecionar</span></p>
                    {file && (
                        <div className="mt-4 text-sm font-medium text-white bg-white/10 rounded-md p-3 inline-flex items-center gap-3">
                            <i className="fa-solid fa-file-check text-green-400"></i>
                            <span>Arquivo selecionado: {file.name}</span>
                            <button onClick={(e) => { e.stopPropagation(); clearFile(); }} className="text-gray-400 hover:text-white">
                                <i className="fa-solid fa-times"></i>
                            </button>
                        </div>
                     )}
                </div>
            </div>

            <div className="mt-6">
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !file}
                    className="w-full inline-flex justify-center items-center px-8 py-3 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                >
                    <i className="fa-solid fa-search -ml-1 mr-2"></i>
                    Verificar Arquivo
                </button>
            </div>
            {error && <p className="mt-3 text-red-400">{error}</p>}
            {isLoading && <Spinner message="Analisando arquivo..." />}
            {result && <ResultDisplay result={result} />}
        </div>
    );
};

export default FileCheckTab;