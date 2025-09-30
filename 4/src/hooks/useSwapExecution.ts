'use client';

import { useCallback, useMemo, useState } from 'react';
import { ethers } from 'ethers';
import { useWalletConnection } from './useWalletConnection';
import { getMiniAMMContract, waitForTransaction } from '../lib/contracts';
import { useTokenBalances } from './useTokenBalance';
import { useContractBalance } from './useContractBalance';

interface UseSwapExecutionParams {
    tokenIn: 'A' | 'B';
    amountIn: string; // human-readable, 18 decimals
}

export const useSwapExecution = ({ tokenIn, amountIn }: UseSwapExecutionParams) => {
    const { provider, getSigner, isConnected, isCorrectNetwork, mounted } = useWalletConnection();
    const [isSwapping, setIsSwapping] = useState(false);
    const [swapError, setSwapError] = useState<string | null>(null);
    const [txHash, setTxHash] = useState<string | null>(null);
    const { refreshAllBalances } = useTokenBalances();
    const { refetchBalances: refreshReserves } = useContractBalance();

    const parsedAmountIn: bigint = useMemo(() => {
        if (!amountIn) return 0n;
        const [whole, frac = ''] = amountIn.split('.');
        const fractional = frac.padEnd(18, '0').slice(0, 18);
        return BigInt((whole || '0') + fractional);
    }, [amountIn]);

    const canSwap: boolean = useMemo(() => {
        if (!mounted || !isConnected || !isCorrectNetwork) return false;
        if (!amountIn || parsedAmountIn <= 0n) return false;
        return true;
    }, [mounted, isConnected, isCorrectNetwork, amountIn, parsedAmountIn]);

    const executeSwap = useCallback(async () => {
        setSwapError(null);
        setTxHash(null);

        try {
            if (!canSwap) return;
            if (!provider) throw new Error('No provider available');
            const signer = await (getSigner ? getSigner() : null);
            if (!signer) throw new Error('No signer available');

            const amm = getMiniAMMContract(provider).connect(signer);

            const xAmountIn = tokenIn === 'A' ? parsedAmountIn : 0n;
            const yAmountIn = tokenIn === 'B' ? parsedAmountIn : 0n;

            setIsSwapping(true);
            const tx = await amm.swap(xAmountIn, yAmountIn);
            await waitForTransaction(tx);
            setTxHash(tx.hash);

            // Post-swap refreshes
            try {
                await Promise.all([
                    refreshAllBalances(),
                    refreshReserves(),
                ]);
            } catch (_) {
                // non-fatal
            }
        } catch (err: any) {
            console.error('Swap failed:', err);
            setSwapError(err?.reason || err?.message || 'Swap failed');
        } finally {
            setIsSwapping(false);
        }
    }, [canSwap, provider, getSigner, tokenIn, parsedAmountIn]);

    return {
        isSwapping,
        swapError,
        txHash,
        canSwap,
        executeSwap,
    };
};


