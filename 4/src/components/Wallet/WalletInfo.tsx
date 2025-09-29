'use client';

import React, { useState, useEffect } from 'react';
import { useWalletConnection } from '../../hooks/useWalletConnection';
import { ClipboardIcon, CheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { NETWORK_CONFIG } from '../../lib/constants';

interface WalletInfoProps {
    className?: string;
}

const WalletInfo: React.FC<WalletInfoProps> = ({ className = '' }) => {
    const [mounted, setMounted] = useState(false);
    const [copied, setCopied] = useState(false);

    const {
        address,
        isConnected,
        isCorrectNetwork,
        connectionStatus,
        formattedAddress,
        networkName,
        disconnectWallet,
    } = useWalletConnection();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const handleCopyAddress = async () => {
        if (address) {
            try {
                await navigator.clipboard.writeText(address);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (error) {
                console.error('Failed to copy address:', error);
            }
        }
    };

    const handleDisconnect = async () => {
        try {
            await disconnectWallet();
        } catch (error) {
            console.error('Failed to disconnect:', error);
        }
    };

    if (!isConnected) {
        return null;
    }

    return (
        <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    {/* Connection status indicator */}
                    <div className="flex items-center space-x-2">
                        <div
                            className={`w-3 h-3 rounded-full ${connectionStatus === 'connected'
                                ? 'bg-green-500'
                                : connectionStatus === 'wrong-network'
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                                }`}
                        />
                        <span className="text-sm font-medium text-gray-900">
                            {connectionStatus === 'connected' ? 'Connected' :
                                connectionStatus === 'wrong-network' ? 'Wrong Network' :
                                    'Disconnected'}
                        </span>
                    </div>

                    {/* Network warning */}
                    {connectionStatus === 'wrong-network' && (
                        <div className="flex items-center space-x-1 text-yellow-600">
                            <ExclamationTriangleIcon className="w-4 h-4" />
                            <span className="text-xs">Switch to {NETWORK_CONFIG.name}</span>
                        </div>
                    )}
                </div>

                {/* Disconnect button */}
                <button
                    onClick={handleDisconnect}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                    Disconnect
                </button>
            </div>

            {/* Wallet address */}
            <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Address:</span>
                    <span className="text-sm font-mono text-gray-900">{formattedAddress}</span>
                </div>

                <button
                    onClick={handleCopyAddress}
                    className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                    {copied ? (
                        <>
                            <CheckIcon className="w-4 h-4" />
                            <span>Copied!</span>
                        </>
                    ) : (
                        <>
                            <ClipboardIcon className="w-4 h-4" />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>

            {/* Network info */}
            <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-gray-600">Network:</span>
                <span className="text-sm text-gray-900">{networkName}</span>
            </div>

            {/* Full address (expandable) */}
            <details className="mt-3">
                <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                    Show full address
                </summary>
                <div className="mt-2 p-2 bg-gray-50 rounded text-xs font-mono break-all">
                    {address}
                </div>
            </details>
        </div>
    );
};

export default WalletInfo;
