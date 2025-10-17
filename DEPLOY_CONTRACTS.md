# 🚀 Deploy Your Contracts in 3 Steps

## Step 1: Install Dependencies (1 minute)

```powershell
cd contracts
npm install
```

Wait for installation to complete...

---

## Step 2: Add Your Private Key (30 seconds)

1. **Open:** `backend/.env`
2. **Find this line:** `DEPLOYER_PRIVATE_KEY=`
3. **Add your private key:**
   ```env
   DEPLOYER_PRIVATE_KEY=0xYourPrivateKeyHere
   ```

**Where to get your private key:**
- **Coinbase Wallet:** Settings → Show private key
- **MetaMask:** Account menu → Account details → Export private key

⚠️ **Important:** Your private key stays in `.env` which is already in `.gitignore` (safe!)

---

## Step 3: Deploy! (1 minute)

```powershell
npm run deploy
```

**Done!** 🎉

The script will:
- ✅ Deploy contracts to Base Sepolia
- ✅ Update your frontend automatically
- ✅ Show you the contract addresses

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

## 🎮 Test Your App:

1. **Refresh browser** (http://localhost:3002)
2. **Warning banner will be gone** ✅
3. **Try posting a gig** - it will work!
4. **Issue a certificate** - transactions succeed!

---

## ⚠️ Before Deploying:

### Need Test ETH?
Visit: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
- Enter your wallet address
- Click "Send me ETH"
- Wait 30 seconds

### Check Your Balance:
```powershell
# In contracts folder:
npx hardhat console --network baseSepolia
```
Then type:
```javascript
(await ethers.provider.getBalance(await (await ethers.getSigners())[0].getAddress())).toString()
```

---

## 🔥 That's It!

Just 3 commands:
```powershell
cd contracts
npm install
npm run deploy
```

Your contracts will be live and your app will work! 🚀
