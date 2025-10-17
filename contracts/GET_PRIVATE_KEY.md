# 🔐 How to Get Your Private Key

## For Coinbase Wallet:

### Browser Extension:
1. Click Coinbase Wallet extension icon
2. Click Settings (gear icon)
3. Scroll to **"Developer Settings"**
4. Click **"Show private key"**
5. Enter password
6. Copy key (starts with `0x`)

### Mobile App:
1. Open Coinbase Wallet app
2. Tap Settings
3. Tap your wallet name
4. Tap **"Show private key"**
5. Enter PIN/password
6. Copy the key

---

## Alternative: Use Recovery Phrase

If you can't find the private key option:

### Step 1: Get Recovery Phrase
1. Settings → Security → Recovery phrase
2. Copy your 12 or 24 words

### Step 2: Convert to Private Key
```powershell
cd contracts
node scripts/get-private-key.js
```

Then paste your recovery phrase when prompted.

---

## For MetaMask:

1. Click account icon (top right)
2. Account details
3. **Export private key**
4. Enter password
5. Copy key

---

## ⚠️ Security Tips:

- ✅ Use a **separate wallet** for testnet development
- ✅ Only use testnet funds (Base Sepolia)
- ✅ Never share your private key
- ✅ The `.env` file is in `.gitignore` (safe)
- ❌ Don't use your main wallet with real funds

---

## 🎯 Quick Test Wallet Setup:

### Create a New Test Wallet:

1. **In Coinbase Wallet:**
   - Settings → Create new wallet
   - Name it "Base Sepolia Test"
   - Save recovery phrase
   - Get private key

2. **Get Test ETH:**
   - Copy the new wallet address
   - Visit: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
   - Claim free ETH

3. **Use for Deployment:**
   - Add private key to `backend/.env`
   - Deploy contracts
   - No risk to main wallet!

---

## 🚀 After Getting Your Key:

1. **Open:** `backend/.env`
2. **Add on line 21:**
   ```env
   DEPLOYER_PRIVATE_KEY=0xYourKeyHere
   ```
3. **Save file**
4. **Run deployment:**
   ```powershell
   cd contracts
   npm run deploy
   ```

---

## 📱 Can't Find Private Key Option?

Some wallet versions hide this feature for security. Options:

### Option A: Update Coinbase Wallet
- Update to latest version
- Private key option should appear

### Option B: Use Recovery Phrase Helper
```powershell
cd contracts
node scripts/get-private-key.js
```

### Option C: Create New Test Wallet
- Easier to access private key
- Separate from main funds
- Recommended for development

---

## ✅ Verification:

Private keys should:
- Start with `0x`
- Be 66 characters long (including `0x`)
- Look like: `0x1234567890abcdef...`

Example format:
```
0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcd
```

---

## 💡 Recommended Approach:

**Create a dedicated test wallet:**
1. Less risk
2. Easy private key access
3. Can get free testnet ETH
4. Deploy worry-free!

Then when deployment works, you can use a more secure setup for production.
