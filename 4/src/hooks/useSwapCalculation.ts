'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { calculateSwapOutput } from '../lib/calculations';
import { useContractBalance } from './useContractBalance';
import { useTokenSelection } from './useTokenSelection';
import { useTokenBalances } from './useTokenBalance';

export const useSwapCalculation = () => {
    const { reserveA, reserveB, loading: reservesLoading } = useContractBalance();
    const { tokenIn } = useTokenSelection();
    const { tokenA, tokenB } = useTokenBalances();

    const [amountIn, setAmountIn] = useState<string>('');
    const [amountOut, setAmountOut] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);

    const inputReserve: bigint | null = useMemo(() => {
        if (reserveA == null || reserveB == null) return null;
        return tokenIn === 'A' ? reserveA : reserveB;
    }, [reserveA, reserveB, tokenIn]);

    const outputReserve: bigint | null = useMemo(() => {
        if (reserveA == null || reserveB == null) return null;
        return tokenIn === 'A' ? reserveB : reserveA;
    }, [reserveA, reserveB, tokenIn]);

    const parseDisplayToWei = useCallback((display: string): bigint => {
        if (!display) return 0n;
        const [whole, frac = ''] = display.split('.');
        const fractional = frac.padEnd(18, '0').slice(0, 18);
        return BigInt((whole || '0') + fractional);
    }, []);

    const walletBalanceIn: bigint | null = useMemo(() => {
        const display = tokenIn === 'A' ? tokenA.balance : tokenB.balance;
        return parseDisplayToWei(display);
    }, [tokenIn, tokenA.balance, tokenB.balance, parseDisplayToWei]);

    const validate = useCallback((value: string): string | null => {
        if (!value) return null;
        const num = Number(value);
        if (Number.isNaN(num) || num <= 0) return 'Enter a positive number';
        // Convert to wei using 18 decimals safely
        const [whole, frac = ''] = value.split('.');
        const fractional = frac.padEnd(18, '0').slice(0, 18);
        const wei = BigInt((whole || '0') + fractional);
        if (walletBalanceIn != null && wei > walletBalanceIn) return 'Insufficient balance';
        if (inputReserve != null && wei > inputReserve) return 'Amount too large relative to pool';
        return null;
    }, [walletBalanceIn, inputReserve]);

    const recalc = useCallback(() => {
        if (!amountIn || inputReserve == null || outputReserve == null) {
            setAmountOut('');
            return;
        }
        const err = validate(amountIn);
        setError(err);
        if (err) {
            setAmountOut('');
            return;
        }
        setIsCalculating(true);
        try {
            const [whole, frac = ''] = amountIn.split('.');
            const fractional = frac.padEnd(18, '0').slice(0, 18);
            const weiIn = BigInt((whole || '0') + fractional);
            const { outputAmount } = calculateSwapOutput(weiIn, inputReserve, outputReserve);
            // format to 6 decimals
            const wholeOut = outputAmount / 10n ** 18n;
            const fracOut = (outputAmount % 10n ** 18n).toString().padStart(18, '0').slice(0, 6);
            const formatted = fracOut === '000000' ? `${wholeOut.toString()}` : `${wholeOut.toString()}.${fracOut}`;
            setAmountOut(formatted);
        } finally {
            setIsCalculating(false);
        }
    }, [amountIn, inputReserve, outputReserve, validate]);

    useEffect(() => {
        recalc();
    }, [recalc]);

    const setMax = useCallback(() => {
        if (walletBalanceIn == null) return;
        const whole = walletBalanceIn / 10n ** 18n;
        const frac = (walletBalanceIn % 10n ** 18n).toString().padStart(18, '0').slice(0, 6);
        const val = frac === '000000' ? `${whole}` : `${whole}.${frac}`;
        setAmountIn(val);
    }, [walletBalanceIn]);

    return {
        amountIn,
        amountOut,
        setAmountIn,
        setMax,
        error,
        isCalculating,
        reservesLoading,
    };
};


