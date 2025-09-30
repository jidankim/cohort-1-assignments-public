'use client';

import { useState, useCallback } from 'react';
import { useWalletConnection } from './useWalletConnection';
import { getTokenAContract, getTokenBContract, getTokenAllowance } from '../lib/contracts';
import { parseTokenAmount, formatTokenAmount } from '../lib/calculations';
import { TOKEN_INFO, CONTRACT_ADDRESSES } from '../lib/constants';

export const useTokenApproval = () => {
    const { address, provider, getSigner, isConnected, mounted } = useWalletConnection();
    const [isApprovingA, setIsApprovingA] = useState(false);
    const [isApprovingB, setIsApprovingB] = useState(false);
    const [approvalError, setApprovalError] = useState<string | null>(null);
    const [allowanceA, setAllowanceA] = useState<string>('0');
    const [allowanceB, setAllowanceB] = useState<string>('0');
    const [isLoadingAllowance, setIsLoadingAllowance] = useState(false);

    // Fetch current allowance for a token
    const fetchAllowance = useCallback(async (tokenType: 'A' | 'B') => {
        if (!mounted || !isConnected || !address || !provider) {
            return '0';
        }

        try {
            const tokenAddress = tokenType === 'A'
                ? TOKEN_INFO.TOKEN_A.address
                : TOKEN_INFO.TOKEN_B.address;

            const allowanceWei = await getTokenAllowance(
                provider,
                tokenAddress,
                address,
                CONTRACT_ADDRESSES.MINI_AMM
            );

            return formatTokenAmount(allowanceWei, 18, 6);
        } catch (error) {
            console.error(`Error fetching allowance for Token ${tokenType}:`, error);
            return '0';
        }
    }, [mounted, isConnected, address, provider]);

    // Fetch allowances for both tokens
    const fetchAllAllowances = useCallback(async () => {
        if (!mounted || !isConnected) return;

        try {
            setIsLoadingAllowance(true);
            const [allowanceAValue, allowanceBValue] = await Promise.all([
                fetchAllowance('A'),
                fetchAllowance('B')
            ]);

            setAllowanceA(allowanceAValue);
            setAllowanceB(allowanceBValue);
        } catch (error) {
            console.error('Error fetching allowances:', error);
        } finally {
            setIsLoadingAllowance(false);
        }
    }, [mounted, isConnected, fetchAllowance]);

    // Approve tokens for the AMM contract
    const approveTokens = useCallback(async (tokenType: 'A' | 'B', amount: string) => {
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
            setApprovalError(null);

            if (tokenType === 'A') {
                setIsApprovingA(true);
            } else {
                setIsApprovingB(true);
            }

            const signer = await getSigner();
            if (!signer) {
                throw new Error('Unable to get signer');
            }

            const tokenContract = tokenType === 'A'
                ? getTokenAContract(provider).connect(signer)
                : getTokenBContract(provider).connect(signer);

            // Call the approve function
            const tx = await tokenContract.approve(CONTRACT_ADDRESSES.MINI_AMM, parsedAmount);

            // Wait for transaction confirmation
            const receipt = await tx.wait();

            if (!receipt) {
                throw new Error('Transaction failed');
            }

            // Refresh allowances after successful approval
            await fetchAllAllowances();

            return {
                success: true,
                txHash: receipt.hash,
                amount: formatTokenAmount(parsedAmount, 18),
                tokenType,
            };
        } catch (error: any) {
            console.error(`Error approving Token ${tokenType}:`, error);
            setApprovalError(error.message || `Failed to approve Token ${tokenType}`);
            throw error;
        } finally {
            if (tokenType === 'A') {
                setIsApprovingA(false);
            } else {
                setIsApprovingB(false);
            }
        }
    }, [isConnected, provider, getSigner, fetchAllAllowances]);

    // Approve maximum amount (2^256 - 1)
    const approveMax = useCallback(async (tokenType: 'A' | 'B') => {
        if (!isConnected || !provider || !getSigner) {
            throw new Error('Wallet not connected');
        }

        try {
            setApprovalError(null);

            if (tokenType === 'A') {
                setIsApprovingA(true);
            } else {
                setIsApprovingB(true);
            }

            const signer = await getSigner();
            if (!signer) {
                throw new Error('Unable to get signer');
            }

            const tokenContract = tokenType === 'A'
                ? getTokenAContract(provider).connect(signer)
                : getTokenBContract(provider).connect(signer);

            // Use the maximum uint256 value directly as BigInt
            const maxAmount = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');

            // Call the approve function
            const tx = await tokenContract.approve(CONTRACT_ADDRESSES.MINI_AMM, maxAmount);

            // Wait for transaction confirmation
            const receipt = await tx.wait();

            if (!receipt) {
                throw new Error('Transaction failed');
            }

            // Refresh allowances after successful approval
            await fetchAllAllowances();

            return {
                success: true,
                txHash: receipt.hash,
                amount: 'Max',
                tokenType,
            };
        } catch (error: any) {
            console.error(`Error approving max Token ${tokenType}:`, error);
            setApprovalError(error.message || `Failed to approve max Token ${tokenType}`);
            throw error;
        } finally {
            if (tokenType === 'A') {
                setIsApprovingA(false);
            } else {
                setIsApprovingB(false);
            }
        }
    }, [isConnected, provider, getSigner, fetchAllAllowances]);

    const clearError = useCallback(() => {
        setApprovalError(null);
    }, []);

    return {
        approveTokens,
        approveMax,
        isApprovingA,
        isApprovingB,
        approvalError,
        clearError,
        allowanceA,
        allowanceB,
        isLoadingAllowance,
        fetchAllAllowances,
        isConnected,
        mounted,
    };
};
