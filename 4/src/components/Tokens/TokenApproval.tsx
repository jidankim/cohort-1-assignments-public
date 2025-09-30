'use client';

import React, { useState, useEffect } from 'react';
import { useTokenApproval } from '../../hooks/useTokenApproval';
import { CheckIcon, ExclamationTriangleIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { TOKEN_INFO } from '../../lib/constants';

interface TokenApprovalProps {
    className?: string;
}

const TokenApproval: React.FC<TokenApprovalProps> = ({ className = '' }) => {
    const {
        approveTokens,
        approveMax,
        isApprovingA,
        isApprovingB,
        approvalError,
        clearError,
        allowanceA,
        allowanceB,
        isLoadingAllowance,
        fetchAllAllowances,
        isConnected,
        mounted
    } = useTokenApproval();

    const [amountA, setAmountA] = useState('');
    const [amountB, setAmountB] = useState('');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Fetch allowances on mount and when connected
    useEffect(() => {
        if (mounted && isConnected) {
            fetchAllAllowances();
        }
    }, [mounted, isConnected, fetchAllAllowances]);

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
        if (approvalError) {
            const timer = setTimeout(() => {
                clearError();
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [approvalError, clearError]);

    const handleApprove = async (tokenType: 'A' | 'B') => {
        const amount = tokenType === 'A' ? amountA : amountB;

        try {
            setSuccessMessage(null);
            const result = await approveTokens(tokenType, amount);

            setSuccessMessage(`Successfully approved ${result.amount} ${TOKEN_INFO[`TOKEN_${tokenType}`].symbol}!`);

            // Clear the input field
            if (tokenType === 'A') {
                setAmountA('');
            } else {
                setAmountB('');
            }
        } catch (error) {
            // Error is handled by the hook
            console.error('Approval failed:', error);
        }
    };

    const handleApproveMax = async (tokenType: 'A' | 'B') => {
        try {
            setSuccessMessage(null);
            const result = await approveMax(tokenType);

            setSuccessMessage(`Successfully approved maximum amount for ${TOKEN_INFO[`TOKEN_${tokenType}`].symbol}!`);
        } catch (error) {
            // Error is handled by the hook
            console.error('Max approval failed:', error);
        }
    };

    const validateAmount = (amount: string) => {
        if (!amount) return true;
        const num = parseFloat(amount);
        return !isNaN(num) && num > 0;
    };

    const formatAllowance = (allowance: string) => {
        const num = parseFloat(allowance);
        if (num === 0) return '0';
        if (num >= 1e18) return '∞ (Max)'; // Very large number indicates max approval
        return num.toFixed(6);
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
                    Approve Tokens
                </h3>
                <div className="text-center py-8">
                    <div className="text-gray-500 mb-4">
                        <ExclamationTriangleIcon className="w-12 h-12 mx-auto mb-2" />
                        <p>Please connect your wallet to approve tokens</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    Approve Tokens
                </h3>
                <button
                    onClick={fetchAllAllowances}
                    disabled={isLoadingAllowance}
                    className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Refresh allowances"
                >
                    <ArrowPathIcon
                        className={`w-5 h-5 ${isLoadingAllowance ? 'animate-spin' : ''}`}
                    />
                </button>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                    <CheckIcon className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-800">{successMessage}</span>
                </div>
            )}

            {/* Error Message */}
            {approvalError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                        <span className="text-sm text-red-800">{approvalError}</span>
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
                {/* Token A Approval */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                {TOKEN_INFO.TOKEN_A.name} ({TOKEN_INFO.TOKEN_A.symbol})
                            </label>
                            <div className="text-xs text-gray-500 mt-1">
                                Current allowance: {formatAllowance(allowanceA)}
                            </div>
                        </div>
                        <button
                            onClick={() => handleApproveMax('A')}
                            disabled={isApprovingA}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
                        >
                            Approve Max
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
                            disabled={isApprovingA}
                        />
                        <button
                            onClick={() => handleApprove('A')}
                            disabled={isApprovingA || !amountA || !validateAmount(amountA)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            {isApprovingA ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Approving...</span>
                                </div>
                            ) : (
                                'Approve'
                            )}
                        </button>
                    </div>

                    {amountA && !validateAmount(amountA) && (
                        <p className="text-xs text-red-600">
                            Please enter a valid amount
                        </p>
                    )}
                </div>

                {/* Token B Approval */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                {TOKEN_INFO.TOKEN_B.name} ({TOKEN_INFO.TOKEN_B.symbol})
                            </label>
                            <div className="text-xs text-gray-500 mt-1">
                                Current allowance: {formatAllowance(allowanceB)}
                            </div>
                        </div>
                        <button
                            onClick={() => handleApproveMax('B')}
                            disabled={isApprovingB}
                            className="text-xs text-green-600 hover:text-green-800 font-medium disabled:opacity-50"
                        >
                            Approve Max
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
                            className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${amountB && !validateAmount(amountB)
                                ? 'border-red-300 bg-red-50'
                                : 'border-gray-300'
                                }`}
                            disabled={isApprovingB}
                        />
                        <button
                            onClick={() => handleApprove('B')}
                            disabled={isApprovingB || !amountB || !validateAmount(amountB)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            {isApprovingB ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Approving...</span>
                                </div>
                            ) : (
                                'Approve'
                            )}
                        </button>
                    </div>

                    {amountB && !validateAmount(amountB) && (
                        <p className="text-xs text-red-600">
                            Please enter a valid amount
                        </p>
                    )}
                </div>
            </div>

            {/* Info Section */}
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <h4 className="text-sm font-medium text-yellow-900 mb-2">About Token Approval:</h4>
                <ul className="text-xs text-yellow-800 space-y-1">
                    <li>• Approve tokens to allow the AMM contract to spend them</li>
                    <li>• "Approve Max" sets unlimited allowance (recommended for trading)</li>
                    <li>• You can approve specific amounts for more control</li>
                    <li>• Allowances are automatically refreshed after approval</li>
                </ul>
            </div>
        </div>
    );
};

export default TokenApproval;
