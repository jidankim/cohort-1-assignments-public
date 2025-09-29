'use client';

import React from 'react';
import Header from './Header';
import NetworkSwitcher from '../Wallet/NetworkSwitcher';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-6">
                    <NetworkSwitcher />
                    {children}
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
