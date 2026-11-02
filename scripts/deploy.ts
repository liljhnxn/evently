import hre from "hardhat";
const { ethers } = hre;
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("----------------------------------------------------");
  console.log("Deploying Evently Smart Contract to Botchain Testnet...");
  console.log("----------------------------------------------------");

  const [deployer] = await ethers.getSigners();
  if (!deployer) {
    throw new Error("No deployer account configured. Check PRIVATE_KEY in .env");
  }

  console.log(`Deployer Account: ${deployer.address}`);
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Account Balance: ${ethers.formatEther(balance)} BOHR / ETH`);

  const EventlyFactory = await ethers.getContractFactory("Evently");
  const evently = await EventlyFactory.deploy();

  await evently.waitForDeployment();
  const contractAddress = await evently.getAddress();

  const deployTx = evently.deploymentTransaction();
  console.log(`\n🎉 Evently deployed successfully!`);
  console.log(`Contract Address: ${contractAddress}`);
  if (deployTx) {
    console.log(`Transaction Hash: ${deployTx.hash}`);
  }
  console.log(`Explorer Link: https://scan.bohr.life/address/${contractAddress}`);

  // Write deployed info to lib/deployedAddress.json for frontend
  const deployedInfo = {
    address: contractAddress,
    network: "Botchain Testnet",
    chainId: 968,
    deployedAt: new Date().toISOString(),
    txHash: deployTx ? deployTx.hash : null,
  };

  const outputPath = path.join(process.cwd(), "lib/deployedAddress.json");
  fs.writeFileSync(outputPath, JSON.stringify(deployedInfo, null, 2));
  console.log(`Saved deployment info to ${outputPath}`);
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
