import React from 'react';
import { AppProps } from 'next/app';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig, Chain } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, localhost } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import '@rainbow-me/rainbowkit/styles.css';
import '../styles/globals.css';

// Flare2 Coston testnet configuration
const flare2Coston: Chain = {
    id: 114,
    name: 'Flare2 Coston Testnet',
    network: 'flare2-coston',
    nativeCurrency: {
        decimals: 18,
        name: 'Flare2 Coston',
        symbol: 'C2FLR',
    },
    rpcUrls: {
        default: {
            http: ['https://coston2-api.flare.network/ext/bc/C/rpc'],
        },
        public: {
            http: ['https://coston2-api.flare.network/ext/bc/C/rpc'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Flare2 Coston Explorer',
            url: 'https://coston2-explorer.flare.network',
        },
    },
    testnet: true,
};

// Configure chains and providers
const { chains, publicClient, webSocketPublicClient } = configureChains(
    [
        flare2Coston,
        localhost,
        mainnet,
        polygon,
        optimism,
        arbitrum,
    ],
    [
        alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID || '' }),
        publicProvider(),
    ]
);

// Configure wallets
const { connectors } = getDefaultWallets({
    appName: 'MiniAMM',
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id',
    chains,
});

// Create wagmi config
const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    webSocketPublicClient,
});

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider chains={chains}>
                <Component {...pageProps} />
            </RainbowKitProvider>
        </WagmiConfig>
    );
}

export default MyApp;