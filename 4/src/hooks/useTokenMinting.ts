'use client';

import { useState, useCallback } from 'react';
import { useWalletConnection } from './useWalletConnection';
import { getTokenAContract, getTokenBContract } from '../lib/contracts';
import { parseTokenAmount, formatTokenAmount } from '../lib/calculations';
import { TOKEN_INFO } from '../lib/constants';

export const useTokenMinting = () => {
    const { provider, getSigner, isConnected, mounted } = useWalletConnection();
    const [isMintingA, setIsMintingA] = useState(false);
    const [isMintingB, setIsMintingB] = useState(false);
    const [mintError, setMintError] = useState<string | null>(null);

    const mintTokens = useCallback(async (tokenType: 'A' | 'B', amount: string) => {
        if (!isConnected || !provider || !getSigner) {
            throw new Error('Wallet not connected');
        }

        if (!amount || amount === '0' || amount === '') {
            throw new Error('Please enter a valid amount');
        }

        const parsedAmount = parseTokenAmount(amount, 18);
        if (parsedAmount <= 0n) {
            throw new Error('Amount must be greater than 0');
        }

        try {
            setMintError(null);

            if (tokenType === 'A') {
                setIsMintingA(true);
            } else {
                setIsMintingB(true);
            }

            const signer = await getSigner();
            if (!signer) {
                throw new Error('Unable to get signer');
            }

            const tokenContract = tokenType === 'A'
                ? getTokenAContract(provider).connect(signer)
                : getTokenBContract(provider).connect(signer);

            // Call the freeMintToSender function
            const tx = await tokenContract.freeMintToSender(parsedAmount);

            // Wait for transaction confirmation
            const receipt = await tx.wait();

            if (!receipt) {
                throw new Error('Transaction failed');
            }

            return {
                success: true,
                txHash: receipt.hash,
                amount: formatTokenAmount(parsedAmount, 18),
                tokenType,
            };
        } catch (error: any) {
            console.error(`Error minting Token ${tokenType}:`, error);
            setMintError(error.message || `Failed to mint Token ${tokenType}`);
            throw error;
        } finally {
            if (tokenType === 'A') {
                setIsMintingA(false);
            } else {
                setIsMintingB(false);
            }
        }
    }, [isConnected, provider, getSigner]);

    const clearError = useCallback(() => {
        setMintError(null);
    }, []);

    return {
        mintTokens,
        isMintingA,
        isMintingB,
        mintError,
        clearError,
        isConnected,
        mounted,
    };
};
