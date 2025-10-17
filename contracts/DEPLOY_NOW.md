# 🚀 Quick Deployment Guide

## Step-by-Step Deployment (5 minutes)

### 1. Install Dependencies
```powershell
cd contracts
npm install
```

### 2. Set Up Your Private Key

Add this to `backend/.env`:
```env
# Deployment Wallet Private Key (KEEP SECRET!)
DEPLOYER_PRIVATE_KEY=your_private_key_here

# Optional: BaseScan API key for contract verification
BASESCAN_API_KEY=your_basescan_api_key
```

**⚠️ IMPORTANT: Never commit your private key to git!**

**How to get your private key:**
1. Open MetaMask/Coinbase Wallet
2. Click account menu → Account details → Show private key
3. Enter password and copy key
4. Paste in `.env` file

### 3. Get Test ETH

You need ETH on Base Sepolia for gas fees:
1. Go to: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
2. Enter your wallet address
3. Claim test ETH (free)

### 4. Deploy!

```powershell
npm run deploy
```

**That's it!** The script will:
- ✅ Deploy both contracts to Base Sepolia
- ✅ Automatically update your frontend with addresses
- ✅ Save deployment info to `deployments/` folder
- ✅ Show you BaseScan links to view contracts

### 5. Refresh Your Browser

Open your app (http://localhost:3002) and refresh. The red warning will be gone and transactions will work!

---

## ✅ What You'll See:

```
🚀 Starting deployment to Base Sepolia...

📝 Deploying contracts with account: 0x123...
💰 Account balance: 0.5 ETH

🎓 Deploying VeriScribeCertificate...
✅ VeriScribeCertificate deployed to: 0xabc...

💼 Deploying SkillSyncGigEscrow...
✅ SkillSyncGigEscrow deployed to: 0xdef...

📝 Updating frontend contracts.ts...
✅ Frontend contracts updated!

🎉 DEPLOYMENT COMPLETE!
```

---

## 🐛 Troubleshooting:

### Error: "insufficient funds"
**Solution:** Get more test ETH from the faucet (step 3)

### Error: "invalid private key"
**Solution:** Check your `.env` file has the correct format:
```env
DEPLOYER_PRIVATE_KEY=0x1234567890abcdef...
```
(Should start with `0x`)

### Error: "network not found"
**Solution:** Check `hardhat.config.js` exists and has Base Sepolia config

---

## 📦 What Gets Deployed:

1. **VeriScribeCertificate.sol**
   - Soulbound NFT certificates
   - Institution verification system
   - Certificate revocation

2. **SkillSyncGigEscrow.sol**
   - USDC escrow for gigs
   - Gig management (create, accept, complete)
   - Proof-of-Work NFT minting
   - 2% platform fee

---

## 🎯 After Deployment:

Your app will automatically:
- ✅ Connect to deployed contracts
- ✅ Show correct contract addresses
- ✅ Enable all blockchain features
- ✅ Remove warning banners

**Test it:**
1. Post a gig with USDC
2. Issue a certificate NFT
3. Complete a gig and mint POW NFT

All transactions will now work on Base Sepolia! 🎉

---

## 🔒 Security Notes:

- ✅ `.env` is in `.gitignore` - your key is safe
- ✅ Only use testnet keys for development
- ✅ Never share your private key
- ✅ Use a separate wallet for deployment

---

## 📱 Quick Commands:

```powershell
# Install dependencies
cd contracts
npm install

# Deploy to Base Sepolia
npm run deploy

# Verify contracts on BaseScan (optional)
npm run verify
```

Done! Your contracts are live! 🚀
