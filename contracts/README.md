# ✅ READY TO DEPLOY!

## 🎉 Setup Complete!

Your contracts are ready to deploy. All dependencies are installed!

---

## 🔐 STEP 1: Add Your Private Key (Required)

**Open:** `backend/.env`

**Add your wallet's private key on line 21:**
```env
DEPLOYER_PRIVATE_KEY=0xYourPrivateKeyHere
```

### How to Get Your Private Key:

#### Coinbase Wallet:
1. Open Coinbase Wallet app/extension
2. Click Settings → Show private key
3. Enter password
4. Copy the key (starts with `0x`)

#### MetaMask:
1. Click account menu (top right)
2. Account details → Show private key  
3. Enter password
4. Copy the key (starts with `0x`)

⚠️ **IMPORTANT:** 
- This key stays in `.env` which is in `.gitignore` (safe!)
- Never share this key
- Use a testnet wallet (not your main wallet)

---

## ⛽ STEP 2: Get Test ETH (Free!)

You need Base Sepolia ETH for gas fees.

**Visit:** https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet

1. Enter your wallet address
2. Click "Send me ETH"
3. Wait 30 seconds

**You need:** ~0.01 ETH (free from faucet)

---

## 🚀 STEP 3: Deploy!

```powershell
npm run deploy
```

**That's it!** The script will:
- ✅ Deploy VeriScribeCertificate contract
- ✅ Deploy SkillSyncGigEscrow contract  
- ✅ Automatically update your frontend
- ✅ Save deployment addresses
- ✅ Show BaseScan links

**Expected output:**
```
🚀 Starting deployment to Base Sepolia...

📝 Deploying contracts with account: 0x123...
💰 Account balance: 0.05 ETH

🎓 Deploying VeriScribeCertificate...
✅ VeriScribeCertificate deployed to: 0xabc...

💼 Deploying SkillSyncGigEscrow...
✅ SkillSyncGigEscrow deployed to: 0xdef...

📝 Updating frontend contracts.ts...
✅ Frontend contracts updated!

🎉 DEPLOYMENT COMPLETE!
```

---

## ✨ STEP 4: Test Your App!

1. **Refresh your browser** (http://localhost:3002)
2. **Red warning banner will be GONE** ✅
3. **Try posting a gig** - it works!
4. **Issue a certificate** - transactions succeed!
5. **Check BaseScan** to see your contracts

---

## 📋 Quick Checklist:

- [ ] Dependencies installed ✅ (already done!)
- [ ] Private key added to `backend/.env`
- [ ] Got test ETH from faucet
- [ ] Run `npm run deploy` in contracts folder
- [ ] Refresh browser
- [ ] Test the app!

---

## 🐛 Troubleshooting:

### "Insufficient funds"
**Fix:** Get more ETH from the faucet (link above)

### "Invalid private key"
**Fix:** Make sure it starts with `0x` in the `.env` file

### "Cannot find module"
**Fix:** You're in the wrong folder. Make sure you're in `contracts/` directory

---

## 🎯 Quick Commands:

```powershell
# Make sure you're in contracts folder
cd contracts

# Deploy (after adding private key)
npm run deploy

# View deployment history
ls deployments/
```

---

## 🔒 Security:

✅ Your `.env` file is in `.gitignore`
✅ Private key never leaves your computer
✅ Only deploying to testnet (safe)
✅ No mainnet funds at risk

---

## 📞 Need Help?

Common issues:
1. **No ETH?** → Get from faucet (step 2)
2. **Key not working?** → Check it starts with `0x`
3. **Deployment fails?** → Check terminal output for errors

---

## 🎊 After Deployment:

Your app will be **100% functional**:
- ✅ Post gigs with USDC escrow
- ✅ Issue certificate NFTs
- ✅ Mint Proof-of-Work NFTs
- ✅ All transactions on Base Sepolia blockchain

**Congratulations!** You're deploying real smart contracts! 🚀
