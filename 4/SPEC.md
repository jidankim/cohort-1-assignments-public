# MiniAMM UI Specification

## Project Overview
A Next.js frontend application for interacting with a MiniAMM (Automated Market Maker) contract. The application allows users to connect their wallet, manage MockERC20 tokens, and perform swaps and liquidity operations.

## Technology Stack
- **Frontend**: React + TypeScript + Next.js
- **Blockchain Interaction**: Ethers.js v6
- **Wallet Connection**: RainbowKit + Wagmi
- **Type Safety**: TypeChain (ethers-v6 target)
- **Hosting**: Cloudflare Workers

## Contract Information
- **Token A (MockERC20)**
  - Address: `0xa0e76cd25476dbe95d0d765177dcda102adadf1c`
  - Name: "Token A"
  - Symbol: "TKA"
  - Decimals: 18

- **Token B (MockERC20)**
  - Address: `0xcb6b1cba0f5145b0444216bd5d6fff665c2fcae6`
  - Name: "Token B"
  - Symbol: "TKB"
  - Decimals: 18

- **MiniAMM Pair**
  - Address: `0xe3b885987bce1f5c32d9ce824e97d200db96e266`

## Features to Implement

### 1. Wallet Connection ✅
- [x] Implement RainbowKit wallet connection
- [x] Support multiple wallet providers (MetaMask, WalletConnect, etc.)
- [x] Display connected wallet address
- [x] Handle wallet disconnection
- [x] Show connection status and network information

### 2. Token Management
- [x] **Token Minting**
  - [x] Create UI for minting MockERC20 tokens
  - [x] Input field for mint amount
  - [x] Separate mint buttons for Token A and Token B
  - [x] Handle minting transactions with loading states

- [x] **Token Approval**
  - [x] Create approval interface for both tokens
  - [x] Input field for approval amount
  - [x] Approve MiniAMM contract to spend tokens
  - [x] Show current allowance vs required allowance
  - [x] Handle approval transactions with loading states

### 3. Token Balance Display
- [x] **Wallet Balances**
  - [x] Display Token A balance in connected wallet
  - [x] Display Token B balance in connected wallet
  - [x] Real-time balance updates after transactions

- [x] **Contract Balances**
  - [x] Display Token A balance in MiniAMM contract
  - [x] Display Token B balance in MiniAMM contract
  - [x] Show total liquidity in the AMM

### 4. Swap Interface
- [x] **Token Selection** (Unified)
  - [x] Token selectors embedded in the amount cards (From/To)
  - [x] Switch button to swap From/To tokens
  - [x] Prevent selecting the same token for both sides

- [x] **Amount Input** (Unified)
  - [x] From card: amount input for selected token (with Max)
  - [x] To card: read-only calculated amount for selected token
  - [x] Input validation (positive numbers, sufficient balance)
  - [x] Real-time recalculation based on reserves

- [x] **Price Calculation**
  - [x] Implement constant product formula: `x * y = k`
  - [x] Calculate output amount based on input
  - [x] Show price impact and slippage (min received, impact color-coded)
  - [x] Handle edge cases (insufficient liquidity, validation guards)

- [x] **Swap Execution**
  - [x] Swap button with proper state management
  - [x] Loading indicator during transaction
  - [x] Disable button during transaction
  - [x] Success/error notifications
  - [x] Update balances after successful swap

### 5. Liquidity Management
- [x] **Add Liquidity**
  - [x] Input fields for both token amounts
  - [x] Calculate optimal ratio based on current reserves (hint displayed)
  - [x] Show estimated LP tokens to receive
  - [x] Handle add liquidity transaction
  - [x] Loading states and error handling

- [x] **Remove Liquidity**
  - [x] Input field for LP token amount to burn
  - [x] Show estimated token amounts to receive (simplified/optional)
  - [x] Handle remove liquidity transaction
  - [x] Loading states and error handling

### 6. UI/UX Requirements
- [x] **Responsive Design**
  - [x] Mobile-friendly layout
  - [x] Desktop-optimized interface
  - [x] Consistent styling and spacing

- [x] **Loading States**
  - [x] Button loading indicators
  - [x] Transaction pending states
  - [x] Disable interactions during transactions

- [x] **Error Handling**
  - [x] Transaction failure notifications
  - [x] Insufficient balance warnings
  - [x] Network error handling
  - [x] User-friendly error messages

- [x] **Real-time Updates**
  - [x] Refresh balances after transactions
  - [x] Update swap calculations on input change
  - [x] Sync with blockchain state

## Technical Implementation

### 1. Project Structure
```
src/
├── components/
│   ├── Wallet/
│   │   ├── ConnectButton.tsx
│   │   └── WalletInfo.tsx
│   ├── Tokens/
│   │   ├── TokenBalance.tsx
│   │   ├── TokenMint.tsx
│   │   └── TokenApproval.tsx
│   ├── Swap/
│   │   ├── SwapInterface.tsx
│   │   ├── TokenSelector.tsx
│   │   └── AmountInput.tsx
│   ├── Liquidity/
│   │   ├── AddLiquidity.tsx
│   │   └── RemoveLiquidity.tsx
│   └── Layout/
│       ├── Header.tsx
│       └── MainLayout.tsx
├── hooks/
│   ├── useTokenBalance.ts
│   ├── useSwapCalculation.ts
│   └── useLiquidityCalculation.ts
├── lib/
│   ├── contracts.ts
│   ├── calculations.ts
│   └── constants.ts
└── types/
    └── ethers-contracts/
        ├── MiniAMM.ts
        └── MockERC20.ts
```

### 2. Key Hooks to Implement
- [ ] `useTokenBalance(address, tokenAddress)` - Get token balance
- [ ] `useSwapCalculation(inputAmount, tokenIn, tokenOut)` - Calculate swap output
- [ ] `useLiquidityCalculation(tokenA, tokenB)` - Calculate liquidity ratios
- [ ] `useTransactionStatus(txHash)` - Track transaction status

### 3. Contract Interaction
- [ ] Use TypeChain generated types exclusively
- [ ] Implement proper error handling for contract calls
- [ ] Handle gas estimation and transaction confirmation
- [ ] Implement retry logic for failed transactions

### 4. State Management
- [ ] Use React hooks for local state
- [ ] Implement context for global app state if needed
- [ ] Cache contract data appropriately
- [ ] Handle wallet connection state

## Testing Requirements
- [ ] Unit tests for calculation functions
- [ ] Integration tests for contract interactions
- [ ] UI component tests
- [ ] End-to-end testing for complete user flows

## Deployment
- [ ] Configure for Cloudflare Workers deployment
- [ ] Environment variables for contract addresses
- [ ] Production build optimization
- [ ] Error monitoring and logging

## Success Criteria
- [ ] Users can connect/disconnect wallet seamlessly
- [ ] All token operations (mint, approve, swap, liquidity) work correctly
- [ ] UI is responsive and user-friendly
- [ ] All calculations are accurate and match contract behavior
- [ ] Error handling is comprehensive and user-friendly
- [ ] Application is production-ready and deployable

## Notes
- All contract interactions must use TypeChain generated types
- Implement proper loading states for all async operations
- Ensure all calculations match the constant product formula
- Handle edge cases like insufficient liquidity or balance
- Maintain type safety throughout the application
