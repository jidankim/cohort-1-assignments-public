'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useEthers } from '../lib/ethers';

export const useWallet = () => {
    const { address, isConnected, connector } = useAccount();
    const { connect, connectors, error: connectError, isLoading: isConnecting } = useConnect();
    const { disconnect } = useDisconnect();
    const { provider, signer } = useEthers();

    return {
        address,
        isConnected,
        connector,
        connect,
        connectors,
        connectError,
        isConnecting,
        disconnect,
        provider,
        signer,
    };
};