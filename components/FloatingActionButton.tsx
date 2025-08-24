
import React from 'react';
import { ArrowUpTrayIcon } from './icons';

interface FloatingActionButtonProps {
    onClick: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            title="Upload IPA"
            aria-label="Upload IPA"
            className="fixed bottom-6 right-6 bg-brand-accent hover:bg-sky-500 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-all duration-300 z-40"
        >
            <ArrowUpTrayIcon className="h-7 w-7" />
        </button>
    );
};

export default FloatingActionButton;
