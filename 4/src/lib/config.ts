'use client'

export const config = {
    network: {
        rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'http://localhost:8545'
    },
    addresses: {
        tokenA: process.env.NEXT_PUBLIC_TOKEN0_ADDRESS || '0xa0e76cd25476dbe95d0d765177dcda102adadf1c',
        tokenB: process.env.NEXT_PUBLIC_TOKEN1_ADDRESS || '0xcb6b1cba0f5145b0444216bd5d6fff665c2fcae6',
        miniAmm: process.env.NEXT_PUBLIC_MINI_AMM_ADDRESS || '0xe3b885987bce1f5c32d9ce824e97d200db96e266'
    }
}


