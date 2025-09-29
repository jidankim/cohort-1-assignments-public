'use client';

import React, { useState, useEffect } from 'react';
import { useWalletConnection } from '../../hooks/useWalletConnection';
import { WalletIcon, ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';
import { NETWORK_CONFIG } from '../../lib/constants';
import LoadingSkeleton from '../LoadingSkeleton';

interface ConnectButtonProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

const ConnectButton: React.FC<ConnectButtonProps> = ({
    className = '',
    size = 'md'
}) => {
    const [mounted, setMounted] = useState(false);
    const [showConnectors, setShowConnectors] = useState(false);
    const [selectedConnector, setSelectedConnector] = useState<string | null>(null);

    const {
        isConnected,
        isConnecting,
        connectionStatus,
        availableConnectors,
        connectWallet,
        connectError,
    } = useWalletConnection();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className={`inline-flex items-center space-x-2 font-medium rounded-lg px-4 py-2 text-base ${className}`}>
                <LoadingSkeleton className="w-5 h-5" />
                <span className="text-gray-400">Loading...</span>
            </div>
        );
    }

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    const handleConnect = async (connectorId: string) => {
        setSelectedConnector(connectorId);
        try {
            await connectWallet(connectorId);
            setShowConnectors(false);
        } catch (error) {
            console.error('Connection failed:', error);
        } finally {
            setSelectedConnector(null);
        }
    };

    const getButtonText = () => {
        if (isConnecting) return 'Connecting...';
        if (connectionStatus === 'wrong-network') return 'Wrong Network';
        if (isConnected) return 'Connected';
        return 'Connect Wallet';
    };

    const getButtonStyles = () => {
        const baseStyles = 'inline-flex items-center space-x-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

        if (isConnecting) {
            return `${baseStyles} bg-blue-100 text-blue-700 cursor-not-allowed ${sizeClasses[size]}`;
        }

        if (connectionStatus === 'wrong-network') {
            return `${baseStyles} bg-yellow-100 text-yellow-700 hover:bg-yellow-200 focus:ring-yellow-500 ${sizeClasses[size]}`;
        }

        if (isConnected) {
            return `${baseStyles} bg-green-100 text-green-700 hover:bg-green-200 focus:ring-green-500 ${sizeClasses[size]}`;
        }

        return `${baseStyles} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 ${sizeClasses[size]}`;
    };

    if (isConnected) {
        return (
            <div className={`relative ${className}`}>
                <button
                    className={getButtonStyles()}
                    disabled
                >
                    <CheckIcon className="w-5 h-5" />
                    <span>{getButtonText()}</span>
                </button>
            </div>
        );
    }

    return (
        <div className={`relative ${className}`}>
            <button
                onClick={() => setShowConnectors(!showConnectors)}
                className={getButtonStyles()}
                disabled={isConnecting}
            >
                <WalletIcon className="w-5 h-5" />
                <span>{getButtonText()}</span>
                <ChevronDownIcon className="w-4 h-4" />
            </button>

            {/* Connector dropdown */}
            {showConnectors && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-2">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                            Choose Wallet
                        </div>

                        {availableConnectors.map((connector) => (
                            <button
                                key={connector.id}
                                onClick={() => handleConnect(connector.id)}
                                disabled={selectedConnector === connector.id}
                                className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                        <WalletIcon className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">
                                            {connector.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {connector.id}
                                        </div>
                                    </div>
                                </div>

                                {selectedConnector === connector.id && (
                                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                                    </div>
                                )}
                            </button>
                        ))}

                        {availableConnectors.length === 0 && (
                            <div className="p-4 text-center text-gray-500">
                                <WalletIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                <p className="text-sm">No wallets available</p>
                                <p className="text-xs mt-1">
                                    Please install a wallet extension
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Network info */}
                    <div className="border-t border-gray-200 p-3 bg-gray-50 rounded-b-lg">
                        <div className="text-xs text-gray-600">
                            <div className="font-medium mb-1">Supported Network:</div>
                            <div className="text-gray-900">{NETWORK_CONFIG.name}</div>
                            <div className="text-gray-500">Chain ID: {NETWORK_CONFIG.chainId}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Error message */}
            {connectError && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-red-50 border border-red-200 rounded-lg p-3 z-50">
                    <div className="text-sm text-red-800">
                        <div className="font-medium">Connection Failed</div>
                        <div className="text-xs mt-1">
                            {connectError.message || 'Please try again'}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConnectButton;
