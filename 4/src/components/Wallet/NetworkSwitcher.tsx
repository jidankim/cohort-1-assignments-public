'use client';

import React, { useState, useEffect } from 'react';
import { useSwitchNetwork } from 'wagmi';
import { useWalletConnection } from '../../hooks/useWalletConnection';
import { ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { NETWORK_CONFIG } from '../../lib/constants';

interface NetworkSwitcherProps {
    className?: string;
}

const NetworkSwitcher: React.FC<NetworkSwitcherProps> = ({ className = '' }) => {
    const [mounted, setMounted] = useState(false);
    const [isRetrying, setIsRetrying] = useState(false);

    const { isConnected, isCorrectNetwork, connectionStatus } = useWalletConnection();
    const { switchNetwork, isLoading: isSwitching } = useSwitchNetwork();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const handleSwitchNetwork = async () => {
        if (!switchNetwork) return;

        setIsRetrying(true);
        try {
            await switchNetwork(NETWORK_CONFIG.chainId);
        } catch (error) {
            console.error('Failed to switch network:', error);
        } finally {
            setIsRetrying(false);
        }
    };

    if (!isConnected || connectionStatus === 'connected') {
        return null;
    }

    const isLoading = isSwitching || isRetrying;

    return (
        <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
            <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-yellow-800">
                                Wrong Network
                            </h3>
                            <p className="text-sm text-yellow-700 mt-1">
                                Please switch to {NETWORK_CONFIG.name} to use this application.
                            </p>
                        </div>

                        <button
                            onClick={handleSwitchNetwork}
                            disabled={isLoading}
                            className="ml-4 inline-flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-yellow-800 bg-yellow-100 hover:bg-yellow-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                                    <span>Switching...</span>
                                </>
                            ) : (
                                <>
                                    <ArrowPathIcon className="w-4 h-4" />
                                    <span>Switch Network</span>
                                </>
                            )}
                        </button>
                    </div>

                    <div className="mt-3 text-xs text-yellow-600">
                        <div className="font-medium">Required Network Details:</div>
                        <div className="mt-1 space-y-1">
                            <div>Network: {NETWORK_CONFIG.name}</div>
                            <div>Chain ID: {NETWORK_CONFIG.chainId}</div>
                            <div>RPC URL: {NETWORK_CONFIG.rpcUrl}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NetworkSwitcher;
