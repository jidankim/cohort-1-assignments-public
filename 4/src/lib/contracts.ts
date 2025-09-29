import { ethers } from 'ethers';
import { MiniAMM__factory, MockERC20__factory } from '../types/ethers-contracts';
import { CONTRACT_ADDRESSES } from './constants';

// Contract factory functions
export const getMiniAMMContract = (provider: ethers.Provider) => {
    return MiniAMM__factory.connect(CONTRACT_ADDRESSES.MINI_AMM, provider);
};

export const getTokenAContract = (provider: ethers.Provider) => {
    return MockERC20__factory.connect(CONTRACT_ADDRESSES.TOKEN_A, provider);
};

export const getTokenBContract = (provider: ethers.Provider) => {
    return MockERC20__factory.connect(CONTRACT_ADDRESSES.TOKEN_B, provider);
};

// Contract getter functions
export const getTokenBalance = async (
    provider: ethers.Provider,
    tokenAddress: string,
    userAddress: string
): Promise<bigint> => {
    const tokenContract = MockERC20__factory.connect(tokenAddress, provider);
    return await tokenContract.balanceOf(userAddress);
};

export const getTokenAllowance = async (
    provider: ethers.Provider,
    tokenAddress: string,
    owner: string,
    spender: string
): Promise<bigint> => {
    const tokenContract = MockERC20__factory.connect(tokenAddress, provider);
    return await tokenContract.allowance(owner, spender);
};

export const getAMMReserves = async (provider: ethers.Provider) => {
    const ammContract = getMiniAMMContract(provider);
    const reserveA = await ammContract.xReserve();
    const reserveB = await ammContract.yReserve();
    return { reserveA, reserveB };
};

// Transaction helper functions
export const waitForTransaction = async (tx: ethers.TransactionResponse) => {
    return await tx.wait();
};

export const estimateGas = async (tx: ethers.TransactionRequest, provider: ethers.Provider) => {
    return await provider.estimateGas(tx);
};
