'use client';

import { useCallback, useMemo, useState } from 'react';
import { TOKEN_INFO } from '../lib/constants';

export type TokenKey = 'A' | 'B';

export interface SelectedToken {
    key: TokenKey;
    address: string;
    symbol: string;
    name: string;
    decimals: number;
}

export const useTokenSelection = () => {
    const tokenMap = useMemo(() => ({
        A: TOKEN_INFO.TOKEN_A,
        B: TOKEN_INFO.TOKEN_B,
    }), []);

    const [tokenIn, setTokenIn] = useState<TokenKey>('A');
    const [tokenOut, setTokenOut] = useState<TokenKey>('B');

    const selectedIn: SelectedToken = useMemo(() => ({
        key: tokenIn,
        address: tokenMap[tokenIn].address,
        symbol: tokenMap[tokenIn].symbol,
        name: tokenMap[tokenIn].name,
        decimals: tokenMap[tokenIn].decimals,
    }), [tokenIn, tokenMap]);

    const selectedOut: SelectedToken = useMemo(() => ({
        key: tokenOut,
        address: tokenMap[tokenOut].address,
        symbol: tokenMap[tokenOut].symbol,
        name: tokenMap[tokenOut].name,
        decimals: tokenMap[tokenOut].decimals,
    }), [tokenOut, tokenMap]);

    const swapDirections = useCallback(() => {
        setTokenIn((prev) => (prev === 'A' ? 'B' : 'A'));
        setTokenOut((prev) => (prev === 'A' ? 'B' : 'A'));
    }, []);

    const setIn = useCallback((key: TokenKey) => {
        if (key === tokenOut) {
            setTokenOut(tokenIn);
        }
        setTokenIn(key);
    }, [tokenIn, tokenOut]);

    const setOut = useCallback((key: TokenKey) => {
        if (key === tokenIn) {
            setTokenIn(tokenOut);
        }
        setTokenOut(key);
    }, [tokenIn, tokenOut]);

    const isValid = tokenIn !== tokenOut;

    return {
        tokenIn,
        tokenOut,
        selectedIn,
        selectedOut,
        isValid,
        swapDirections,
        setIn,
        setOut,
    };
};


