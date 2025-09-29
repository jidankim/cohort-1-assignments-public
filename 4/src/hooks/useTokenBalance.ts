'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWalletConnection } from './useWalletConnection';
import { getTokenBalance } from '../lib/contracts';
import { formatTokenAmount } from '../lib/calculations';
import { TOKEN_INFO } from '../lib/constants';

export const useTokenBalance = (tokenAddress: string) => {
    const { address, provider, isConnected, mounted } = useWalletConnection();
    const [balance, setBalance] = useState<string>('0');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBalance = useCallback(async () => {
        if (!mounted || !isConnected || !address || !provider) {
            setBalance('0');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const balanceWei = await getTokenBalance(provider, tokenAddress, address);
            const formattedBalance = formatTokenAmount(balanceWei, 18, 6);
            setBalance(formattedBalance);
        } catch (err: any) {
            console.error('Error fetching token balance:', err);
            setError(err.message || 'Failed to fetch balance');
            setBalance('0');
        } finally {
            setIsLoading(false);
        }
    }, [mounted, isConnected, address, provider, tokenAddress]);

    // Fetch balance on mount and when dependencies change
    useEffect(() => {
        fetchBalance();
    }, [fetchBalance]);

    // Refresh balance every 30 seconds
    useEffect(() => {
        if (!isConnected) return;

        const interval = setInterval(fetchBalance, 30000);
        return () => clearInterval(interval);
    }, [isConnected, fetchBalance]);

    return {
        balance,
        isLoading,
        error,
        refreshBalance: fetchBalance,
    };
};

export const useTokenBalances = () => {
    const tokenABalance = useTokenBalance(TOKEN_INFO.TOKEN_A.address);
    const tokenBBalance = useTokenBalance(TOKEN_INFO.TOKEN_B.address);

    const refreshAllBalances = useCallback(() => {
        tokenABalance.refreshBalance();
        tokenBBalance.refreshBalance();
    }, [tokenABalance.refreshBalance, tokenBBalance.refreshBalance]);

    return {
        tokenA: tokenABalance,
        tokenB: tokenBBalance,
        refreshAllBalances,
    };
};
