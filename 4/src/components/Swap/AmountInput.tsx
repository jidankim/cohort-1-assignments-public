'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSwapCalculation } from '../../hooks/useSwapCalculation';
import { useTokenSelection } from '../../hooks/useTokenSelection';
import { TOKEN_INFO } from '../../lib/constants';
import LoadingSkeleton from '../LoadingSkeleton';

const AmountInput: React.FC = () => {
    const { amountIn, amountOut, setAmountIn, setMax, error, isCalculating, reservesLoading } = useSwapCalculation();
    const { tokenIn, tokenOut, setIn, setOut, swapDirections, isValid } = useTokenSelection();
    const [mounted, setMounted] = useState(false);

    const tokenInInfo = useMemo(() => tokenIn === 'A' ? TOKEN_INFO.TOKEN_A : TOKEN_INFO.TOKEN_B, [tokenIn]);
    const tokenOutInfo = useMemo(() => tokenOut === 'A' ? TOKEN_INFO.TOKEN_A : TOKEN_INFO.TOKEN_B, [tokenOut]);

    const shortAddr = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
                <div className="space-y-3">
                    <div className="h-10 bg-gray-200 rounded" />
                    <div className="h-10 bg-gray-200 rounded" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* From card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">From</span>
                    <select
                        className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={tokenIn}
                        onChange={(e) => setIn(e.target.value as 'A' | 'B')}
                    >
                        <option value="A" disabled={tokenOut === 'A'}>{TOKEN_INFO.TOKEN_A.symbol}</option>
                        <option value="B" disabled={tokenOut === 'B'}>{TOKEN_INFO.TOKEN_B.symbol}</option>
                    </select>
                </div>
                <div className="flex items-baseline space-x-3">
                    <span className="text-gray-900 font-semibold">{tokenInInfo.symbol}</span>
                    <div className="relative flex-1">
                        <input
                            type="number"
                            inputMode="decimal"
                            step="any"
                            min="0"
                            value={amountIn}
                            onChange={(e) => setAmountIn(e.target.value)}
                            placeholder="0.0"
                            className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                        />
                        <button
                            type="button"
                            onClick={setMax}
                            className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs rounded-md border border-gray-300 bg-gray-50 hover:bg-gray-100"
                        >
                            Max
                        </button>
                    </div>
                </div>
                <div className="mt-1 text-xs text-gray-500">{tokenInInfo.name} - {shortAddr(tokenInInfo.address)}</div>
                {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
            </div>

            {/* Switch button */}
            <div className="flex justify-center">
                <button
                    type="button"
                    onClick={swapDirections}
                    className="w-10 h-10 rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 shadow-sm"
                    title="Switch tokens"
                >
                    ↓
                </button>
            </div>

            {/* To card */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">To (estimated)</span>
                    <select
                        className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={tokenOut}
                        onChange={(e) => setOut(e.target.value as 'A' | 'B')}
                    >
                        <option value="A" disabled={tokenIn === 'A'}>{TOKEN_INFO.TOKEN_A.symbol}</option>
                        <option value="B" disabled={tokenIn === 'B'}>{TOKEN_INFO.TOKEN_B.symbol}</option>
                    </select>
                </div>
                <div className="flex items-baseline space-x-3">
                    <span className="text-gray-900 font-semibold">{tokenOutInfo.symbol}</span>
                    <div className="flex-1">
                        <div className="w-full border border-gray-200 bg-white rounded-md px-3 py-2 text-gray-900">
                            {reservesLoading || isCalculating ? (
                                <LoadingSkeleton className="w-24 h-5" />
                            ) : (
                                <span>{amountOut || '0.0'}</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="mt-1 text-xs text-gray-500">{tokenOutInfo.name} - {shortAddr(tokenOutInfo.address)}</div>
            </div>

            {!isValid && (
                <p className="text-center text-xs text-red-600">Please select two different tokens.</p>
            )}

            <p className="text-center text-xs text-gray-500">Prices update automatically based on pool reserves</p>
        </div>
    );
};

export default AmountInput;


