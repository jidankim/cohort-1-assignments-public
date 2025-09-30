'use client';

import React, { useEffect, useState } from 'react';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { useTokenSelection, TokenKey } from '../../hooks/useTokenSelection';
import { TOKEN_INFO } from '../../lib/constants';

interface TokenSelectorProps {
    onChange?: (params: { tokenIn: TokenKey; tokenOut: TokenKey }) => void;
}

const TokenSelector: React.FC<TokenSelectorProps> = ({ onChange }) => {
    const { tokenIn, tokenOut, setIn, setOut, swapDirections, isValid } = useTokenSelection();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        onChange?.({ tokenIn, tokenOut });
    }, [onChange, tokenIn, tokenOut]);

    if (!mounted) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    <div className="h-10 bg-gray-200 rounded" />
                    <div className="h-10 bg-gray-200 rounded" />
                    <div className="h-10 bg-gray-200 rounded" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Tokens</h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-center">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                    <select
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={tokenIn}
                        onChange={(e) => setIn(e.target.value as TokenKey)}
                    >
                        <option value="A">{TOKEN_INFO.TOKEN_A.symbol} - {TOKEN_INFO.TOKEN_A.name}</option>
                        <option value="B" disabled={tokenOut === 'B'}>
                            {TOKEN_INFO.TOKEN_B.symbol} - {TOKEN_INFO.TOKEN_B.name}
                        </option>
                    </select>
                </div>

                <div className="flex justify-center mt-6 lg:mt-8">
                    <button
                        type="button"
                        onClick={swapDirections}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 text-sm text-gray-700"
                        title="Swap direction"
                    >
                        <ArrowsRightLeftIcon className="w-5 h-5" />
                    </button>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                    <select
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={tokenOut}
                        onChange={(e) => setOut(e.target.value as TokenKey)}
                    >
                        <option value="A" disabled={tokenIn === 'A'}>
                            {TOKEN_INFO.TOKEN_A.symbol} - {TOKEN_INFO.TOKEN_A.name}
                        </option>
                        <option value="B">{TOKEN_INFO.TOKEN_B.symbol} - {TOKEN_INFO.TOKEN_B.name}</option>
                    </select>
                </div>
            </div>

            {!isValid && (
                <p className="mt-3 text-sm text-red-600">Please select two different tokens.</p>
            )}
        </div>
    );
};

export default TokenSelector;


