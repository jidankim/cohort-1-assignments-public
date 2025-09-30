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
- [x] **Token Selection**
  - [x] Dropdown/selector to choose which token to sell
  - [x] Dropdown/selector to choose which token to buy
  - [x] Prevent selecting the same token for both sides

- [ ] **Amount Input**
  - [ ] Input field for amount to sell
  - [ ] Input field for amount to buy (read-only, calculated)
  - [ ] Input validation (positive numbers, sufficient balance)
  - [ ] Max button to use full balance

- [ ] **Price Calculation**
  - [ ] Implement constant product formula: `x * y = k`
  - [ ] Calculate output amount based on input
  - [ ] Show price impact and slippage
  - [ ] Handle edge cases (insufficient liquidity, etc.)

- [ ] **Swap Execution**
  - [ ] Swap button with proper state management
  - [ ] Loading indicator during transaction
  - [ ] Disable button during transaction
  - [ ] Success/error notifications
  - [ ] Update balances after successful swap

### 5. Liquidity Management
- [ ] **Add Liquidity**
  - [ ] Input fields for both token amounts
  - [ ] Calculate optimal ratio based on current reserves
  - [ ] Show estimated LP tokens to receive
  - [ ] Handle add liquidity transaction
  - [ ] Loading states and error handling

- [ ] **Remove Liquidity**
  - [ ] Input field for LP token amount to burn
  - [ ] Show estimated token amounts to receive
  - [ ] Handle remove liquidity transaction
  - [ ] Loading states and error handling

### 6. UI/UX Requirements
- [ ] **Responsive Design**
  - [ ] Mobile-friendly layout
  - [ ] Desktop-optimized interface
  - [ ] Consistent styling and spacing

- [ ] **Loading States**
  - [ ] Button loading indicators
  - [ ] Transaction pending states
  - [ ] Disable interactions during transactions

- [ ] **Error Handling**
  - [ ] Transaction failure notifications
  - [ ] Insufficient balance warnings
  - [ ] Network error handling
  - [ ] User-friendly error messages

- [ ] **Real-time Updates**
  - [ ] Refresh balances after transactions
  - [ ] Update swap calculations on input change
  - [ ] Sync with blockchain state

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
