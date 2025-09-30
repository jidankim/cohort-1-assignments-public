'use client';

import React, { useMemo, useState } from 'react';
import { useRemoveLiquidity } from '../../hooks/useRemoveLiquidity';

const RemoveLiquidity: React.FC = () => {
    const { isRemoving, error, txHash, canRemove, executeRemove, lpBalance, estimateTokens } = useRemoveLiquidity();
    const [lpAmount, setLpAmount] = useState('');
    const { xOut, yOut } = useMemo(() => estimateTokens(lpAmount), [lpAmount, estimateTokens]);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Remove Liquidity</h3>
            <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>LP Balance</span>
                    <span className="font-medium text-gray-900">{lpBalance}</span>
                </div>
                <div>
                    <label className="block text-sm text-gray-700 mb-1">LP Tokens to burn</label>
                    <input
                        type="number"
                        inputMode="decimal"
                        step="any"
                        min="0"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={lpAmount}
                        onChange={(e) => setLpAmount(e.target.value)}
                        disabled={isRemoving}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                        <span>Est. Token A out</span>
                        <span className="font-medium text-gray-900">{xOut}</span>
                    </div>
                    <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                        <span>Est. Token B out</span>
                        <span className="font-medium text-gray-900">{yOut}</span>
                    </div>
                </div>
                <button
                    onClick={() => executeRemove(lpAmount)}
                    disabled={!canRemove(lpAmount) || isRemoving}
                    className={`w-full inline-flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${(!canRemove(lpAmount) || isRemoving) ? 'bg-gray-300 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'}`}
                >
                    {isRemoving ? 'Removing...' : 'Remove Liquidity'}
                </button>
                {error && <p className="text-sm text-red-600">{error}</p>}
                {txHash && <p className="text-sm text-green-600">Submitted: {txHash.slice(0, 10)}...{txHash.slice(-6)}</p>}
            </div>
        </div>
    );
};

export default RemoveLiquidity;


