import { ethers } from "ethers";
import * as fs from "fs";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const provider = new ethers.JsonRpcProvider("https://rpc.botchain.ai");
  const mainPk = process.env.PRIVATE_KEY;
  if (!mainPk) throw new Error("No PRIVATE_KEY in .env");

  const mainWallet = new ethers.Wallet(mainPk, provider);
  console.log("Main Wallet:", mainWallet.address);

  const initialBal = await provider.getBalance(mainWallet.address);
  console.log("Initial Balance:", ethers.formatEther(initialBal), "BOT");

  // Generate 2 random wallets
  const w2 = ethers.Wallet.createRandom();
  const w3 = ethers.Wallet.createRandom();

  const amountToSend = ethers.parseEther("0.10");

  console.log(`Sending 0.10 BOT to Wallet 2 (${w2.address})...`);
  const tx1 = await mainWallet.sendTransaction({
    to: w2.address,
    value: amountToSend,
  });
  console.log("Tx 1 Hash:", tx1.hash);
  await tx1.wait();
  console.log("Tx 1 confirmed!");

  console.log(`Sending 0.10 BOT to Wallet 3 (${w3.address})...`);
  const tx2 = await mainWallet.sendTransaction({
    to: w3.address,
    value: amountToSend,
  });
  console.log("Tx 2 Hash:", tx2.hash);
  await tx2.wait();
  console.log("Tx 2 confirmed!");

  const balMain = await provider.getBalance(mainWallet.address);
  const bal2 = await provider.getBalance(w2.address);
  const bal3 = await provider.getBalance(w3.address);

  const walletData = {
    wallet1: {
      label: "Wallet 1 (Main)",
      address: mainWallet.address,
      privateKey: mainPk,
      balance: ethers.formatEther(balMain) + " BOT",
    },
    wallet2: {
      label: "Wallet 2",
      address: w2.address,
      privateKey: w2.privateKey,
      balance: ethers.formatEther(bal2) + " BOT",
      txHash: tx1.hash,
      explorer: `https://scan.botchain.ai/tx/${tx1.hash}`,
    },
    wallet3: {
      label: "Wallet 3",
      address: w3.address,
      privateKey: w3.privateKey,
      balance: ethers.formatEther(bal3) + " BOT",
      txHash: tx2.hash,
      explorer: `https://scan.botchain.ai/tx/${tx2.hash}`,
    },
  };

  fs.writeFileSync(".wallets.json", JSON.stringify(walletData, null, 2));
  console.log("SUCCESSFULLY_SPLIT");
  console.log(JSON.stringify(walletData, null, 2));
}

main().catch((err) => {
  console.error("Error splitting BOT:", err);
  process.exit(1);
});
