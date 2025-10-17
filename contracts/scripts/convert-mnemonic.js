const { ethers } = require('ethers');

// Read the mnemonic from .env
const mnemonic = "retreat fatal poet raccoon denial blur satisfy amused seven grid gun comic";

try {
  const wallet = ethers.Wallet.fromPhrase(mnemonic.trim());
  
  console.log('\n✅ Private Key Derived Successfully!\n');
  console.log('═══════════════════════════════════════════════════');
  console.log('Private Key:', wallet.privateKey);
  console.log('Address:', wallet.address);
  console.log('═══════════════════════════════════════════════════\n');
  
} catch (error) {
  console.error('Error:', error.message);
}
