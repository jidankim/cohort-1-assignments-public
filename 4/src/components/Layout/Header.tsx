'use client';

import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold text-gray-900">
                            MiniAMM
                        </h1>
                        <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            Beta
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
