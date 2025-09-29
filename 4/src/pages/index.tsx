import React from 'react';
import MainLayout from '../components/Layout/MainLayout';
import WalletInfo from '../components/Wallet/WalletInfo';
import ConnectButton from '../components/Wallet/ConnectButton';
import { useWalletConnection } from '../hooks/useWalletConnection';

const HomePage: React.FC = () => {
    const { isConnected, isCorrectNetwork, mounted } = useWalletConnection();

    if (!mounted) {
        return (
            <MainLayout>
                <div className="space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Welcome to MiniAMM
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            A simple automated market maker for swapping tokens and managing liquidity.
                        </p>
                    </div>
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-gray-50 rounded-lg p-8 text-center">
                            <div className="max-w-md mx-auto">
                                <div className="animate-pulse">
                                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded mb-6"></div>
                                    <div className="h-10 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Welcome to MiniAMM
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        A simple automated market maker for swapping tokens and managing liquidity.
                        {mounted && !isConnected ? ' Connect your wallet to get started.' : ''}
                    </p>
                </div>

                {/* Wallet Status Section */}
                <div className="max-w-2xl mx-auto">
                    {mounted && isConnected ? (
                        <div className="space-y-4">
                            <WalletInfo />
                            {isCorrectNetwork ? (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-sm font-medium text-green-800">
                                            Ready to trade! Your wallet is connected to the correct network.
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                        <span className="text-sm font-medium text-yellow-800">
                                            Please switch to the correct network to start trading.
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : mounted ? (
                        <div className="bg-gray-50 rounded-lg p-8 text-center">
                            <div className="max-w-md mx-auto">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Connect Your Wallet
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Connect your wallet to start trading tokens and managing liquidity on MiniAMM.
                                </p>
                                <ConnectButton size="lg" />
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-lg p-8 text-center">
                            <div className="max-w-md mx-auto">
                                <div className="animate-pulse">
                                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded mb-6"></div>
                                    <div className="h-10 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600 font-bold">💰</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Token Balances
                            </h3>
                        </div>
                        <p className="text-gray-600 text-sm">
                            View your token balances and contract reserves in real-time.
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <span className="text-green-600 font-bold">🔄</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Swap Tokens
                            </h3>
                        </div>
                        <p className="text-gray-600 text-sm">
                            Exchange tokens using the constant product formula with minimal slippage.
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <span className="text-purple-600 font-bold">➕</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Add Liquidity
                            </h3>
                        </div>
                        <p className="text-gray-600 text-sm">
                            Provide liquidity to earn trading fees from token swaps.
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                <span className="text-orange-600 font-bold">➖</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Remove Liquidity
                            </h3>
                        </div>
                        <p className="text-gray-600 text-sm">
                            Withdraw your liquidity and LP tokens at any time.
                        </p>
                    </div>
                </div>

                {/* Getting Started Section */}
                {mounted && isConnected && isCorrectNetwork && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-blue-900 mb-3">
                            Getting Started
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
                            <div className="flex items-start space-x-2">
                                <span className="font-bold">1.</span>
                                <span>Mint some test tokens to get started</span>
                            </div>
                            <div className="flex items-start space-x-2">
                                <span className="font-bold">2.</span>
                                <span>Approve the AMM contract to spend your tokens</span>
                            </div>
                            <div className="flex items-start space-x-2">
                                <span className="font-bold">3.</span>
                                <span>Start swapping or providing liquidity</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default HomePage;
