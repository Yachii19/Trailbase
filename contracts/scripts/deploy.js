const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting deployment to Base Sepolia...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Base Sepolia USDC address (testnet)
  const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
  
  console.log("📜 USDC Token Address:", USDC_ADDRESS);
  console.log("─────────────────────────────────────────────────\n");

  // Deploy VeriScribeCertificate
  console.log("🎓 Deploying VeriScribeCertificate...");
  const VeriScribe = await hre.ethers.getContractFactory("VeriScribeCertificate");
  const veriScribe = await VeriScribe.deploy();
  await veriScribe.waitForDeployment();
  const veriScribeAddress = await veriScribe.getAddress();
  
  console.log("✅ VeriScribeCertificate deployed to:", veriScribeAddress);
  console.log("─────────────────────────────────────────────────\n");

  // Deploy SkillSyncGigEscrow
  console.log("💼 Deploying SkillSyncGigEscrow...");
  const SkillSync = await hre.ethers.getContractFactory("SkillSyncGigEscrow");
  const skillSync = await SkillSync.deploy(USDC_ADDRESS);
  await skillSync.waitForDeployment();
  const skillSyncAddress = await skillSync.getAddress();
  
  console.log("✅ SkillSyncGigEscrow deployed to:", skillSyncAddress);
  console.log("─────────────────────────────────────────────────\n");

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      VeriScribeCertificate: veriScribeAddress,
      SkillSyncGigEscrow: skillSyncAddress,
      USDC: USDC_ADDRESS
    }
  };

  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  const filename = `${hre.network.name}-${Date.now()}.json`;
  fs.writeFileSync(
    path.join(deploymentsDir, filename),
    JSON.stringify(deploymentInfo, null, 2)
  );

  // Update frontend contracts.ts
  const contractsPath = path.join(__dirname, "../../src/lib/contracts.ts");
  console.log("📝 Updating frontend contracts.ts...");
  
  let contractsContent = fs.readFileSync(contractsPath, "utf8");
  
  // Update VeriScribe address
  contractsContent = contractsContent.replace(
    /export const CERTIFICATE_CONTRACT_ADDRESS = \n?  [^;]+;/,
    `export const CERTIFICATE_CONTRACT_ADDRESS = \n  '${veriScribeAddress}' as const;`
  );
  
  // Update SkillSync address
  contractsContent = contractsContent.replace(
    /export const GIG_ESCROW_CONTRACT_ADDRESS = \n?  [^;]+;/,
    `export const GIG_ESCROW_CONTRACT_ADDRESS = \n  '${skillSyncAddress}' as const;`
  );
  
  fs.writeFileSync(contractsPath, contractsContent);
  console.log("✅ Frontend contracts updated!\n");

  console.log("═════════════════════════════════════════════════");
  console.log("🎉 DEPLOYMENT COMPLETE!");
  console.log("═════════════════════════════════════════════════");
  console.log("\n📋 Contract Addresses:\n");
  console.log("VeriScribeCertificate:", veriScribeAddress);
  console.log("SkillSyncGigEscrow:   ", skillSyncAddress);
  console.log("USDC Token:           ", USDC_ADDRESS);
  console.log("\n🔗 View on BaseScan:");
  console.log(`https://sepolia.basescan.org/address/${veriScribeAddress}`);
  console.log(`https://sepolia.basescan.org/address/${skillSyncAddress}`);
  console.log("\n💾 Deployment info saved to:", filename);
  console.log("\n✨ Your frontend has been automatically updated!");
  console.log("   Refresh your browser to use the deployed contracts.\n");
  
  // Verify reminder
  console.log("─────────────────────────────────────────────────");
  console.log("📌 Next Steps:");
  console.log("1. ✅ Contracts deployed and frontend updated");
  console.log("2. 🔄 Refresh your browser");
  console.log("3. 🎮 Test the app - transactions will now work!");
  console.log("4. (Optional) Verify contracts on BaseScan:");
  console.log(`   npx hardhat verify --network baseSepolia ${veriScribeAddress}`);
  console.log(`   npx hardhat verify --network baseSepolia ${skillSyncAddress} ${USDC_ADDRESS}`);
  console.log("═════════════════════════════════════════════════\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
