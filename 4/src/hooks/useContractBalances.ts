'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWalletConnection } from './useWalletConnection';
import { getAMMReserves, getMiniAMMContract } from '../lib/contracts';
import { formatTokenAmount } from '../lib/calculations';
import { TOKEN_INFO } from '../lib/constants';

export interface ContractBalanceData {
    tokenABalance: string;
    tokenBBalance: string;
    totalLiquidity: string;
    tokenAReserve: bigint;
    tokenBReserve: bigint;
    isLoading: boolean;
    error: string | null;
}

export const useContractBalances = () => {
    const { provider, isConnected, isCorrectNetwork, mounted } = useWalletConnection();
    const [data, setData] = useState<ContractBalanceData>({
        tokenABalance: '0',
        tokenBBalance: '0',
        totalLiquidity: '0',
        tokenAReserve: 0n,
        tokenBReserve: 0n,
        isLoading: true,
        error: null,
    });

    const fetchContractBalances = useCallback(async () => {
        if (!mounted || !isConnected || !isCorrectNetwork || !provider) {
            setData(prev => ({
                ...prev,
                tokenABalance: '0',
                tokenBBalance: '0',
                totalLiquidity: '0',
                tokenAReserve: 0n,
                tokenBReserve: 0n,
                isLoading: false,
                error: null,
            }));
            return;
        }

        setData(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            // Get AMM reserves
            const { reserveA, reserveB } = await getAMMReserves(provider);

            // Format balances for display
            const tokenABalance = formatTokenAmount(reserveA, 18, 6);
            const tokenBBalance = formatTokenAmount(reserveB, 18, 6);

            // Calculate total liquidity (simplified as sum of both reserves)
            // In a real AMM, this would be more complex, but for display purposes this works
            const totalLiquidityValue = Number(tokenABalance) + Number(tokenBBalance);
            const totalLiquidity = totalLiquidityValue.toFixed(6);

            setData({
                tokenABalance,
                tokenBBalance,
                totalLiquidity,
                tokenAReserve: reserveA,
                tokenBReserve: reserveB,
                isLoading: false,
                error: null,
            });
        } catch (error: any) {
            console.error('Failed to fetch contract balances:', error);
            setData(prev => ({
                ...prev,
                isLoading: false,
                error: `Failed to fetch contract balances: ${error.reason || error.message}`,
            }));
        }
    }, [mounted, isConnected, isCorrectNetwork, provider]);

    // Fetch balances on mount and when dependencies change
    useEffect(() => {
        fetchContractBalances();
    }, [fetchContractBalances]);

    // Auto-refresh every 30 seconds
    useEffect(() => {
        if (!mounted || !isConnected || !isCorrectNetwork) return;

        const interval = setInterval(fetchContractBalances, 30000);
        return () => clearInterval(interval);
    }, [mounted, isConnected, isCorrectNetwork, fetchContractBalances]);

    return {
        ...data,
        refetch: fetchContractBalances,
    };
};
