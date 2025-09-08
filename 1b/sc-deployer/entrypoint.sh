#!/bin/sh

set -e

echo "🚀 Starting smart contract deployment..."

# Wait for geth-init to complete prefunding
echo "⏳ Waiting for geth-init to complete prefunding..."
until [ -f "/shared/geth-init-complete" ]; do
  echo "Waiting for geth-init-complete file..."
  sleep 1
done
echo "✅ Prefunding completed, proceeding with deployment..."

# Clone the repository
echo "📥 Cloning repository..."
if [ -d "cohort-1-assignments-public" ]; then
    echo "Repository already exists, pulling latest changes..."
    cd cohort-1-assignments-public
    git pull origin main
else
    git clone https://github.com/jidankim/cohort-1-assignments-public.git
    cd cohort-1-assignments-public
fi

# Navigate to the 1a directory
cd 1a

# Install dependencies
echo "📦 Installing dependencies..."
forge install

# Build the project
echo "🔨 Building project..."
forge build

# Deploy the contracts
echo "🚀 Deploying MiniAMM contracts..."
forge script script/MiniAMM.s.sol:MiniAMMScript \
    --rpc-url http://geth:8545 \
    --private-key be44593f36ac74d23ed0e80569b672ac08fa963ede14b63a967d92739b0c8659 \
    --broadcast
    # verification does not work for now as local env does not have the testnet chain
    # --broadcast \
    # --verify

# Ensure jq is available for address extraction
if ! command -v jq >/dev/null 2>&1; then
  echo "📦 Installing jq..."
  if command -v apk >/dev/null 2>&1; then
    apk add --no-cache jq >/dev/null 2>&1 || true
  elif command -v apt-get >/dev/null 2>&1; then
    apt-get update >/dev/null 2>&1 || true
    apt-get install -y jq >/dev/null 2>&1 || true
  fi
fi

# Extract deployed addresses into a compact JSON file
echo "📝 Extracting deployed addresses..."
chmod +x /workspace/extract-addresses.sh || true
/workspace/extract-addresses.sh \
  /workspace/cohort-1-assignments-public/1a/broadcast/MiniAMM.s.sol/1337/run-latest.json \
  > /workspace/deployment-addresses.json || true

echo "✅ Deployment completed!"
echo ""
echo "📊 Deployment addresses written to: /workspace/deployment-addresses.json"
