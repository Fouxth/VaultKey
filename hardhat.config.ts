import type { HardhatUserConfig } from "hardhat/config"
import "@nomiclabs/hardhat-ethers";  // import plugin สำหรับใช้งาน ethers.js
import * as dotenv from "dotenv"      // import สำหรับอ่านไฟล์ .env

// โหลดค่าจากไฟล์ .env
dotenv.config()

// ดึงค่า PRIVATE_KEY และ RPC_URL จาก Environment Variables
const { PRIVATE_KEY, VITE_RPC_URL } = process.env

// กำหนดค่า Configuration สำหรับ Hardhat
const config: HardhatUserConfig = {
  // กำหนดเวอร์ชันของ Solidity และการตั้งค่า Optimizer
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,  // เปิดใช้งาน Optimizer
        runs: 200,      // จำนวนรอบในการ Optimize
      },
    },
  },
  
  // กำหนด Networks ที่สามารถ Deploy ได้
  networks: {
    // Network สำหรับ Local Development
    hardhat: {
      chainId: 31337,
    },
    // Network Holesky TestNet
    holesky: {
      url: VITE_RPC_URL || "https://ethereum-holesky-rpc.publicnode.com",
      chainId: 17000,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],  // ใส่ Private Key ถ้ามีการกำหนดไว้
    },
  },
  
  // กำหนด Path ต่างๆ ในโปรเจค
  paths: {
    sources: "./contracts",     // โฟลเดอร์เก็บไฟล์ Contract
    tests: "./test",           // โฟลเดอร์เก็บไฟล์ Test
    cache: "./cache",          // โฟลเดอร์เก็บ Cache
    artifacts: "./artifacts",   // โฟลเดอร์เก็บไฟล์ Compiled Contract
  },
}

export default config