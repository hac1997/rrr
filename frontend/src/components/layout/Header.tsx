'use client';

import { HeartHandshake, LogIn, Plus } from 'lucide-react';
import React from 'react';

// Tipagem para as props
interface HeaderProps {
    isLoggedIn: boolean;
    onNavigate: (page: string) => void;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, onNavigate, onLogout }) => {
    const handleAuthClick = () => {
        if (isLoggedIn) {
            onLogout();
        } else {
            onNavigate('login');
        }
    };

    return (
        <header className="bg-aux-2-translucid backdrop-blur-md shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 flex justify-between items-center h-16">
                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('home')}>
                    <HeartHandshake className="text-primary h-8 w-8" />
                    <h1 className="text-2xl font-bold text-primary">REVO</h1>
                </div>
                <nav className="hidden md:flex items-center space-x-6">
                    <button
                        onClick={() => onNavigate('register')}
                        className="text-gray-600 hover:text-primary transition duration-300 flex items-center"
                    >
                        <Plus className="h-4 w-4 mr-1" /> Cadastre-se
                    </button>
                    <button
                        onClick={handleAuthClick}
                        className="px-4 py-2 bg-primary-hover text-white rounded-full shadow-lg transition duration-300 flex items-center"
                    >
                        <LogIn className="h-4 w-4 mr-2" /> {isLoggedIn ? 'Sair' : 'Entrar'}
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Header;