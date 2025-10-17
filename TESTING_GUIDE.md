# SkillSync Pro - Complete Testing Guide

## Quick Start Testing

### Step 1: Get Your Wallet Address as Admin

1. **Connect your wallet** to the app (Coinbase Wallet recommended)
2. **Copy your wallet address** from the wallet UI
3. **Add yourself as admin**:
   - Open `src/lib/verification.ts`
   - Find the `ADMIN_ADDRESSES` array (around line 28)
   - Add your wallet address:
   ```typescript
   const ADMIN_ADDRESSES = [
     '0xAdminWallet1234567890123456789012345678901',
     '0xYourActualWalletAddressHere', // <-- Add your address
   ];
   ```
4. **Save the file** - the dev server will auto-reload

### Step 2: Start Both Servers

#### Terminal 1 - Backend Server
```powershell
cd backend
npm run dev
```
Expected output: `Server running on http://localhost:5000`

#### Terminal 2 - Frontend Server
```powershell
npm run dev
```
Expected output: `Local: http://localhost:3002`

### Step 3: Open the Application

1. Navigate to: `http://localhost:3002`
2. Connect your Coinbase Wallet
3. Ensure you're on **Base Sepolia** network

---

## Testing VeriScribe (Academic Certificate NFTs)

### Test Flow 1: Institution Verification Request

1. **Go to VeriScribe Module** tab
2. Click **"Request Verification"** tab
3. Fill in the institution form:
   ```
   Institution Name: Test University
   Institution Type: University
   Registration Number: TU-2025-001
   Website: https://test-university.edu
   Contact Email: admin@test-university.edu
   Official Document URL: https://example.com/proof.pdf
   Description: Leading institution in blockchain education
   ```
4. Click **"Submit Verification Request"**
5. **Expected Result**: Success message appears

### Test Flow 2: Admin Approval (Your Admin Wallet)

1. **Go to VeriScribe Module** → **"Admin Panel"** tab
2. **If you don't see the admin panel**:
   - Check console for your wallet address: `console.log(address)`
   - Verify your address is in `ADMIN_ADDRESSES` in `verification.ts`
   - Reload the page after adding yourself as admin
3. You should see:
   - **Pending Requests**: 1 request from Test University
   - **Verified Institutions**: Mock institutions
4. Click **"Approve"** on the pending request
5. **Expected Result**: Institution moves to "Verified Institutions" tab

### Test Flow 3: Issue a Certificate NFT

1. **Switch to a different wallet** (or use a second browser)
   - This simulates the verified institution issuing certificates
   - Or use the same wallet if added to verified institutions
2. **Go to "Issue Certificate"** tab
3. Fill in certificate details:
   ```
   Institution: Test University
   Course Name: Blockchain Development 101
   Student Name: Alice Johnson
   Student Wallet: 0x... (recipient's wallet address)
   Date Issued: 2025-10-17
   Certificate Type: Course Completion
   Description: Successfully completed 12-week intensive course
   ```
4. Click **"Issue Certificate"** transaction button
5. **Approve transaction** in wallet
6. **Expected Result**: 
   - Transaction succeeds
   - Soulbound NFT minted to student's wallet
   - NFT appears in "View Certificates" tab

### Test Flow 4: View Certificates

1. **Go to "View Certificates"** tab
2. Enter the **student's wallet address**
3. Click **"Search Certificates"**
4. **Expected Result**: 
   - Shows certificate NFT with metadata
   - Displays institution, course, date, type
   - Shows "Non-Transferable" badge

---

## Testing SkillSync (Gig Marketplace with Escrow)

### Test Flow 5: Get Test USDC

**Important**: You need USDC on Base Sepolia to test gigs

#### Option A: Use Faucet
1. Go to [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
2. Get test ETH
3. Swap for test USDC on [Uniswap Testnet](https://app.uniswap.org/)

#### Option B: Use Mock USDC Address
1. Deploy a mock ERC20 token or use existing testnet USDC
2. Update `USDC_ADDRESS` in `src/lib/contracts.ts`:
   ```typescript
   export const USDC_ADDRESS = '0xYourTestUSDCAddress';
   ```

### Test Flow 6: Post a Gig (Client)

1. **Go to SkillSync Module** tab
2. Click **"Post New Gig"**
3. Fill in gig details:
   ```
   Title: Build Landing Page
   Description: Need a modern landing page for SaaS product
   Budget: 500 USDC
   Deadline: 7 days from now
   Skills Required: React, Tailwind CSS, TypeScript
   ```
4. Click **"Create Gig"** transaction button
5. **Approve USDC spending** (first transaction)
6. **Approve gig creation** (second transaction)
7. **Expected Result**:
   - USDC locked in escrow contract
   - Gig appears in "Browse Gigs" tab

### Test Flow 7: Accept a Gig (Freelancer)

1. **Switch to different wallet** (freelancer)
2. **Go to "Browse Gigs"** tab
3. Find "Build Landing Page" gig
4. Click **"Accept Gig"** transaction button
5. **Approve transaction**
6. **Expected Result**:
   - Gig status changes to "In Progress"
   - Freelancer assigned to gig

### Test Flow 8: Complete & Release Payment (Client)

1. **Switch back to client wallet**
2. **Go to "My Posted Gigs"** tab
3. Find completed gig
4. Click **"Release Payment"** transaction button
5. **Approve transaction**
6. **Expected Result**:
   - USDC transferred to freelancer (minus 2% fee)
   - Proof-of-Work NFT minted to freelancer
   - Gig status changes to "Completed"

### Test Flow 9: View Proof-of-Work NFTs

1. **Freelancer wallet** goes to "My Accepted Gigs"
2. Completed gigs show **POW NFT badge**
3. NFT includes:
   - Gig title and description
   - Client and freelancer addresses
   - Completion date
   - Payment amount

---

## Testing Backend API Endpoints

### Health Check
```powershell
curl http://localhost:5000/health
```
Expected: `{"status":"ok","timestamp":"..."}`

### Create User
```powershell
$body = @{
  walletAddress = "0x1234567890123456789012345678901234567890"
  username = "testuser"
  email = "test@example.com"
  userType = "freelancer"
} | ConvertTo-Json

curl -Method POST -Uri "http://localhost:5000/api/users" -Body $body -ContentType "application/json"
```

### Get User by Wallet
```powershell
curl "http://localhost:5000/api/users/wallet/0x1234567890123456789012345678901234567890"
```

### Create Gig
```powershell
$gigBody = @{
  clientAddress = "0x1234567890123456789012345678901234567890"
  title = "Test Gig"
  description = "Test description"
  budget = 500
  deadline = "2025-10-24T00:00:00.000Z"
  skillsRequired = @("React", "TypeScript")
  contractGigId = 1
} | ConvertTo-Json

curl -Method POST -Uri "http://localhost:5000/api/gigs" -Body $gigBody -ContentType "application/json"
```

### Get All Gigs
```powershell
curl http://localhost:5000/api/gigs
```

### Create Certificate
```powershell
$certBody = @{
  tokenId = 1
  studentAddress = "0x1234567890123456789012345678901234567890"
  institutionAddress = "0x0987654321098765432109876543210987654321"
  institutionName = "Test University"
  courseName = "Blockchain 101"
  studentName = "Alice"
  dateIssued = "2025-10-17"
  metadataURI = "ipfs://mock-hash-123"
  certificateType = "course"
} | ConvertTo-Json

curl -Method POST -Uri "http://localhost:5000/api/certificates" -Body $certBody -ContentType "application/json"
```

---

## Common Issues & Solutions

### Issue 1: "Admin Panel Not Showing"

**Problem**: You don't see the Admin Panel tab in VeriScribe

**Solution**:
1. Open browser console (F12)
2. Check your connected wallet address
3. Add your address to `ADMIN_ADDRESSES` in `src/lib/verification.ts`
4. Reload page (Ctrl+R)

### Issue 2: "Wallet Search Not Working"

**Problem**: Searching for certificates by wallet returns nothing

**Solution**:
- Wallet addresses are case-sensitive in some places
- Updated code to use `.toLowerCase()` for all comparisons
- Try searching with the exact address format from the wallet

**Fixed Code**:
```typescript
// Now case-insensitive
export const isAdmin = (address: string): boolean => {
  return NORMALIZED_ADMIN_ADDRESSES.includes(address.toLowerCase());
};
```

### Issue 3: "Transaction Failing"

**Problem**: Transactions revert or fail

**Solution**:
1. **Check network**: Must be on Base Sepolia
2. **Check balance**: Need ETH for gas + USDC for gigs
3. **Check contract deployment**: Contracts must be deployed first
4. **Check wallet approval**: Some actions need approval transactions first

### Issue 4: "Backend Not Connecting"

**Problem**: Frontend can't reach backend API

**Solution**:
1. Check backend is running: `http://localhost:5000/health`
2. Check CORS settings in `backend/server.js`
3. Update frontend API calls to use correct URL:
   ```typescript
   const API_URL = 'http://localhost:5000/api';
   ```

### Issue 5: "MongoDB Connection Error"

**Problem**: Backend shows MongoDB connection error

**Solution**:
1. Check `backend/.env` has valid MongoDB URI
2. Verify MongoDB Atlas IP whitelist includes your IP
3. Check database user credentials

---

## Testing Checklist

### VeriScribe Module
- [ ] Submit verification request
- [ ] View request in admin panel
- [ ] Approve request as admin
- [ ] Issue certificate to student wallet
- [ ] View certificate by wallet search
- [ ] Verify certificate is non-transferable (soulbound)

### SkillSync Module
- [ ] Get test USDC tokens
- [ ] Post a new gig with USDC escrow
- [ ] Browse available gigs
- [ ] Accept gig as freelancer
- [ ] Complete gig and release payment
- [ ] Verify POW NFT minted to freelancer
- [ ] Check platform fee deducted (2%)

### Backend API
- [ ] Health check endpoint responds
- [ ] Create user via API
- [ ] Get user by wallet address
- [ ] Create gig in database
- [ ] Create certificate in database
- [ ] Get all gigs
- [ ] Get certificates by student

### Admin Functions
- [ ] Access admin panel with authorized wallet
- [ ] View pending verification requests
- [ ] Approve institution verification
- [ ] Reject institution with reason
- [ ] View all verified institutions

---

## Next Steps After Testing

### 1. Deploy Smart Contracts
Follow `DEPLOYMENT_GUIDE.md` to deploy contracts to Base Sepolia:
```powershell
cd contracts
# Install Hardhat
npm init -y
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat
# Deploy scripts
```

### 2. Update Contract Addresses
After deployment, update `src/lib/contracts.ts`:
```typescript
export const CERTIFICATE_CONTRACT_ADDRESS = '0xYourDeployedAddress' as const;
export const GIG_ESCROW_CONTRACT_ADDRESS = '0xYourDeployedAddress' as const;
```

### 3. Production Database
1. Set up MongoDB Atlas production cluster
2. Update `backend/.env` with production URI
3. Enable database backups

### 4. Production Deployment
- **Frontend**: Deploy to Vercel
- **Backend**: Deploy to Railway/Render
- Update environment variables in production

---

## Quick Command Reference

### Start Development
```powershell
# Terminal 1 - Backend
cd backend; npm run dev

# Terminal 2 - Frontend  
npm run dev
```

### Check Logs
```powershell
# Backend logs
Get-Content backend/logs/app.log -Tail 50 -Wait

# Frontend logs - check browser console (F12)
```

### Reset Test Data
```powershell
# Clear browser localStorage
# Browser console:
localStorage.clear()
location.reload()
```

---

## Support & Resources

- **Base Sepolia Explorer**: https://sepolia.basescan.org/
- **Base Faucet**: https://www.coinbase.com/faucets
- **OnchainKit Docs**: https://onchainkit.xyz/
- **Wagmi Docs**: https://wagmi.sh/

## Video Demo Script

1. **Intro** (30s)
   - Show landing page
   - Connect wallet
   - Overview of two modules

2. **VeriScribe Demo** (2 min)
   - Submit institution verification
   - Admin approval process
   - Issue certificate NFT
   - Search and view certificate

3. **SkillSync Demo** (2 min)
   - Post gig with USDC
   - Accept gig as freelancer
   - Complete and release payment
   - Show POW NFT minted

4. **Technical Overview** (1 min)
   - Show smart contracts
   - Backend API
   - MongoDB integration

---

**Happy Testing! 🚀**

If you encounter any issues, check the browser console (F12) and backend terminal for error messages.
