import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Tabs from './components/Tabs';
import UrlCheckTab from './components/UrlCheckTab';
import FileCheckTab from './components/FileCheckTab';
import TextCheckTab from './components/TextCheckTab';
import HistoryTab from './components/HistoryTab';
import StatsPanel from './components/StatsPanel';
import { ActiveTab, HistoryItem, AnalysisResult } from './types';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.URL);
    const [history, setHistory] = useState<HistoryItem[]>([]);

    useEffect(() => {
        try {
            const storedHistory = localStorage.getItem('safeweb_history');
            if (storedHistory) {
                setHistory(JSON.parse(storedHistory));
            }
        } catch (error) {
            console.error("Failed to load history from localStorage:", error);
            setHistory([]);
        }
    }, []);

    const updateHistory = (newHistory: HistoryItem[]) => {
        const sortedHistory = newHistory.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setHistory(sortedHistory);
        try {
            localStorage.setItem('safeweb_history', JSON.stringify(sortedHistory));
        } catch (error) {
            console.error("Failed to save history to localStorage:", error);
        }
    };

    const addToHistory = useCallback((type: 'URL' | 'File' | 'Text', input: string, result: AnalysisResult) => {
        const newItem: HistoryItem = {
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            type,
            input,
            result
        };
        setHistory(prevHistory => {
            const newHistory = [newItem, ...prevHistory];
            try {
                localStorage.setItem('safeweb_history', JSON.stringify(newHistory));
            } catch (error) {
                console.error("Failed to save history to localStorage:", error);
            }
            return newHistory;
        });
    }, []);

    const clearHistory = useCallback(() => {
        updateHistory([]);
    }, []);

    const handleTabChange = useCallback((tab: ActiveTab) => {
        setActiveTab(tab);
    }, []);

    const renderTabContent = () => {
        switch (activeTab) {
            case ActiveTab.URL:
                return <UrlCheckTab onAnalysisComplete={addToHistory} />;
            case ActiveTab.FILE:
                return <FileCheckTab onAnalysisComplete={addToHistory} />;
            case ActiveTab.TEXT:
                return <TextCheckTab onAnalysisComplete={addToHistory} />;
            case ActiveTab.HISTORY:
                return <HistoryTab history={history} onClearHistory={clearHistory} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                    <StatsPanel history={history} />
                </div>
                <div className="lg:col-span-3">
                    <Tabs activeTab={activeTab} onTabChange={handleTabChange} />
                    <div className="mt-6">
                        {renderTabContent()}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default App;