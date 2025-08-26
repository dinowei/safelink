import React from 'react';

interface SpinnerProps {
    message?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ message = "Analisando..." }) => {
    return (
        <div className="text-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-t-2 border-blue-400 mx-auto"></div>
            <p className="mt-3 text-gray-300">{message}</p>
        </div>
    );
};

export default Spinner;