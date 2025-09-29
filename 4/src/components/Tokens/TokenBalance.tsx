'use client';

import React, { useEffect } from 'react';
import { useTokenBalances } from '../../hooks/useTokenBalance';
import { useWalletConnection } from '../../hooks/useWalletConnection';
import { ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { TOKEN_INFO } from '../../lib/constants';

interface TokenBalanceProps {
    className?: string;
}

const TokenBalance: React.FC<TokenBalanceProps> = ({ className = '' }) => {
    const { isConnected, mounted } = useWalletConnection();
    const { tokenA, tokenB, refreshAllBalances } = useTokenBalances();

    // Refresh balances when component mounts and wallet connects
    useEffect(() => {
        if (mounted && isConnected) {
            refreshAllBalances();
        }
    }, [mounted, isConnected, refreshAllBalances]);

    if (!mounted) {
        return (
            <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!isConnected) {
        return (
            <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Token Balances
                </h3>
                <div className="text-center py-8">
                    <div className="text-gray-500 mb-4">
                        <ExclamationTriangleIcon className="w-12 h-12 mx-auto mb-2" />
                        <p>Please connect your wallet to view balances</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    Token Balances
                </h3>
                <button
                    onClick={refreshAllBalances}
                    disabled={tokenA.isLoading || tokenB.isLoading}
                    className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Refresh balances"
                >
                    <ArrowPathIcon
                        className={`w-5 h-5 ${tokenA.isLoading || tokenB.isLoading ? 'animate-spin' : ''}`}
                    />
                </button>
            </div>

            <div className="space-y-4">
                {/* Token A Balance */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-sm">
                                {TOKEN_INFO.TOKEN_A.symbol.charAt(0)}
                            </span>
                        </div>
                        <div>
                            <div className="font-medium text-gray-900">
                                {TOKEN_INFO.TOKEN_A.name}
                            </div>
                            <div className="text-sm text-gray-500">
                                {TOKEN_INFO.TOKEN_A.symbol}
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        {tokenA.isLoading ? (
                            <div className="animate-pulse">
                                <div className="h-4 w-20 bg-gray-200 rounded"></div>
                            </div>
                        ) : tokenA.error ? (
                            <div className="text-red-600 text-sm">
                                <ExclamationTriangleIcon className="w-4 h-4 inline mr-1" />
                                Error
                            </div>
                        ) : (
                            <div className="font-mono text-lg font-semibold text-gray-900">
                                {tokenA.balance}
                            </div>
                        )}
                    </div>
                </div>

                {/* Token B Balance */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 font-bold text-sm">
                                {TOKEN_INFO.TOKEN_B.symbol.charAt(0)}
                            </span>
                        </div>
                        <div>
                            <div className="font-medium text-gray-900">
                                {TOKEN_INFO.TOKEN_B.name}
                            </div>
                            <div className="text-sm text-gray-500">
                                {TOKEN_INFO.TOKEN_B.symbol}
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        {tokenB.isLoading ? (
                            <div className="animate-pulse">
                                <div className="h-4 w-20 bg-gray-200 rounded"></div>
                            </div>
                        ) : tokenB.error ? (
                            <div className="text-red-600 text-sm">
                                <ExclamationTriangleIcon className="w-4 h-4 inline mr-1" />
                                Error
                            </div>
                        ) : (
                            <div className="font-mono text-lg font-semibold text-gray-900">
                                {tokenB.balance}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Info Section */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-800">
                    <strong>Note:</strong> Balances are automatically refreshed every 30 seconds.
                    Click the refresh button to update immediately.
                </p>
            </div>
        </div>
    );
};

export default TokenBalance;
