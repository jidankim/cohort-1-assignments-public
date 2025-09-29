'use client';

import React, { useState, useEffect } from 'react';
import { useTokenMinting } from '../../hooks/useTokenMinting';
import { CheckIcon, ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { TOKEN_INFO } from '../../lib/constants';

interface TokenMintProps {
    className?: string;
}

const TokenMint: React.FC<TokenMintProps> = ({ className = '' }) => {
    const { mintTokens, isMintingA, isMintingB, mintError, clearError, isConnected, mounted } = useTokenMinting();

    const [amountA, setAmountA] = useState('');
    const [amountB, setAmountB] = useState('');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Clear success message after 5 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    // Clear error when component unmounts or user starts typing
    useEffect(() => {
        if (mintError) {
            const timer = setTimeout(() => {
                clearError();
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [mintError, clearError]);

    const handleMint = async (tokenType: 'A' | 'B') => {
        const amount = tokenType === 'A' ? amountA : amountB;

        try {
            setSuccessMessage(null);
            const result = await mintTokens(tokenType, amount);

            setSuccessMessage(`Successfully minted ${result.amount} ${TOKEN_INFO[`TOKEN_${tokenType}`].symbol}!`);

            // Clear the input field
            if (tokenType === 'A') {
                setAmountA('');
            } else {
                setAmountB('');
            }
        } catch (error) {
            // Error is handled by the hook
            console.error('Mint failed:', error);
        }
    };

    const handleMaxClick = (tokenType: 'A' | 'B') => {
        // Set max amount to 1,000,000 tokens as specified in the UI
        const maxAmount = '1000000';
        if (tokenType === 'A') {
            setAmountA(maxAmount);
        } else {
            setAmountB(maxAmount);
        }
    };

    const validateAmount = (amount: string) => {
        if (!amount) return true;
        const num = parseFloat(amount);
        return !isNaN(num) && num > 0 && num <= 1000000; // Max 1M tokens
    };

    if (!mounted) {
        return (
            <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!isConnected) {
        return (
            <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Mint Test Tokens
                </h3>
                <div className="text-center py-8">
                    <div className="text-gray-500 mb-4">
                        <ExclamationTriangleIcon className="w-12 h-12 mx-auto mb-2" />
                        <p>Please connect your wallet to mint tokens</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Mint Test Tokens
            </h3>

            {/* Success Message */}
            {successMessage && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                    <CheckIcon className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-800">{successMessage}</span>
                </div>
            )}

            {/* Error Message */}
            {mintError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                        <span className="text-sm text-red-800">{mintError}</span>
                    </div>
                    <button
                        onClick={clearError}
                        className="text-red-600 hover:text-red-800"
                    >
                        <XMarkIcon className="w-4 h-4" />
                    </button>
                </div>
            )}

            <div className="space-y-6">
                {/* Token A Minting */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">
                            {TOKEN_INFO.TOKEN_A.name} ({TOKEN_INFO.TOKEN_A.symbol})
                        </label>
                        <button
                            onClick={() => handleMaxClick('A')}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Max
                        </button>
                    </div>

                    <div className="flex space-x-2">
                        <input
                            type="number"
                            value={amountA}
                            onChange={(e) => setAmountA(e.target.value)}
                            placeholder="0.0"
                            min="0"
                            step="0.000001"
                            className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${amountA && !validateAmount(amountA)
                                ? 'border-red-300 bg-red-50'
                                : 'border-gray-300'
                                }`}
                            disabled={isMintingA}
                        />
                        <button
                            onClick={() => handleMint('A')}
                            disabled={isMintingA || !amountA || !validateAmount(amountA)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            {isMintingA ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Minting...</span>
                                </div>
                            ) : (
                                'Mint'
                            )}
                        </button>
                    </div>

                    {amountA && !validateAmount(amountA) && (
                        <p className="text-xs text-red-600">
                            Please enter a valid amount (0.000001 - 1,000,000)
                        </p>
                    )}
                </div>

                {/* Token B Minting */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">
                            {TOKEN_INFO.TOKEN_B.name} ({TOKEN_INFO.TOKEN_B.symbol})
                        </label>
                        <button
                            onClick={() => handleMaxClick('B')}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Max
                        </button>
                    </div>

                    <div className="flex space-x-2">
                        <input
                            type="number"
                            value={amountB}
                            onChange={(e) => setAmountB(e.target.value)}
                            placeholder="0.0"
                            min="0"
                            step="0.000001"
                            className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${amountB && !validateAmount(amountB)
                                ? 'border-red-300 bg-red-50'
                                : 'border-gray-300'
                                }`}
                            disabled={isMintingB}
                        />
                        <button
                            onClick={() => handleMint('B')}
                            disabled={isMintingB || !amountB || !validateAmount(amountB)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            {isMintingB ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Minting...</span>
                                </div>
                            ) : (
                                'Mint'
                            )}
                        </button>
                    </div>

                    {amountB && !validateAmount(amountB) && (
                        <p className="text-xs text-red-600">
                            Please enter a valid amount (0.000001 - 1,000,000)
                        </p>
                    )}
                </div>
            </div>

            {/* Info Section */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">How to mint tokens:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Enter the amount of tokens you want to mint</li>
                    <li>• Click "Mint" to create the tokens in your wallet</li>
                    <li>• You can mint up to 1,000,000 tokens at once</li>
                    <li>• Tokens are minted with 18 decimal places</li>
                </ul>
            </div>
        </div>
    );
};

export default TokenMint;
