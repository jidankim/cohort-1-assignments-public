# MiniAMM UI

A Next.js frontend application for interacting with a MiniAMM (Automated Market Maker) contract.

## Features

- Connect/disconnect wallet using RainbowKit
- Mint MockERC20 tokens
- Approve MiniAMM to spend tokens
- Swap tokens using constant product formula
- Add/remove liquidity

## Tech Stack

- **Frontend**: React + TypeScript + Next.js
- **Blockchain**: Ethers.js v6
- **Wallet**: RainbowKit + Wagmi
- **Styling**: Tailwind CSS
- **Type Safety**: TypeChain

## Setup

1. Install dependencies:
```bash
npm install
```

2. Generate TypeChain types:
```bash
npm run typechain
```

3. Create environment variables:
```bash
cp .env.local.example .env.local
```

4. Update `.env.local` with your configuration:
- Get a WalletConnect Project ID from https://cloud.walletconnect.com/
- Optionally add an Alchemy API key for better RPC performance

5. Start the development server:
```bash
npm run dev
```

## Network Configuration

- **Network**: Flare2 Coston Testnet
- **Chain ID**: 114
- **RPC URL**: `https://coston2-api.flare.network/ext/bc/C/rpc`
- **Explorer**: `https://coston2-explorer.flare.network`

## Contract Addresses

- **Token A**: `0xa0e76cd25476dbe95d0d765177dcda102adadf1c`
- **Token B**: `0xcb6b1cba0f5145b0444216bd5d6fff665c2fcae6`
- **MiniAMM**: `0xe3b885987bce1f5c32d9ce824e97d200db96e266`

## Project Structure

```
src/
├── components/          # React components
│   ├── Layout/         # Layout components
│   ├── Wallet/         # Wallet-related components
│   ├── Tokens/         # Token management components
│   ├── Swap/           # Swap interface components
│   └── Liquidity/      # Liquidity management components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
│   ├── contracts.ts    # Contract interaction utilities
│   ├── calculations.ts # AMM calculation functions
│   └── constants.ts    # Contract addresses and constants
├── types/              # TypeScript type definitions
│   └── ethers-contracts/ # TypeChain generated types
└── styles/             # Global styles
```

## Development

The project uses TypeChain for type-safe contract interactions. All contract calls should use the generated types from `src/types/ethers-contracts/`.

## Deployment

The application is configured for deployment on Cloudflare Workers. Build the project with:

```bash
npm run build
```
