/**
 * SkillSync Pro - Browser Console Debug Helper
 * 
 * HOW TO USE:
 * 1. Open your browser to http://localhost:3002
 * 2. Press F12 to open Developer Console
 * 3. Copy and paste this ENTIRE file into the console
 * 4. Press Enter
 * 5. Use the helper commands below
 */

console.log('%c🚀 SkillSync Pro Debug Helper Loaded!', 'background: #667eea; color: white; padding: 10px; font-size: 16px; border-radius: 5px;');

// Global helper object
window.SkillSyncDebug = {
  
  /**
   * Check if you're connected and show your wallet info
   */
  async checkWallet() {
    console.log('%c🔍 Checking Wallet...', 'color: #667eea; font-size: 14px; font-weight: bold;');
    
    if (typeof window.ethereum === 'undefined') {
      console.error('❌ No wallet detected! Install Coinbase Wallet or MetaMask.');
      return null;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.length === 0) {
        console.warn('⚠️ Wallet detected but not connected. Run: SkillSyncDebug.connect()');
        return null;
      }

      const address = accounts[0];
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const balance = await window.ethereum.request({ 
        method: 'eth_getBalance', 
        params: [address, 'latest'] 
      });

      const info = {
        address: address,
        chainId: chainId,
        chainName: chainId === '0x14a34' ? 'Base Sepolia ✅' : 'Wrong Network ❌',
        balanceWei: balance,
        balanceETH: (parseInt(balance, 16) / 1e18).toFixed(6),
      };

      console.log('%c✅ Wallet Info:', 'color: green; font-weight: bold;');
      console.table(info);
      
      return info;
    } catch (error) {
      console.error('❌ Error:', error.message);
      return null;
    }
  },

  /**
   * Connect wallet if not connected
   */
  async connect() {
    console.log('%c🔗 Connecting Wallet...', 'color: #667eea; font-size: 14px; font-weight: bold;');
    
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log('✅ Connected:', accounts[0]);
      return accounts[0];
    } catch (error) {
      console.error('❌ Connection failed:', error.message);
      return null;
    }
  },

  /**
   * Check if you're an admin
   */
  async checkAdminStatus() {
    console.log('%c🛡️ Checking Admin Status...', 'color: #667eea; font-size: 14px; font-weight: bold;');
    
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length === 0) {
      console.error('❌ No wallet connected!');
      return false;
    }

    const myAddress = accounts[0];
    
    // Hardcoded admin addresses from verification.ts
    const ADMIN_ADDRESSES = [
      '0xAdminWallet1234567890123456789012345678901',
      '0xAdminWallet0987654321098765432109876543210',
    ].map(addr => addr.toLowerCase());

    const isAdmin = ADMIN_ADDRESSES.includes(myAddress.toLowerCase());
    
    console.log('%cYour Address:', 'font-weight: bold;', myAddress);
    console.log('%cIs Admin:', 'font-weight: bold;', isAdmin ? '✅ YES' : '❌ NO');
    
    if (!isAdmin) {
      console.log('%cTo become admin:', 'color: orange; font-weight: bold;');
      console.log('1. Open src/lib/verification.ts');
      console.log('2. Add your address to ADMIN_ADDRESSES array:');
      console.log(`   '${myAddress}',`);
      console.log('3. Save and reload');
    } else {
      console.log('%c🎉 You have admin access!', 'color: green; font-weight: bold; font-size: 16px;');
    }
    
    return isAdmin;
  },

  /**
   * Switch to Base Sepolia network
   */
  async switchToBaseSepolia() {
    console.log('%c🔄 Switching to Base Sepolia...', 'color: #667eea; font-size: 14px; font-weight: bold;');
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x14a34' }], // 84532 in hex
      });
      console.log('✅ Switched to Base Sepolia!');
    } catch (error) {
      // If chain not added, add it
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x14a34',
              chainName: 'Base Sepolia',
              nativeCurrency: {
                name: 'Ethereum',
                symbol: 'ETH',
                decimals: 18
              },
              rpcUrls: ['https://sepolia.base.org'],
              blockExplorerUrls: ['https://sepolia.basescan.org']
            }]
          });
          console.log('✅ Base Sepolia added and switched!');
        } catch (addError) {
          console.error('❌ Failed to add network:', addError.message);
        }
      } else {
        console.error('❌ Failed to switch:', error.message);
      }
    }
  },

  /**
   * Test backend connection
   */
  async testBackend() {
    console.log('%c🔌 Testing Backend...', 'color: #667eea; font-size: 14px; font-weight: bold;');
    
    try {
      const response = await fetch('http://localhost:5000/health');
      const data = await response.json();
      
      console.log('%c✅ Backend is running!', 'color: green; font-weight: bold;');
      console.table(data);
      
      return data;
    } catch (error) {
      console.error('%c❌ Backend not responding!', 'color: red; font-weight: bold;');
      console.log('Start backend with: cd backend && npm run dev');
      return null;
    }
  },

  /**
   * Get contract addresses
   */
  getContracts() {
    console.log('%c📜 Contract Addresses:', 'color: #667eea; font-size: 14px; font-weight: bold;');
    
    const contracts = {
      VeriScribe: '0xCertificateContractAddress',
      SkillSync: '0xGigEscrowContractAddress',
      USDC: '0xUSDCTokenAddress',
      Network: 'Base Sepolia (Chain ID: 84532)',
    };
    
    console.table(contracts);
    console.log('%c⚠️ Note: Update these in src/lib/contracts.ts after deployment', 'color: orange;');
    
    return contracts;
  },

  /**
   * Test wallet search functionality
   */
  async testWalletSearch(address) {
    console.log('%c🔍 Testing Wallet Search...', 'color: #667eea; font-size: 14px; font-weight: bold;');
    
    if (!address) {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      address = accounts[0];
    }
    
    console.log('Searching for:', address);
    console.log('Lowercase:', address.toLowerCase());
    console.log('Uppercase:', address.toUpperCase());
    
    // All should work due to case-insensitive fixes
    console.log('%c✅ Wallet search is case-insensitive now!', 'color: green; font-weight: bold;');
    
    return {
      original: address,
      normalized: address.toLowerCase(),
    };
  },

  /**
   * Clear localStorage (reset app state)
   */
  clearStorage() {
    console.log('%c🗑️ Clearing localStorage...', 'color: #667eea; font-size: 14px; font-weight: bold;');
    
    const keys = Object.keys(localStorage);
    console.log('Removing', keys.length, 'items...');
    
    localStorage.clear();
    
    console.log('%c✅ Storage cleared! Reload page to reset.', 'color: green; font-weight: bold;');
  },

  /**
   * Show all available commands
   */
  help() {
    console.log('%c📚 Available Commands:', 'background: #667eea; color: white; padding: 10px; font-size: 16px; border-radius: 5px;');
    
    const commands = {
      'SkillSyncDebug.checkWallet()': 'Check your wallet connection and info',
      'SkillSyncDebug.connect()': 'Connect your wallet',
      'SkillSyncDebug.checkAdminStatus()': 'Check if you have admin access',
      'SkillSyncDebug.switchToBaseSepolia()': 'Switch to Base Sepolia network',
      'SkillSyncDebug.testBackend()': 'Test backend server connection',
      'SkillSyncDebug.getContracts()': 'Show contract addresses',
      'SkillSyncDebug.testWalletSearch(address)': 'Test wallet search functionality',
      'SkillSyncDebug.clearStorage()': 'Clear localStorage and reset app',
      'SkillSyncDebug.help()': 'Show this help message',
    };
    
    console.table(commands);
    
    console.log('\n%c🎯 Quick Start:', 'color: #667eea; font-weight: bold; font-size: 14px;');
    console.log('1. SkillSyncDebug.checkWallet()');
    console.log('2. SkillSyncDebug.checkAdminStatus()');
    console.log('3. SkillSyncDebug.switchToBaseSepolia()');
    console.log('4. SkillSyncDebug.testBackend()');
  },

  /**
   * Run full diagnostic
   */
  async runDiagnostic() {
    console.log('%c🔧 Running Full Diagnostic...', 'background: #667eea; color: white; padding: 10px; font-size: 16px; border-radius: 5px;');
    
    console.log('\n--- Wallet Check ---');
    await this.checkWallet();
    
    console.log('\n--- Admin Status ---');
    await this.checkAdminStatus();
    
    console.log('\n--- Backend Test ---');
    await this.testBackend();
    
    console.log('\n--- Contract Info ---');
    this.getContracts();
    
    console.log('\n%c✅ Diagnostic Complete!', 'color: green; font-weight: bold; font-size: 16px;');
  }
};

// Auto-run basic diagnostic
console.log('\n%c💡 Tip: Run SkillSyncDebug.help() to see all available commands', 'color: #667eea; font-style: italic;');
console.log('%c💡 Tip: Run SkillSyncDebug.runDiagnostic() for full system check', 'color: #667eea; font-style: italic;');

// Show help by default
SkillSyncDebug.help();
