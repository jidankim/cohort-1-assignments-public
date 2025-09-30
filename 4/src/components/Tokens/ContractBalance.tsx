'use client';

import React, { useState, useEffect } from 'react';
import { useContractBalance } from '../../hooks/useContractBalance';
import {
    BuildingLibraryIcon,
    ArrowPathIcon,
    ExclamationTriangleIcon,
    ChartBarIcon,
    CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { TOKEN_INFO } from '../../lib/constants';
import LoadingSkeleton from '../LoadingSkeleton';

interface ContractBalanceProps {
    className?: string;
}

const ContractBalance: React.FC<ContractBalanceProps> = ({ className = '' }) => {
    const {
        formattedReserveA,
        formattedReserveB,
        formattedTotalLiquidity,
        liquidityRatio,
        loading,
        error,
        lastUpdated,
        refetchBalances
    } = useContractBalance();

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
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

    return (
        <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <BuildingLibraryIcon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">AMM Contract Balances</h3>
                        <p className="text-sm text-gray-500">MiniAMM Pool Reserves</p>
                    </div>
                </div>
                <button
                    onClick={refetchBalances}
                    disabled={loading}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    title="Refresh contract balances"
                >
                    {loading ? (
                        <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" />
                    ) : (
                        <ArrowPathIcon className="-ml-1 mr-2 h-4 w-4 text-gray-500" />
                    )}
                    Refresh
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                    <span className="text-sm text-red-800">{error}</span>
                </div>
            )}

            {/* Contract Balances */}
            <div className="space-y-4">
                {/* Token A Reserve */}
                <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-sm">A</span>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-700">{TOKEN_INFO.TOKEN_A.symbol} Reserve</div>
                            <div className="text-xs text-gray-500">{TOKEN_INFO.TOKEN_A.name}</div>
                        </div>
                    </div>
                    <div className="text-right">
                        {loading ? (
                            <LoadingSkeleton className="w-24 h-5" />
                        ) : (
                            <div className="text-lg font-semibold text-gray-900">
                                {formattedReserveA}
                            </div>
                        )}
                    </div>
                </div>

                {/* Token B Reserve */}
                <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 font-bold text-sm">B</span>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-700">{TOKEN_INFO.TOKEN_B.symbol} Reserve</div>
                            <div className="text-xs text-gray-500">{TOKEN_INFO.TOKEN_B.name}</div>
                        </div>
                    </div>
                    <div className="text-right">
                        {loading ? (
                            <LoadingSkeleton className="w-24 h-5" />
                        ) : (
                            <div className="text-lg font-semibold text-gray-900">
                                {formattedReserveB}
                            </div>
                        )}
                    </div>
                </div>

                {/* Total Liquidity */}
                <div className="flex items-center justify-between bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <CurrencyDollarIcon className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-700">Total Liquidity</div>
                            <div className="text-xs text-gray-500">Combined Pool Value</div>
                        </div>
                    </div>
                    <div className="text-right">
                        {loading ? (
                            <LoadingSkeleton className="w-24 h-5" />
                        ) : (
                            <div className="text-lg font-semibold text-purple-900">
                                {formattedTotalLiquidity}
                            </div>
                        )}
                    </div>
                </div>

                {/* Liquidity Ratio */}
                {!loading && liquidityRatio > 0 && (
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                            <ChartBarIcon className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">Pool Ratio</span>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                            1 {TOKEN_INFO.TOKEN_A.symbol} = {liquidityRatio.toFixed(4)} {TOKEN_INFO.TOKEN_B.symbol}
                        </div>
                    </div>
                )}
            </div>

            {/* Last Updated */}
            {lastUpdated && !loading && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Last updated</span>
                        <span>{formatTime(lastUpdated)}</span>
                    </div>
                </div>
            )}

            {/* Info Section */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">About AMM Reserves:</h4>
                <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Reserves represent tokens available for trading in the AMM</li>
                    <li>• Higher reserves mean better liquidity and lower slippage</li>
                    <li>• Pool ratio shows the current exchange rate between tokens</li>
                    <li>• Balances update automatically every 30 seconds</li>
                </ul>
            </div>
        </div>
    );
};

export default ContractBalance;
