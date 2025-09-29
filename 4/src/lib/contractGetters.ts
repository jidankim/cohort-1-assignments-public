'use client'

import { getProvider, getSigner } from './ethers'
import { MiniAMM__factory, MockERC20__factory } from '@/types/ethers-contracts'

export function getMockErc20Read(address: string) {
    const provider = getProvider()
    return MockERC20__factory.connect(address, provider)
}

export async function getMockErc20Write(address: string) {
    const signer = await getSigner()
    return MockERC20__factory.connect(address, signer)
}

export function getMiniAmmRead(address: string) {
    const provider = getProvider()
    return MiniAMM__factory.connect(address, provider)
}

export async function getMiniAmmWrite(address: string) {
    const signer = await getSigner()
    return MiniAMM__factory.connect(address, signer)
}


