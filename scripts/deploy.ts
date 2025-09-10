import { ethers } from "hardhat";

async function main() {
  console.log("Deploying HeartSafely contract...");

  // Get the contract factory
  const HeartSafely = await ethers.getContractFactory("HeartSafely");

  // Deploy the contract with a verifier address (you can change this)
  const verifierAddress = "0x0000000000000000000000000000000000000000"; // Replace with actual verifier address
  const heartSafely = await HeartSafely.deploy(verifierAddress);

  await heartSafely.waitForDeployment();

  const contractAddress = await heartSafely.getAddress();
  console.log("HeartSafely deployed to:", contractAddress);

  // Save the contract address to a file for frontend use
  const fs = require('fs');
  const contractInfo = {
    address: contractAddress,
    network: hre.network.name,
    deployedAt: new Date().toISOString()
  };

  fs.writeFileSync(
    './deployment-info.json',
    JSON.stringify(contractInfo, null, 2)
  );

  console.log("Contract deployment info saved to deployment-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
