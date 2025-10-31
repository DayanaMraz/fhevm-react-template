const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying ConfidentialERC20 contract...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Get contract factory
  const ConfidentialERC20 = await ethers.getContractFactory("ConfidentialERC20");

  // Deploy contract
  const token = await ConfidentialERC20.deploy("Confidential Token", "cTKN");
  await token.waitForDeployment();

  const address = await token.getAddress();
  console.log("✅ ConfidentialERC20 deployed to:", address);

  // Save deployment info
  const fs = require('fs');
  const deploymentInfo = {
    contract: "ConfidentialERC20",
    address: address,
    deployer: deployer.address,
    network: (await ethers.provider.getNetwork()).name,
    timestamp: new Date().toISOString()
  };

  fs.writeFileSync(
    'deployment.json',
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\n📝 Deployment info saved to deployment.json");
  console.log("\n🎉 Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
