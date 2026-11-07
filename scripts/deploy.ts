import hre from "hardhat";
const { ethers } = hre;
import * as fs from "fs";
import * as path from "path";

async function main() {
  const network = await ethers.provider.getNetwork();
  const chainId = Number(network.chainId);

  console.log("====================================================");
  console.log("Deploying Evently Smart Contract to BOT Chain...");
  console.log("====================================================");

  const [deployer] = await ethers.getSigners();
  if (!deployer) {
    throw new Error("No deployer account configured. Check PRIVATE_KEY in .env");
  }

  console.log(`Deployer Account : ${deployer.address}`);
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Account Balance  : ${ethers.formatEther(balance)} BOT`);

  // Fetch current live gas fee data
  const feeData = await ethers.provider.getFeeData();
  const gasPrice = feeData.gasPrice ?? ethers.parseUnits("20", "gwei");
  console.log(`Live Gas Price   : ${ethers.formatUnits(gasPrice, "gwei")} Gwei`);

  const EventlyFactory = await ethers.getContractFactory("Evently");

  // Pre-estimate gas to ensure minimal, accurate gas usage
  const deployTxData = await EventlyFactory.getDeployTransaction();
  const estimatedGas = await ethers.provider.estimateGas(deployTxData);
  const estimatedCost = estimatedGas * gasPrice;

  console.log(`Estimated Gas    : ${estimatedGas.toString()} units`);
  console.log(`Estimated Cost   : ${ethers.formatEther(estimatedCost)} BOT`);
  console.log("----------------------------------------------------");

  if (balance < estimatedCost) {
    throw new Error(
      `Insufficient balance! Need at least ${ethers.formatEther(estimatedCost)} BOT, but only have ${ethers.formatEther(balance)} BOT`
    );
  }

  console.log("Broadcasting deployment transaction with minimal gas...");
  const evently = await EventlyFactory.deploy({
    gasPrice: gasPrice,
  });

  await evently.waitForDeployment();
  const contractAddress = await evently.getAddress();
  const deployTx = evently.deploymentTransaction();

  console.log(`\n🎉 Evently successfully deployed to BOT Chain!`);
  console.log(`Contract Address : ${contractAddress}`);
  if (deployTx) {
    console.log(`Transaction Hash : ${deployTx.hash}`);
  }
  console.log(`Explorer Link    : https://scan.botchain.ai/address/${contractAddress}`);

  // Write deployment info to lib/deployedAddress.json
  const deployedInfo = {
    address: contractAddress,
    network: "BOT Chain",
    chainId: chainId,
    deployedAt: new Date().toISOString(),
    txHash: deployTx ? deployTx.hash : null,
    explorer: `https://scan.botchain.ai/address/${contractAddress}`,
    gasUsed: estimatedGas.toString(),
    gasPriceGwei: ethers.formatUnits(gasPrice, "gwei"),
  };

  const outputPath = path.join(process.cwd(), "lib/deployedAddress.json");
  fs.writeFileSync(outputPath, JSON.stringify(deployedInfo, null, 2));
  console.log(`Saved deployment info to ${outputPath}`);
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
