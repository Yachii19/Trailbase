# Quick Admin Setup Guide

## How to Become an Admin in 3 Steps

### Step 1: Get Your Wallet Address

1. **Connect your Coinbase Wallet** to the app
2. **Copy your wallet address** - it looks like: `0x1234...7890`
   - Click the wallet icon in the top right
   - Click "Copy address"
   - Or open browser console (F12) and type: `window.ethereum.selectedAddress`

### Step 2: Add Yourself as Admin

1. **Open this file**: `src/lib/verification.ts`
2. **Find line 28** (the `ADMIN_ADDRESSES` array)
3. **Add your wallet address**:

```typescript
// BEFORE (around line 28):
const ADMIN_ADDRESSES = [
  '0xAdminWallet1234567890123456789012345678901',
  '0xAdminWallet0987654321098765432109876543210',
  // Add your wallet addresses below
];

// AFTER - add your address:
const ADMIN_ADDRESSES = [
  '0xAdminWallet1234567890123456789012345678901',
  '0xAdminWallet0987654321098765432109876543210',
  '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', // <-- YOUR ACTUAL WALLET HERE
];
```

4. **Save the file** (Ctrl+S)

### Step 3: Reload the App

1. **Go back to your browser** with the app open
2. **Refresh the page** (Ctrl+R or F5)
3. **Verify you're an admin**:
   - Go to **VeriScribe Module** tab
   - You should now see **"Admin Panel"** tab
   - If you see it, you're an admin! ✅

---

## Verify Admin Access

Open browser console (F12) and paste this:

```javascript
// Check if you're an admin
const { isAdmin } = require('@/lib/verification');
const myAddress = window.ethereum.selectedAddress;
console.log('My Address:', myAddress);
console.log('Am I Admin?:', isAdmin(myAddress));
```

If it returns `true`, you're all set!

---

## What Can Admins Do?

### In VeriScribe Module:
- ✅ **View all verification requests** (pending, approved, rejected)
- ✅ **Approve institution verification requests**
- ✅ **Reject requests with a reason**
- ✅ **See all verified institutions**
- ✅ **Manage the verification system**

### Admin Panel Features:
1. **Pending Requests Tab**
   - View institution name, type, registration number
   - See submitted documents and details
   - Approve with one click
   - Reject with custom reason

2. **All Requests Tab**
   - Historical view of all requests
   - Filter by status (pending/approved/rejected)
   - See who reviewed each request

3. **Verified Institutions Tab**
   - List of all verified institutions
   - Verification date and admin who approved
   - Institution details and contact info

---

## Troubleshooting

### "I don't see the Admin Panel tab"

**Check these:**
1. ✅ Your wallet is connected
2. ✅ Your address is in `ADMIN_ADDRESSES` array
3. ✅ You saved the file and reloaded the page
4. ✅ Your address format matches (with `0x` prefix)

**Debug steps:**
```javascript
// In browser console (F12):
// 1. Check your connected address
console.log('Connected:', window.ethereum.selectedAddress);

// 2. Import and check admin status
import { isAdmin } from '@/lib/verification';
console.log('Is Admin:', isAdmin(window.ethereum.selectedAddress));
```

### "Case sensitivity issues"

The code is now **case-insensitive**! These all work:
- `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`
- `0x742D35CC6634C0532925A3B844BC9E7595F0BEB`
- `0x742d35cc6634c0532925a3b844bc9e7595f0beb`

All are treated as the same address.

### "Multiple admins"

You can add multiple admin addresses:

```typescript
const ADMIN_ADDRESSES = [
  '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', // Admin 1
  '0xAbC123dEf456789012345678901234567890AbCd', // Admin 2  
  '0x9876543210987654321098765432109876543210', // Admin 3
];
```

---

## Production Admin Management

For production deployment, you should:

1. **Use multi-sig wallet** for admin functions
2. **Implement on-chain admin registry** in smart contracts
3. **Add role-based access control (RBAC)**
4. **Create admin DAO** for decentralized governance

Example smart contract admin pattern:
```solidity
contract AdminRegistry {
    mapping(address => bool) public admins;
    
    function addAdmin(address newAdmin) external onlyOwner {
        admins[newAdmin] = true;
    }
    
    function removeAdmin(address admin) external onlyOwner {
        admins[admin] = false;
    }
    
    modifier onlyAdmin() {
        require(admins[msg.sender], "Not admin");
        _;
    }
}
```

For MVP testing, the hardcoded approach is fine!

---

## Quick Test After Setup

1. **Connect wallet** (make sure you're on Base Sepolia)
2. **Go to VeriScribe** → **Admin Panel**
3. **You should see**:
   - Pending Requests: 0 (or any submitted requests)
   - Verified Institutions: 1 (Demo University mock data)
4. **Create a test request**:
   - Switch to "Request Verification" tab
   - Fill in form and submit
   - Switch back to Admin Panel
   - You should see your request!
5. **Approve the request**
   - Click "Approve" button
   - Request moves to "Verified Institutions"

Success! You're now an admin. 🎉

---

## Next: Start Testing

See `TESTING_GUIDE.md` for complete testing workflows.
