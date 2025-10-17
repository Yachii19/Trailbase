// Helper to derive private key from mnemonic
const { ethers } = require('ethers');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🔐 Private Key Helper');
console.log('═══════════════════════════════════════════════════\n');
console.log('This helper will derive your private key from your');
console.log('recovery phrase (12 or 24 words).\n');
console.log('⚠️  SECURITY WARNING:');
console.log('- Your recovery phrase will only be used locally');
console.log('- It will not be saved or transmitted anywhere');
console.log('- Close this terminal after getting your key\n');
console.log('═══════════════════════════════════════════════════\n');

rl.question('Enter your recovery phrase (12 or 24 words): ', (mnemonic) => {
  try {
    // Validate and create wallet from mnemonic
    const wallet = ethers.Wallet.fromPhrase(mnemonic.trim());
    
    console.log('\n✅ Private Key Derived Successfully!\n');
    console.log('═══════════════════════════════════════════════════');
    console.log('Your Private Key:');
    console.log('═══════════════════════════════════════════════════');
    console.log(wallet.privateKey);
    console.log('═══════════════════════════════════════════════════');
    console.log('Your Wallet Address:', wallet.address);
    console.log('═══════════════════════════════════════════════════\n');
    console.log('Next Steps:');
    console.log('1. Copy the private key above');
    console.log('2. Add to backend/.env as DEPLOYER_PRIVATE_KEY=');
    console.log('3. Close this terminal for security');
    console.log('4. Run: npm run deploy\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\nMake sure you entered the recovery phrase correctly.');
    console.log('It should be 12 or 24 words separated by spaces.\n');
  }
  
  rl.close();
});
