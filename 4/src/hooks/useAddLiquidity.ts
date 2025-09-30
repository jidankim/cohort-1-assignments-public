'use client';

import { useCallback, useMemo, useState } from 'react';
import { useWalletConnection } from './useWalletConnection';
import { useContractBalance } from './useContractBalance';
import { getMiniAMMContract, waitForTransaction, getTokenAllowance } from '../lib/contracts';
import { CONTRACT_ADDRESSES } from '../lib/constants';

export const useAddLiquidity = () => {
    const { provider, getSigner, isConnected, isCorrectNetwork, mounted, address } = useWalletConnection();
    const { reserveA, reserveB, refetchBalances: refreshReserves } = useContractBalance();

    const [isAdding, setIsAdding] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [txHash, setTxHash] = useState<string | null>(null);

    const ratioHint = useMemo(() => {
        if (!reserveA || !reserveB || reserveA === 0n || reserveB === 0n) return null;
        // tokens should be provided proportional to reserves: A/B
        return Number(reserveA) / Number(reserveB);
    }, [reserveA, reserveB]);

    const estimateLP = useCallback((aIn: string, bIn: string): string => {
        // simple estimate: min(aIn/resA, bIn/resB) * totalReserve
        if (!reserveA || !reserveB) return '0';
        const toWei = (s: string) => {
            if (!s) return 0n;
            const [w, f = ''] = s.split('.');
            return BigInt((w || '0') + f.padEnd(18, '0').slice(0, 18));
        };
        const a = toWei(aIn);
        const b = toWei(bIn);
        if (a === 0n || b === 0n) return '0';
        // very rough: LP ~ min(a*1e18/resA, b*1e18/resB)
        const partA = Number(a) / Number(reserveA);
        const partB = Number(b) / Number(reserveB);
        const lp = Math.min(partA, partB) * (Number(reserveA + reserveB) / 1e18);
        return lp.toFixed(6);
    }, [reserveA, reserveB]);

    const canAdd = useCallback((aIn: string, bIn: string) => {
        if (!mounted || !isConnected || !isCorrectNetwork) return false;
        const valid = (s: string) => !!s && Number(s) > 0;
        return valid(aIn) && valid(bIn);
    }, [mounted, isConnected, isCorrectNetwork]);

    const executeAdd = useCallback(async (aIn: string, bIn: string) => {
        setError(null);
        setTxHash(null);
        try {
            if (!provider) throw new Error('No provider');
            if (!address) throw new Error('No wallet connected');

            // Pre-check allowances (no inline approve, just friendly message)
            const toWei = (s: string) => {
                const [w, f = ''] = s.split('.');
                return BigInt((w || '0') + f.padEnd(18, '0').slice(0, 18));
            };

            const requiredA = toWei(aIn);
            const requiredB = toWei(bIn);

            const [allowA, allowB] = await Promise.all([
                getTokenAllowance(provider, CONTRACT_ADDRESSES.TOKEN_A, address, CONTRACT_ADDRESSES.MINI_AMM),
                getTokenAllowance(provider, CONTRACT_ADDRESSES.TOKEN_B, address, CONTRACT_ADDRESSES.MINI_AMM),
            ]);

            if (requiredA > 0n && allowA < requiredA) {
                setError('Insufficient allowance for Token A. Please approve the AMM to spend Token A.');
                return;
            }
            if (requiredB > 0n && allowB < requiredB) {
                setError('Insufficient allowance for Token B. Please approve the AMM to spend Token B.');
                return;
            }
            const signer = await (getSigner ? getSigner() : null);
            if (!signer) throw new Error('No signer');

            const amm = getMiniAMMContract(provider).connect(signer);
            setIsAdding(true);

            // Map UI Token A/B inputs to contract tokenX/tokenY order
            const tokenAIsX = CONTRACT_ADDRESSES.TOKEN_A.toLowerCase() < CONTRACT_ADDRESSES.TOKEN_B.toLowerCase();
            const xIn = tokenAIsX ? toWei(aIn) : toWei(bIn);
            const yIn = tokenAIsX ? toWei(bIn) : toWei(aIn);

            const tx = await amm.addLiquidity(xIn, yIn);
            await waitForTransaction(tx);
            setTxHash(tx.hash);
            await refreshReserves();
        } catch (err: any) {
            console.error('Add liquidity failed:', err);
            setError(err?.reason || err?.message || 'Add liquidity failed');
        } finally {
            setIsAdding(false);
        }
    }, [provider, getSigner, refreshReserves]);

    return {
        isAdding,
        error,
        txHash,
        ratioHint,
        estimateLP,
        canAdd,
        executeAdd,
    };
};


