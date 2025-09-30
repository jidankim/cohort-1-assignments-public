'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSwapCalculation } from '../../hooks/useSwapCalculation';
import { useTokenSelection } from '../../hooks/useTokenSelection';
import { TOKEN_INFO } from '../../lib/constants';
import LoadingSkeleton from '../LoadingSkeleton';
import { useSwapExecution } from '../../hooks/useSwapExecution';

const AmountInput: React.FC = () => {
    const { tokenIn, tokenOut, swapDirections } = useTokenSelection();
    const { amountIn, amountOut, setAmountIn, setMax, error, isCalculating, reservesLoading, priceImpactBps, minOut } = useSwapCalculation({ tokenIn, tokenOut });
    const swapExec = useSwapExecution({ tokenIn, amountIn });
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
        <div className={`space-y-6 ${(isCalculating || swapExec.isSwapping) ? 'pointer-events-none opacity-90' : ''}`}>
            {/* From card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">From</span>
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
                            disabled={swapExec.isSwapping}
                            className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'} ${swapExec.isSwapping ? 'bg-gray-50' : ''}`}
                        />
                        <button
                            type="button"
                            onClick={setMax}
                            disabled={swapExec.isSwapping}
                            className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs rounded-md border border-gray-300 bg-gray-50 hover:bg-gray-100 disabled:opacity-50"
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

            {/* Price details */}
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                <div className="flex items-center justify-between bg-white border border-gray-200 rounded-md px-3 py-2">
                    <span>Minimum received (0.5% slippage)</span>
                    <span className="font-medium text-gray-900">{minOut || '0.0'}</span>
                </div>
                <div className="flex items-center justify-between bg-white border border-gray-200 rounded-md px-3 py-2">
                    <span>Price impact</span>
                    <span className={`font-medium ${priceImpactBps > 200 ? 'text-red-600' : priceImpactBps > 50 ? 'text-yellow-600' : 'text-gray-900'}`}>
                        {(priceImpactBps / 100).toFixed(2)}%
                    </span>
                </div>
            </div>

            {/* Swap button and messages */}
            <SwapButton
                isSwapping={swapExec.isSwapping}
                canSwap={swapExec.canSwap}
                executeSwap={swapExec.executeSwap}
                swapError={swapExec.swapError}
                txHash={swapExec.txHash}
            />

            <p className="text-center text-xs text-gray-500">Prices update automatically based on pool reserves</p>
        </div>
    );
};

export default AmountInput;

interface SwapButtonProps {
    isSwapping: boolean;
    canSwap: boolean;
    executeSwap: () => Promise<void> | void;
    swapError: string | null;
    txHash: string | null;
}

const SwapButton: React.FC<SwapButtonProps> = ({ isSwapping, canSwap, executeSwap, swapError, txHash }) => {

    return (
        <div className="mt-4">
            <button
                onClick={executeSwap}
                disabled={!canSwap || isSwapping}
                className={`w-full inline-flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${(!canSwap || isSwapping) ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
            >
                {isSwapping ? 'Swapping...' : 'Swap'}
            </button>
            {swapError && <p className="mt-2 text-sm text-red-600">{swapError}</p>}
            {txHash && (
                <p className="mt-2 text-sm text-green-600">Swap submitted: {txHash.slice(0, 10)}...{txHash.slice(-6)}</p>
            )}
        </div>
    );
};


