# SkillSync Pro - Complete Integration Guide

## 🎯 Overview

This guide covers the complete setup and integration of SkillSync Pro, including smart contracts, MongoDB backend, and frontend.

---

## 📦 Part 1: Smart Contract Deployment

### Prerequisites
- Node.js v18+
- Hardhat or Foundry
- Base wallet with ETH for gas
- Base RPC URL

### Step 1: Install Dependencies

```bash
cd contracts
npm init -y
npm install --save-dev hardhat @openzeppelin/contracts @nomicfoundation/hardhat-toolbox
```

### Step 2: Initialize Hardhat

```bash
npx hardhat init
```

### Step 3: Configure Hardhat

Create `hardhat.config.js`:

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    baseSepolia: {
      url: "https://sepolia.base.org",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 84532
    },
    base: {
      url: "https://mainnet.base.org",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 8453
    }
  },
  etherscan: {
    apiKey: {
      baseSepolia: process.env.BASESCAN_API_KEY,
      base: process.env.BASESCAN_API_KEY
    },
    customChains: [
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org"
        }
      }
    ]
  }
};
```

### Step 4: Create Deploy Script

Create `scripts/deploy.js`:

```javascript
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy VeriScribe Certificate Contract
  const VeriScribeCertificate = await hre.ethers.getContractFactory("VeriScribeCertificate");
  const certificate = await VeriScribeCertificate.deploy();
  await certificate.deployed();
  console.log("VeriScribeCertificate deployed to:", certificate.address);

  // Deploy SkillSync Gig Escrow Contract
  const usdcAddress = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"; // Base Mainnet USDC
  const platformWallet = deployer.address; // Or specify platform wallet
  
  const SkillSyncGigEscrow = await hre.ethers.getContractFactory("SkillSyncGigEscrow");
  const gigEscrow = await SkillSyncGigEscrow.deploy(usdcAddress, platformWallet);
  await gigEscrow.deployed();
  console.log("SkillSyncGigEscrow deployed to:", gigEscrow.address);

  // Verify contracts (optional)
  console.log("\nVerifying contracts...");
  await hre.run("verify:verify", {
    address: certificate.address,
    constructorArguments: [],
  });

  await hre.run("verify:verify", {
    address: gigEscrow.address,
    constructorArguments: [usdcAddress, platformWallet],
  });

  console.log("\n✅ Deployment complete!");
  console.log("Save these addresses to your .env file:");
  console.log(`NEXT_PUBLIC_CERTIFICATE_CONTRACT_ADDRESS=${certificate.address}`);
  console.log(`NEXT_PUBLIC_GIG_ESCROW_CONTRACT_ADDRESS=${gigEscrow.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

### Step 5: Deploy to Base Sepolia (Testnet)

```bash
npx hardhat run scripts/deploy.js --network baseSepolia
```

### Step 6: Deploy to Base Mainnet

```bash
npx hardhat run scripts/deploy.js --network base
```

---

## 🗄️ Part 2: MongoDB Backend Setup

### Step 1: Install MongoDB

**Option A: Local Installation**
- Download from https://www.mongodb.com/try/download/community
- Install and start MongoDB service

**Option B: MongoDB Atlas (Cloud)**
- Create account at https://www.mongodb.com/cloud/atlas
- Create free cluster
- Get connection string

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 3: Configure Environment

Create `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skillsync
# OR use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skillsync

NODE_ENV=development

# Contract Addresses (from deployment)
CERTIFICATE_CONTRACT_ADDRESS=0xYourCertificateContractAddress
GIG_ESCROW_CONTRACT_ADDRESS=0xYourGigEscrowContractAddress
USDC_CONTRACT_ADDRESS=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913

# Base RPC
BASE_RPC_URL=https://mainnet.base.org
BASE_CHAIN_ID=8453

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3002

# Admin wallet (for backend operations)
ADMIN_PRIVATE_KEY=your_admin_private_key_here
```

### Step 4: Start Backend Server

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

Backend will run on `http://localhost:5000`

### Step 5: Test Backend

```bash
# Health check
curl http://localhost:5000/health

# Get user
curl http://localhost:5000/api/users/0xYourWalletAddress

# Get gigs
curl http://localhost:5000/api/gigs
```

---

## 🎨 Part 3: Frontend Integration

### Step 1: Update Frontend Environment

Create/update `.env.local` in the root directory:

```env
# Smart Contract Addresses
NEXT_PUBLIC_CERTIFICATE_CONTRACT_ADDRESS=0xYourCertificateContract
NEXT_PUBLIC_GIG_ESCROW_CONTRACT_ADDRESS=0xYourGigEscrowContract
NEXT_PUBLIC_USDC_CONTRACT_ADDRESS=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Base Network
NEXT_PUBLIC_BASE_CHAIN_ID=8453

# OnchainKit
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key
NEXT_PUBLIC_ONCHAINKIT_PROJECT_ID=your_project_id
```

### Step 2: Update Contract Configuration

Replace `src/lib/contracts.ts` with `src/lib/contractsNew.ts`:

```bash
cd src/lib
rm contracts.ts
mv contractsNew.ts contracts.ts
```

### Step 3: Install Frontend Dependencies (if needed)

```bash
npm install ethers@^6.9.0 axios
```

### Step 4: Start Frontend

```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

---

## 🔧 Part 4: Integration Testing

### Test VeriScribe Module

1. **Connect Wallet** (must be on Base network)
2. **Request Institution Verification**
   - Fill in institution details
   - Submit verification request
   - Wait for admin approval

3. **Admin Approval** (from admin wallet)
   - Go to Admin Panel
   - Approve pending institutions
   - Transaction will verify on-chain

4. **Issue Certificate**
   - Fill in student details
   - Generate metadata
   - Mint NFT certificate
   - Check transaction on BaseScan

### Test SkillSync Module

1. **As Client - Post Gig**
   - Fill in gig details
   - Approve USDC spending
   - Post gig with escrow
   - USDC locked in contract

2. **As Freelancer - Accept Gig**
   - Browse open gigs
   - Accept a gig
   - Status changes to "Accepted"

3. **As Client - Release Payment**
   - Mark gig as complete
   - Release payment
   - Two actions in one transaction:
     - USDC sent to freelancer
     - Proof-of-Work NFT minted

---

## 📱 Part 5: API Integration Examples

### Post Gig to Database (after blockchain transaction)

```typescript
const response = await fetch(`${API_URL}/gigs`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    gigId: gigId.toString(),
    client: clientAddress,
    title: "Build React App",
    description: "Need a developer...",
    category: "development",
    skills: ["React", "TypeScript"],
    amount: 100000000, // 100 USDC (6 decimals)
    deadline: new Date('2025-12-31').toISOString(),
    transactionHash: txHash
  })
});
```

### Mint Certificate and Save Metadata

```typescript
// 1. Generate metadata
const metadataResponse = await fetch(`${API_URL}/metadata/certificate`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    institutionName: "MIT",
    courseName: "Introduction to CS",
    studentName: "John Doe",
    studentAddress: "0x...",
    dateIssued: new Date().toISOString(),
    certificateType: "course",
    description: "Completed with honors"
  })
});

// 2. Upload metadata to IPFS (implement with Pinata/Web3.Storage)
const metadataURI = `ipfs://${ipfsHash}`;

// 3. Mint certificate
const tx = await certificateContract.mintCertificate(
  studentAddress,
  institutionName,
  courseName,
  certificateType,
  metadataURI
);

// 4. Save to database
await fetch(`${API_URL}/certificates`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    tokenId: tokenId.toString(),
    student: studentAddress,
    institution: institutionAddress,
    institutionName,
    courseName,
    certificateType,
    metadata: metadata,
    transactionHash: tx.hash
  })
});
```

---

## 🚀 Part 6: Deployment to Production

### Deploy Backend to Railway/Render/Fly.io

1. Push code to GitHub
2. Connect to Railway/Render
3. Add environment variables
4. Deploy

### Deploy Frontend to Vercel

```bash
npm run build
vercel --prod
```

Or connect GitHub repo to Vercel dashboard

### Update CORS and API URLs

Update `.env` with production URLs:
```env
CORS_ORIGIN=https://your-app.vercel.app
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
```

---

## 🔐 Security Checklist

- [ ] Never commit private keys to Git
- [ ] Use environment variables for all secrets
- [ ] Add authentication middleware to backend
- [ ] Rate limit API endpoints
- [ ] Validate all user inputs
- [ ] Add admin role checks for sensitive operations
- [ ] Use HTTPS in production
- [ ] Audit smart contracts before mainnet deployment
- [ ] Set up monitoring and error tracking

---

## 📊 Monitoring

### Track Events from Smart Contracts

```javascript
// Listen for certificate minting
certificateContract.on("CertificateIssued", (tokenId, student, institution, courseName) => {
  console.log(`Certificate ${tokenId} issued to ${student}`);
  // Update database, send notifications, etc.
});

// Listen for gig completion
gigContract.on("GigCompleted", (gigId, freelancer, proofTokenId) => {
  console.log(`Gig ${gigId} completed, POW NFT ${proofTokenId} minted`);
});
```

---

## 🆘 Troubleshooting

### Frontend Issues
- **Wallet not connecting**: Check network (must be Base)
- **Transaction failing**: Check gas, USDC balance, contract addresses
- **Module not found**: Run `npm install`, restart dev server

### Backend Issues
- **MongoDB connection failed**: Check MongoDB service, connection string
- **CORS errors**: Add frontend URL to CORS_ORIGIN
- **Routes not found**: Check server.js routes setup

### Contract Issues
- **Verification failed**: Check institution is verified on-chain
- **USDC transfer failed**: Check approval first
- **NFT not minting**: Check contract has permissions

---

## 📚 Resources

- Base Docs: https://docs.base.org
- OnchainKit: https://onchainkit.xyz
- Wagmi: https://wagmi.sh
- MongoDB: https://docs.mongodb.com
- Hardhat: https://hardhat.org

---

## ✅ Success Criteria

You'll know everything is working when:
- ✅ Smart contracts deployed and verified on BaseScan
- ✅ Backend running and MongoDB connected
- ✅ Frontend connects to wallet on Base
- ✅ Can approve institutions (admin)
- ✅ Can mint certificates (institutions)
- ✅ Can post gigs with USDC escrow
- ✅ Can complete gigs and mint POW NFTs
- ✅ All data syncing between blockchain and MongoDB

Happy Building! 🚀
