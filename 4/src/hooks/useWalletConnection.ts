'use client';

import { useAccount, useConnect, useDisconnect, useNetwork } from 'wagmi';
import { useEthers } from '../lib/ethers';
import { useMemo, useEffect, useState } from 'react';
import { NETWORK_CONFIG } from '../lib/constants';

export const useWalletConnection = () => {
    const [mounted, setMounted] = useState(false);

    const { address, isConnected, connector, isConnecting } = useAccount();
    const { connect, connectors, error: connectError, isLoading: isConnectingWallet } = useConnect();
    const { disconnect, isSuccess: isDisconnected } = useDisconnect();
    const { chain } = useNetwork();
    const { provider, getSigner } = useEthers();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Check if connected to the correct network
    const isCorrectNetwork = useMemo(() => {
        return chain?.id === NETWORK_CONFIG.chainId;
    }, [chain?.id]);

    // Get connection status
    const connectionStatus = useMemo(() => {
        if (!mounted) return 'loading';
        if (isConnecting || isConnectingWallet) return 'connecting';
        if (isConnected && isCorrectNetwork) return 'connected';
        if (isConnected && !isCorrectNetwork) return 'wrong-network';
        if (isDisconnected) return 'disconnected';
        return 'disconnected';
    }, [mounted, isConnected, isCorrectNetwork, isConnecting, isConnectingWallet, isDisconnected]);

    // Get available connectors
    const availableConnectors = useMemo(() => {
        return connectors.filter(connector => connector.ready);
    }, [connectors]);

    // Connect to wallet
    const connectWallet = async (connectorId: string) => {
        try {
            const connector = availableConnectors.find(c => c.id === connectorId);
            if (connector) {
                await connect({ connector });
            }
        } catch (error) {
            console.error('Failed to connect wallet:', error);
            throw error;
        }
    };

    // Disconnect wallet
    const disconnectWallet = async () => {
        try {
            await disconnect();
        } catch (error) {
            console.error('Failed to disconnect wallet:', error);
            throw error;
        }
    };

    // Get formatted address
    const formattedAddress = useMemo(() => {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }, [address]);

    // Get network name
    const networkName = useMemo(() => {
        if (!chain) return 'Unknown';
        return chain.name;
    }, [chain]);

    return {
        // Connection state
        address,
        isConnected,
        isConnecting: isConnecting || isConnectingWallet,
        isCorrectNetwork,
        connectionStatus,
        mounted,

        // Wallet info
        connector,
        formattedAddress,
        networkName,

        // Available options
        availableConnectors,

        // Actions
        connectWallet,
        disconnectWallet,

        // Errors
        connectError,

        // Provider and signer
        provider,
        getSigner,
    };
};
