// ไฟล์สำหรับ Deploy Smart Contract NFT ไปยัง Blockchain

import { ethers } from "hardhat";

async function main() {
  // ดึงบัญชีที่จะใช้ Deploy Contract (บัญชีแรกจาก Hardhat)
  const [deployer] = await ethers.getSigners();

  // แสดงข้อความว่ากำลัง Deploy ด้วยบัญชีอะไร
  console.log("Deploying contract with the account:", deployer.address);

  // สร้าง Contract Factory จาก Contract ชื่อ VaultKeyNFT
  const VaultKeyNFT = await ethers.getContractFactory("VaultKeyNFT");

  // กำหนด Base URI สำหรับ Metadata ของ NFT (ควรเปลี่ยนเป็น URI จริง)
  const baseURI = "https://ipfs.io/ipfs/QmYZt9vBgPj4YCWKh3rPCZLs2SoXsESau9xGbWsNQNzZ9s/";
  
  // Deploy Contract พร้อมส่ง Parameters คือ Address ของ Deployer และ Base URI
  const contract = await VaultKeyNFT.deploy(deployer.address, baseURI);

  // รอให้ Contract ถูก Deploy เสร็จสมบูรณ์
  await contract.deployed();

  // แสดงข้อความยืนยันว่า Deploy สำเร็จพร้อม Address ของ Contract
  console.log("✅ VaultKeyNFT deployed to:", contract.address);
}

// เรียกใช้ฟังก์ชัน main() และจัดการ Error ถ้าเกิดขึ้น
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});