// Contract addresses
export const CONTRACT_ADDRESSES = {
    TOKEN_A: '0xa0e76cd25476dbe95d0d765177dcda102adadf1c',
    TOKEN_B: '0xcb6b1cba0f5145b0444216bd5d6fff665c2fcae6',
    MINI_AMM: '0xe3b885987bce1f5c32d9ce824e97d200db96e266',
} as const;

// Token information
export const TOKEN_INFO = {
    TOKEN_A: {
        address: CONTRACT_ADDRESSES.TOKEN_A,
        name: 'Token A',
        symbol: 'TKA',
        decimals: 18,
    },
    TOKEN_B: {
        address: CONTRACT_ADDRESSES.TOKEN_B,
        name: 'Token B',
        symbol: 'TKB',
        decimals: 18,
    },
} as const;

// Network configuration
export const NETWORK_CONFIG = {
    chainId: 114, // Flare2 Coston testnet
    name: 'Flare2 Coston Testnet',
    rpcUrl: 'https://coston2-api.flare.network/ext/bc/C/rpc',
} as const;

// UI constants
export const UI_CONSTANTS = {
    MAX_SLIPPAGE: 0.5, // 0.5%
    MIN_LIQUIDITY: 1000, // Minimum liquidity amount
    DECIMAL_PLACES: 6, // Number of decimal places to show
} as const;
