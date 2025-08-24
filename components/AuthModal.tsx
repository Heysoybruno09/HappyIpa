
import React, { useState } from 'react';
import type { User } from '../types';
import { CloseIcon } from './icons';

type AuthMode = 'login' | 'signup' | 'verify';

interface AuthModalProps {
    mode: 'login' | 'signup';
    onClose: () => void;
    onAuthSuccess: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ mode, onClose, onAuthSuccess }) => {
    const [authMode, setAuthMode] = useState<AuthMode>(mode);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }

        // Simulate auth logic
        if (authMode === 'signup') {
            setAuthMode('verify');
        } else { // login
            if (password.length < 6) {
                 setError('Invalid credentials.');
                 return;
            }
            onAuthSuccess({ email });
        }
    };

    const switchMode = (newMode: AuthMode) => {
        setAuthMode(newMode);
        setError('');
        setEmail('');
        setPassword('');
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-brand-secondary rounded-lg shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-brand-accent">
                        {authMode === 'login' && 'Login'}
                        {authMode === 'signup' && 'Sign Up'}
                        {authMode === 'verify' && 'Check Your Email'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <CloseIcon className="h-6 w-6" />
                    </button>
                </div>
                
                <div className="p-6">
                    {authMode === 'verify' ? (
                        <div className="text-center">
                            <p className="text-brand-text mb-4">We've sent a verification link to <strong className="text-brand-accent">{email}</strong>. Please check your inbox to continue.</p>
                            <button
                                onClick={() => switchMode('login')}
                                className="w-full bg-brand-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-500 transition-colors"
                            >
                                Back to Login
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && <p className="text-red-400 text-sm bg-red-900/30 p-2 rounded-md">{error}</p>}
                            <div>
                                <label className="block text-sm font-medium text-brand-text-secondary mb-1">Email</label>
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-brand-primary border border-gray-700 rounded-lg py-2 px-3 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-brand-text-secondary mb-1">Password</label>
                                <input 
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-brand-primary border border-gray-700 rounded-lg py-2 px-3 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-brand-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-500 transition-colors"
                            >
                                {authMode === 'login' ? 'Login' : 'Sign Up'}
                            </button>
                            <p className="text-sm text-center text-brand-text-secondary">
                                {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                                <button type="button" onClick={() => switchMode(authMode === 'login' ? 'signup' : 'login')} className="text-brand-accent hover:underline">
                                    {authMode === 'login' ? 'Sign Up' : 'Login'}
                                </button>
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
