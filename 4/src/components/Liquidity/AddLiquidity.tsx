'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useAddLiquidity } from '../../hooks/useAddLiquidity';
import { useTokenBalances } from '../../hooks/useTokenBalance';
import { TOKEN_INFO } from '../../lib/constants';

const AddLiquidity: React.FC = () => {
    const { isAdding, error, txHash, ratioHint, estimateLP, canAdd, executeAdd } = useAddLiquidity();
    const { tokenA, tokenB } = useTokenBalances();
    const [amountA, setAmountA] = useState('');
    const [amountB, setAmountB] = useState('');
    const [autoMatch, setAutoMatch] = useState(true);
    const [activeField, setActiveField] = useState<'A' | 'B'>('A');

    const est = useMemo(() => estimateLP(amountA, amountB), [amountA, amountB, estimateLP]);

    // Helpers to parse amounts
    const toWei = (s: string) => {
        if (!s) return 0n;
        const [w, f = ''] = s.split('.');
        return BigInt((w || '0') + f.padEnd(18, '0').slice(0, 18));
    };
    const displayToWei = (s: string) => {
        if (!s) return 0n;
        const [w, f = ''] = s.split('.');
        return BigInt((w || '0') + f.padEnd(18, '0').slice(0, 18));
    };

    const balanceAWei = useMemo(() => displayToWei(tokenA.balance), [tokenA.balance]);
    const balanceBWei = useMemo(() => displayToWei(tokenB.balance), [tokenB.balance]);

    const amountAWei = useMemo(() => toWei(amountA), [amountA]);
    const amountBWei = useMemo(() => toWei(amountB), [amountB]);

    const overABalance = amountAWei > balanceAWei;
    const overBBalance = amountBWei > balanceBWei;
    const anyError = overABalance || overBBalance;

    // Auto-fill the counterpart amount based on pool ratio when enabled
    useEffect(() => {
        if (!autoMatch || !ratioHint || isAdding) return;
        if (activeField === 'A') {
            const a = Number(amountA);
            if (!isFinite(a) || a <= 0) return;
            const b = a / ratioHint; // A:B ≈ ratio:1 => B = A/ratio
            setAmountB(b.toFixed(6));
        } else {
            const b = Number(amountB);
            if (!isFinite(b) || b <= 0) return;
            const a = b * ratioHint; // A = B*ratio
            setAmountA(a.toFixed(6));
        }
    }, [amountA, amountB, activeField, autoMatch, ratioHint, isAdding]);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Liquidity</h3>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Provide tokens in pool ratio</p>
                    <label className="flex items-center space-x-2 text-sm">
                        <input
                            type="checkbox"
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={autoMatch}
                            onChange={(e) => setAutoMatch(e.target.checked)}
                            disabled={isAdding}
                        />
                        <span>Auto match ratio</span>
                    </label>
                </div>
                <div>
                    <label className="block text-sm text-gray-700 mb-1">{TOKEN_INFO.TOKEN_A.symbol} Amount</label>
                    <input
                        type="number"
                        inputMode="decimal"
                        step="any"
                        min="0"
                        className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${overABalance ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                        value={amountA}
                        onChange={(e) => { setActiveField('A'); setAmountA(e.target.value); }}
                        disabled={isAdding}
                    />
                    {overABalance && (
                        <p className="mt-1 text-xs text-red-600">Amount exceeds wallet balance</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm text-gray-700 mb-1">{TOKEN_INFO.TOKEN_B.symbol} Amount</label>
                    <input
                        type="number"
                        inputMode="decimal"
                        step="any"
                        min="0"
                        className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${overBBalance ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                        value={amountB}
                        onChange={(e) => { setActiveField('B'); setAmountB(e.target.value); }}
                        disabled={isAdding}
                    />
                    {overBBalance && (
                        <p className="mt-1 text-xs text-red-600">Amount exceeds wallet balance</p>
                    )}
                </div>

                {ratioHint && (
                    <p className="text-xs text-gray-500">Recommended ratio A:B ≈ {ratioHint.toFixed(4)}:1</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                        <span>Estimated LP tokens</span>
                        <span className="font-medium text-gray-900">{est}</span>
                    </div>
                </div>

                <button
                    onClick={() => executeAdd(amountA, amountB)}
                    disabled={!canAdd(amountA, amountB) || isAdding || anyError}
                    className={`w-full inline-flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${(!canAdd(amountA, amountB) || isAdding || anyError) ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'}`}
                >
                    {isAdding ? 'Adding...' : 'Add Liquidity'}
                </button>

                {error && <p className="text-sm text-red-600">{error}</p>}
                {txHash && <p className="text-sm text-green-600">Submitted: {txHash.slice(0, 10)}...{txHash.slice(-6)}</p>}
            </div>
        </div>
    );
};

export default AddLiquidity;


