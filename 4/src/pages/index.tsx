import React from 'react';
import MainLayout from '../components/Layout/MainLayout';

const HomePage: React.FC = () => {
    return (
        <MainLayout>
            <div className="space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Welcome to MiniAMM
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        A simple automated market maker for swapping tokens and managing liquidity.
                        Connect your wallet to get started.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            Token Balances
                        </h3>
                        <p className="text-gray-600">
                            View your token balances and contract reserves.
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            Swap Tokens
                        </h3>
                        <p className="text-gray-600">
                            Exchange tokens using the constant product formula.
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            Add Liquidity
                        </h3>
                        <p className="text-gray-600">
                            Provide liquidity to earn trading fees.
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            Remove Liquidity
                        </h3>
                        <p className="text-gray-600">
                            Withdraw your liquidity and LP tokens.
                        </p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default HomePage;
