import { ethers } from 'ethers';

// Constant product formula: x * y = k
// For a swap: (x + Δx) * (y - Δy) = x * y
// Solving for Δy: Δy = (y * Δx) / (x + Δx)

export interface SwapCalculation {
    inputAmount: bigint;
    outputAmount: bigint;
    priceImpact: number;
    minimumOutput: bigint;
}

export interface LiquidityCalculation {
    tokenAAmount: bigint;
    tokenBAmount: bigint;
    lpTokens: bigint;
}

/**
 * Calculate the output amount for a token swap using constant product formula
 * @param inputAmount - Amount of input token
 * @param inputReserve - Reserve of input token in the AMM
 * @param outputReserve - Reserve of output token in the AMM
 * @returns SwapCalculation object with output amount and price impact
 */
export const calculateSwapOutput = (
    inputAmount: bigint,
    inputReserve: bigint,
    outputReserve: bigint
): SwapCalculation => {
    if (inputAmount <= 0n || inputReserve <= 0n || outputReserve <= 0n) {
        return {
            inputAmount: 0n,
            outputAmount: 0n,
            priceImpact: 0,
            minimumOutput: 0n,
        };
    }

    // Constant product formula: (x + Δx) * (y - Δy) = x * y
    // Solving for Δy: Δy = (y * Δx) / (x + Δx)
    const numerator = outputReserve * inputAmount;
    const denominator = inputReserve + inputAmount;
    const outputAmount = numerator / denominator;

    // Calculate price impact
    const priceBefore = Number(outputReserve) / Number(inputReserve);
    const priceAfter = Number(outputReserve - outputAmount) / Number(inputReserve + inputAmount);
    const priceImpact = ((priceAfter - priceBefore) / priceBefore) * 100;

    // Calculate minimum output with 0.5% slippage tolerance
    const minimumOutput = (outputAmount * 995n) / 1000n;

    return {
        inputAmount,
        outputAmount,
        priceImpact,
        minimumOutput,
    };
};

/**
 * Calculate the optimal token amounts for adding liquidity
 * @param tokenAAmount - Desired amount of token A
 * @param tokenBAmount - Desired amount of token B
 * @param tokenAReserve - Current reserve of token A in AMM
 * @param tokenBReserve - Current reserve of token B in AMM
 * @returns LiquidityCalculation with optimal amounts
 */
export const calculateLiquidityAmounts = (
    tokenAAmount: bigint,
    tokenBAmount: bigint,
    tokenAReserve: bigint,
    tokenBReserve: bigint
): LiquidityCalculation => {
    if (tokenAReserve === 0n || tokenBReserve === 0n) {
        // First liquidity provision - use provided amounts
        return {
            tokenAAmount,
            tokenBAmount,
            lpTokens: tokenAAmount + tokenBAmount, // Simplified for first provision
        };
    }

    // Calculate optimal ratio
    const ratioA = Number(tokenAReserve) / Number(tokenBReserve);
    const ratioB = Number(tokenBReserve) / Number(tokenAReserve);

    let optimalTokenA: bigint;
    let optimalTokenB: bigint;

    if (Number(tokenAAmount) / Number(tokenBAmount) > ratioA) {
        // Too much token A, adjust token A amount
        optimalTokenB = tokenBAmount;
        optimalTokenA = BigInt(Math.floor(Number(tokenBAmount) * ratioA));
    } else {
        // Too much token B, adjust token B amount
        optimalTokenA = tokenAAmount;
        optimalTokenB = BigInt(Math.floor(Number(tokenAAmount) * ratioB));
    }

    // Calculate LP tokens based on the smaller of the two ratios
    const lpTokens = (optimalTokenA * tokenAReserve) / tokenAReserve;

    return {
        tokenAAmount: optimalTokenA,
        tokenBAmount: optimalTokenB,
        lpTokens,
    };
};

/**
 * Calculate the amount of tokens to receive when removing liquidity
 * @param lpTokenAmount - Amount of LP tokens to burn
 * @param totalLPTokens - Total supply of LP tokens
 * @param tokenAReserve - Current reserve of token A
 * @param tokenBReserve - Current reserve of token B
 * @returns Object with token amounts to receive
 */
export const calculateRemoveLiquidity = (
    lpTokenAmount: bigint,
    totalLPTokens: bigint,
    tokenAReserve: bigint,
    tokenBReserve: bigint
): { tokenAAmount: bigint; tokenBAmount: bigint } => {
    if (totalLPTokens === 0n) {
        return { tokenAAmount: 0n, tokenBAmount: 0n };
    }

    const tokenAAmount = (lpTokenAmount * tokenAReserve) / totalLPTokens;
    const tokenBAmount = (lpTokenAmount * tokenBReserve) / totalLPTokens;

    return { tokenAAmount, tokenBAmount };
};

/**
 * Format token amount for display
 * @param amount - Token amount in wei
 * @param decimals - Token decimals
 * @param displayDecimals - Number of decimal places to show
 * @returns Formatted string
 */
export const formatTokenAmount = (
    amount: bigint,
    decimals: number = 18,
    displayDecimals: number = 6
): string => {
    const divisor = BigInt(10 ** decimals);
    const wholePart = amount / divisor;
    const fractionalPart = amount % divisor;

    if (fractionalPart === 0n) {
        return wholePart.toString();
    }

    const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
    const displayFractional = fractionalStr.substring(0, displayDecimals);

    return `${wholePart}.${displayFractional}`;
};

/**
 * Parse token amount from string input
 * @param input - String input from user
 * @param decimals - Token decimals
 * @returns BigInt amount in wei
 */
export const parseTokenAmount = (input: string, decimals: number = 18): bigint => {
    if (!input || input === '') return 0n;

    const [wholePart, fractionalPart = ''] = input.split('.');
    const paddedFractional = fractionalPart.padEnd(decimals, '0').substring(0, decimals);

    return BigInt(wholePart + paddedFractional);
};
