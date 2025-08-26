import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-transparent text-white text-center py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center items-center gap-4">
                    <i className="fa-solid fa-shield-alt text-4xl sm:text-5xl text-blue-400"></i>
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent">
                        FraudShield
                    </h1>
                </div>
                <p className="mt-2 text-lg sm:text-xl text-gray-300/80">
                    Proteja-se contra golpes online verificando URLs, arquivos e textos suspeitos
                </p>
            </div>
        </header>
    );
};

export default Header;