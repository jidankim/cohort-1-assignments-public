'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useWalletConnection } from './useWalletConnection';
import { useContractBalance } from './useContractBalance';
import { getMiniAMMContract, waitForTransaction } from '../lib/contracts';
import { formatTokenAmount } from '../lib/calculations';

export const useRemoveLiquidity = () => {
    const { provider, getSigner, isConnected, isCorrectNetwork, mounted, address } = useWalletConnection();
    const { refetchBalances: refreshReserves, reserveA, reserveB } = useContractBalance();

    const [isRemoving, setIsRemoving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [txHash, setTxHash] = useState<string | null>(null);
    const [lpBalance, setLpBalance] = useState<string>('0');
    const [totalSupply, setTotalSupply] = useState<bigint | null>(null);

    // Fetch LP balance and total supply
    useEffect(() => {
        (async () => {
            try {
                if (!mounted || !isConnected || !provider || !address) return;
                const amm = getMiniAMMContract(provider);
                const [balWei, ts] = await Promise.all([
                    amm.balanceOf(address),
                    amm.totalSupply(),
                ]);
                setLpBalance(formatTokenAmount(balWei, 18, 6));
                setTotalSupply(ts);
            } catch (e) {
                // ignore
            }
        })();
    }, [mounted, isConnected, provider, address]);

    const canRemove = useCallback((lpInput: string) => {
        if (!mounted || !isConnected || !isCorrectNetwork) return false;
        return !!lpInput && Number(lpInput) > 0;
    }, [mounted, isConnected, isCorrectNetwork]);

    // Estimate token outputs for a given LP amount
    const estimateTokens = useCallback((lpInput: string): { xOut: string; yOut: string } => {
        if (!lpInput || !reserveA || !reserveB || !totalSupply || totalSupply === 0n) {
            return { xOut: '0', yOut: '0' };
        }
        const [w, f = ''] = lpInput.split('.');
        const lpWei = BigInt((w || '0') + f.padEnd(18, '0').slice(0, 18));
        const xOut = (lpWei * reserveA) / totalSupply;
        const yOut = (lpWei * reserveB) / totalSupply;
        return {
            xOut: formatTokenAmount(xOut, 18, 6),
            yOut: formatTokenAmount(yOut, 18, 6),
        };
    }, [reserveA, reserveB, totalSupply]);

    const executeRemove = useCallback(async (lpInput: string) => {
        setError(null);
        setTxHash(null);
        try {
            if (!provider) throw new Error('No provider');
            const signer = await (getSigner ? getSigner() : null);
            if (!signer) throw new Error('No signer');

            const [w, f = ''] = lpInput.split('.');
            const wei = BigInt((w || '0') + f.padEnd(18, '0').slice(0, 18));

            const amm = getMiniAMMContract(provider).connect(signer);
            setIsRemoving(true);
            const tx = await amm.removeLiquidity(wei);
            await waitForTransaction(tx);
            setTxHash(tx.hash);
            await refreshReserves();
        } catch (err: any) {
            console.error('Remove liquidity failed:', err);
            setError(err?.reason || err?.message || 'Remove liquidity failed');
        } finally {
            setIsRemoving(false);
        }
    }, [provider, getSigner, refreshReserves]);

    return {
        isRemoving,
        error,
        txHash,
        lpBalance,
        estimateTokens,
        canRemove,
        executeRemove,
    };
};


