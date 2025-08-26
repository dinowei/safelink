import React from 'react';
import { ActiveTab } from '../types';

interface TabsProps {
    activeTab: ActiveTab;
    onTabChange: (tab: ActiveTab) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: ActiveTab.URL, label: 'Verificar por URL', icon: 'fa-solid fa-link' },
        { id: ActiveTab.FILE, label: 'Verificar por Arquivo', icon: 'fa-solid fa-file-arrow-up' },
        { id: ActiveTab.TEXT, label: 'Verificar por Texto', icon: 'fa-solid fa-file-lines' },
        { id: ActiveTab.HISTORY, label: 'Histórico', icon: 'fa-solid fa-clock-rotate-left' }
    ];

    return (
        <div className="pb-4 border-b border-white/10">
            <nav className="flex flex-wrap gap-4" aria-label="Tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`
                            ${activeTab === tab.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-[rgba(0,0,0,0.2)] text-gray-300 hover:bg-[rgba(0,0,0,0.4)]'
                            }
                            group inline-flex items-center justify-center py-3 px-6 font-medium text-base transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md
                        `}
                        aria-current={activeTab === tab.id ? 'page' : undefined}
                    >
                         <i className={`${tab.icon} mr-2 h-5 w-5`}></i>
                        <span>{tab.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default Tabs;