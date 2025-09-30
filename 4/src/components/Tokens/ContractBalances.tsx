'use client';

import React, { useState, useEffect } from 'react';
import { useContractBalances } from '../../hooks/useContractBalances';
import {
    BuildingLibraryIcon,
    ArrowPathIcon,
    ExclamationTriangleIcon,
    ChartBarIcon,
    CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { TOKEN_INFO } from '../../lib/constants';
import LoadingSkeleton from '../LoadingSkeleton';

interface ContractBalancesProps {
    className?: string;
}

const ContractBalances: React.FC<ContractBalancesProps> = ({ className = '' }) => {
    const [mounted, setMounted] = useState(false);
    const {
        tokenABalance,
        tokenBBalance,
        totalLiquidity,
        isLoading,
        error,
        refetch
    } = useContractBalances();

    useEffect(() => {
        setMounted(true);
    }, []);

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
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <BuildingLibraryIcon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">AMM Contract Balances</h3>
                </div>
                <button
                    onClick={refetch}
                    disabled={isLoading}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {isLoading ? (
                        <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" />
                    ) : (
                        <ArrowPathIcon className="-ml-1 mr-2 h-4 w-4 text-gray-500" />
                    )}
                    Refresh
                </button>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                    <span className="text-sm text-red-800">{error}</span>
                </div>
            )}

            <div className="space-y-4">
                {/* Token A Balance */}
                <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <CurrencyDollarIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-700">
                                {TOKEN_INFO.TOKEN_A.name} ({TOKEN_INFO.TOKEN_A.symbol})
                            </div>
                            <div className="text-xs text-gray-500">Contract Reserve</div>
                        </div>
                    </div>
                    <div className="text-right">
                        {isLoading ? (
                            <LoadingSkeleton className="w-24 h-6" />
                        ) : (
                            <div className="text-lg font-semibold text-gray-900">
                                {tokenABalance}
                            </div>
                        )}
                    </div>
                </div>

                {/* Token B Balance */}
                <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <CurrencyDollarIcon className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-700">
                                {TOKEN_INFO.TOKEN_B.name} ({TOKEN_INFO.TOKEN_B.symbol})
                            </div>
                            <div className="text-xs text-gray-500">Contract Reserve</div>
                        </div>
                    </div>
                    <div className="text-right">
                        {isLoading ? (
                            <LoadingSkeleton className="w-24 h-6" />
                        ) : (
                            <div className="text-lg font-semibold text-gray-900">
                                {tokenBBalance}
                            </div>
                        )}
                    </div>
                </div>

                {/* Total Liquidity */}
                <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <ChartBarIcon className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-700">Total Liquidity</div>
                            <div className="text-xs text-gray-500">Combined AMM Reserves</div>
                        </div>
                    </div>
                    <div className="text-right">
                        {isLoading ? (
                            <LoadingSkeleton className="w-24 h-6" />
                        ) : (
                            <div className="text-lg font-semibold text-purple-900">
                                {totalLiquidity}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Info Section */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">About AMM Balances:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Contract balances show tokens available for trading</li>
                    <li>• Higher balances provide better liquidity and lower slippage</li>
                    <li>• Total liquidity represents the combined value in the AMM</li>
                    <li>• Balances update automatically every 30 seconds</li>
                </ul>
            </div>
        </div>
    );
};

export default ContractBalances;
