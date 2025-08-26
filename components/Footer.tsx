import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-transparent text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-500 text-sm">
                <p>&copy; {new Date().getFullYear()} FraudShield - Ferramenta de verificação de fraudes online</p>
                <p className="mt-1">Este é um protótipo. Para uma análise completa, utilize serviços profissionais de segurança.</p>
            </div>
        </footer>
    );
};

export default Footer;