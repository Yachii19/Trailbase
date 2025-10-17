# 🚀 Quick Contract Deployment Fix

## Why "Something went wrong" appears:

The smart contracts (`VeriScribeCertificate.sol` and `SkillSyncGigEscrow.sol`) haven't been deployed to Base blockchain yet. The app is trying to interact with address `0x000...` which doesn't exist.

## ⚡ Quick Fix Options:

### Option 1: Deploy to Base Sepolia (Recommended for Testing)

1. **Install Hardhat:**
   ```powershell
   cd contracts
   npm init -y
   npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
   npx hardhat
   ```

2. **Create deployment script:**
   Create `contracts/scripts/deploy.js`:
   ```javascript
   async function main() {
     // Deploy VeriScribe Certificate
     const VeriScribe = await ethers.getContractFactory("VeriScribeCertificate");
     const veriScribe = await VeriScribe.deploy();
     await veriScribe.deployed();
     console.log("VeriScribe deployed to:", veriScribe.address);

     // Deploy SkillSync Gig Escrow
     const usdcAddress = "0x036CbD53842c5426634e7929541eC2318f3dCF7e"; // Base Sepolia USDC
     const SkillSync = await ethers.getContractFactory("SkillSyncGigEscrow");
     const skillSync = await SkillSync.deploy(usdcAddress);
     await skillSync.deployed();
     console.log("SkillSync deployed to:", skillSync.address);
   }

   main().catch((error) => {
     console.error(error);
     process.exitCode = 1;
   });
   ```

3. **Deploy:**
   ```powershell
   npx hardhat run scripts/deploy.js --network baseSepolia
   ```

4. **Update addresses in `src/lib/contracts.ts`:**
   ```typescript
   export const CERTIFICATE_CONTRACT_ADDRESS = '0xYourDeployedAddress';
   export const GIG_ESCROW_CONTRACT_ADDRESS = '0xYourDeployedAddress';
   ```

---

### Option 2: Use Mock Mode (Quick Testing)

For now, you can test the UI without actual blockchain transactions:

1. **Backend Database Testing:**
   - Post gigs and certificates to MongoDB
   - Test the UI flow
   - View data in admin panel

2. **Test Backend API:**
   ```powershell
   # Create a test gig
   $gig = @{
     clientAddress = "0x123..."
     title = "Test Gig"
     description = "Test description"
     budget = 500
     deadline = "2025-10-24T00:00:00.000Z"
     skillsRequired = @("React", "TypeScript")
     contractGigId = 1
   } | ConvertTo-Json

   curl -Method POST -Uri "http://localhost:5000/api/gigs" -Body $gig -ContentType "application/json"
   ```

---

### Option 3: Use Remix IDE (Fastest)

1. **Go to [Remix IDE](https://remix.ethereum.org/)**

2. **Copy contract files:**
   - Upload `VeriScribeCertificate.sol`
   - Upload `SkillSyncGigEscrow.sol`

3. **Compile:**
   - Select Solidity 0.8.20
   - Click "Compile"

4. **Deploy:**
   - Switch to "Deploy & Run" tab
   - Select "Injected Provider - MetaMask"
   - Make sure you're on Base Sepolia network
   - Deploy both contracts
   - Copy deployed addresses

5. **Update `src/lib/contracts.ts`** with deployed addresses

---

## 🎯 What Works Without Deployment:

While contracts aren't deployed, you can still test:

✅ **VeriScribe:**
- Submit verification requests
- Admin panel approval workflow
- View pending/approved institutions
- MongoDB backend integration

✅ **SkillSync:**
- Browse mock gigs (hardcoded in UI)
- View gig details
- Test UI/UX flow
- Backend API testing

❌ **What Won't Work:**
- Actual blockchain transactions
- Minting NFTs
- USDC transfers
- On-chain gig creation

---

## 🔥 Recommended Next Steps:

1. **First:** Test the app UI and backend without blockchain
2. **Then:** Deploy contracts to Base Sepolia using Option 3 (Remix)
3. **Finally:** Update contract addresses and test full flow

---

## 💡 Getting Test USDC:

After deployment, you'll need USDC on Base Sepolia:

1. Get test ETH from [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
2. Use test USDC at `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
3. Or deploy a mock ERC20 token for testing

---

## ✅ Current Status:

- ✅ Frontend UI working
- ✅ Backend API working
- ✅ MongoDB connected
- ✅ Admin panel functional
- ⚠️ Contracts not deployed (this is what needs fixing)

The warning banner in the app will disappear once you deploy and update the contract addresses!
