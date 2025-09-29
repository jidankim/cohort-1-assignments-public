'use client'

import { BrowserProvider, JsonRpcProvider, Signer } from 'ethers'
import { useAccount } from 'wagmi'
import { useMemo } from 'react'
import { NETWORK_CONFIG } from './constants'

/**
 * Returns a BrowserProvider if window.ethereum is available, otherwise a JsonRpcProvider.
 * Never call on the server.
 */
export function getProvider(): BrowserProvider | JsonRpcProvider {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
        return new BrowserProvider((window as any).ethereum)
    }
    return new JsonRpcProvider(NETWORK_CONFIG.rpcUrl)
}

/**
 * Returns a signer if available from the BrowserProvider. Throws if not connected.
 */
export async function getSigner() {
    const provider = getProvider()
    if (provider instanceof BrowserProvider) {
        return await provider.getSigner()
    }
    throw new Error('No browser wallet available for signer')
}

/**
 * Hook to get provider and signer using wagmi
 */
export function useEthers() {
    const { isConnected } = useAccount()

    const provider = useMemo(() => {
        return getProvider()
    }, [])

    const signer = useMemo(async () => {
        if (!isConnected) return null
        try {
            return await getSigner()
        } catch (error) {
            console.error('Error getting signer:', error)
            return null
        }
    }, [isConnected])

    return {
        provider,
        signer: signer as any, // Type assertion for now
    }
}


