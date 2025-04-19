// scripts/deploy.ts

import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contract with the account:", deployer.address);

  const VaultKeyNFT = await ethers.getContractFactory("VaultKeyNFT");

  const baseURI = "https://ipfs.io/ipfs/QmYZt9vBgPj4YCWKh3rPCZLs2SoXsESau9xGbWsNQNzZ9s/"; // เปลี่ยนเป็นของจริง
  const contract = await VaultKeyNFT.deploy(deployer.address, baseURI);

  await contract.deployed();

  console.log("✅ VaultKeyNFT deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});