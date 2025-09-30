'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWalletConnection } from './useWalletConnection';
import { getAMMReserves, getTokenBalance } from '../lib/contracts';
import { formatTokenAmount } from '../lib/calculations';
import { CONTRACT_ADDRESSES, TOKEN_INFO } from '../lib/constants';

export const useContractBalance = () => {
    const { provider, isConnected, mounted } = useWalletConnection();
    const [reserveA, setReserveA] = useState<bigint | null>(null);
    const [reserveB, setReserveB] = useState<bigint | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchContractBalances = useCallback(async () => {
        if (!mounted || !isConnected || !provider) {
            setReserveA(null);
            setReserveB(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Get reserves from AMM contract
            const { reserveA: newReserveA, reserveB: newReserveB } = await getAMMReserves(provider);

            setReserveA(newReserveA);
            setReserveB(newReserveB);
            setLastUpdated(new Date());
        } catch (err: any) {
            console.error('Failed to fetch contract balances:', err);
            setError(`Failed to fetch contract balances: ${err.reason || err.message}`);
            setReserveA(null);
            setReserveB(null);
        } finally {
            setLoading(false);
        }
    }, [mounted, isConnected, provider]);

    // Fetch balances on mount and when connected
    useEffect(() => {
        fetchContractBalances();
    }, [fetchContractBalances]);

    // Auto-refresh every 30 seconds
    useEffect(() => {
        if (!isConnected || !mounted) return;

        const interval = setInterval(fetchContractBalances, 30000);
        return () => clearInterval(interval);
    }, [fetchContractBalances, isConnected, mounted]);

    // Calculate total liquidity value (simplified as sum of both reserves)
    const totalLiquidity = reserveA && reserveB ? reserveA + reserveB : null;

    // Format reserves for display
    const formattedReserveA = reserveA ? formatTokenAmount(reserveA, 18, 6) : '0';
    const formattedReserveB = reserveB ? formatTokenAmount(reserveB, 18, 6) : '0';
    const formattedTotalLiquidity = totalLiquidity ? formatTokenAmount(totalLiquidity, 18, 6) : '0';

    // Calculate liquidity ratio
    const liquidityRatio = reserveA && reserveB && reserveB > 0n
        ? Number(reserveA) / Number(reserveB)
        : 0;

    return {
        reserveA,
        reserveB,
        totalLiquidity,
        formattedReserveA,
        formattedReserveB,
        formattedTotalLiquidity,
        liquidityRatio,
        loading,
        error,
        lastUpdated,
        refetchBalances: fetchContractBalances,
    };
};
