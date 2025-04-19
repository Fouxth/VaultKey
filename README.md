# 🔐 Secret Society Vault Access (NFT Key)

โปรเจกต์นี้เป็นระบบสำหรับ Mint NFT Key เพื่อปลดล็อกเนื้อหาพิเศษ (Vault) สำหรับผู้ถือ NFT เท่านั้น โดยผู้ใช้จะสามารถเชื่อมกระเป๋า (Connect Wallet), Mint NFT, และเข้าถึงหน้า /vault ได้ถ้าเป็นผู้ถือ NFT ดังกล่าว

## ✨ Features หลัก
- ⛏️ ผู้ใช้สามารถ **Mint NFT Key** เพื่อเข้าถึงเนื้อหาได้
- 🔐 หน้าที่ต้องใช้ NFT: `/vault` (มีระบบตรวจสอบสิทธิ์)
- 🔌 เชื่อมต่อกับ **MetaMask** และใช้เครือข่าย **Holesky Testnet**
- 🚀 ใช้ Smart Contract เขียนด้วย **Solidity (ERC-721)** และ Deploy ด้วย **Hardhat**

---

## 📂 โครงสร้างโปรเจกต์

```
project-root/
├── contracts/
│   └── VaultKeyNFT.sol          ← Smart Contract (ERC721)
├── scripts/
│   └── deploy.ts                ← Deploy script สำหรับ Hardhat
├── src/
│   ├── context/VaultContext.tsx ← เช็คสิทธิ์ผ่าน NFT
│   ├── hooks/useWallet.tsx      ← เชื่อมต่อกระเป๋า & ตรวจเครือข่าย
│   ├── components/              ← ปุ่ม Connect, Card NFT, Navbar
│   └── pages/
│       ├── index.tsx            ← หน้าแรก (Mint / Access Vault)
│       ├── VaultPage.tsx        ← เนื้อหาลับที่เปิดให้เฉพาะผู้ถือ NFT
│       └── AccessDenied.tsx     ← แจ้งเตือนหากไม่ถือ NFT
├── .env                         ← กำหนด CONTRACT_ADDRESS
├── hardhat.config.ts            ← ตั้งค่าการ Deploy (Holesky)
└── README.md                    ← คู่มือการใช้งานโปรเจกต์นี้ (ไฟล์นี้)
```

---

## 📆 ขั้นตอนการใช้งาน (Step-by-step)

### 1. ติดตั้ง dependency
```Terminal
yarn install
```

### 2. ตั้งค่าการเชื่อมกับเครือข่าย Holesky
สร้างไฟล์ `.env`:
```env
# RPC URL for Holesky testnet
VITE_RPC_URL=https://eth-holesky.g.alchemy.com/v2/O7XZuPCCBG6u__QHM8TRO1LT0X8Bw0G7

# Private key for deploying the contract
PRIVATE_KEY=e4f5ea28bf194a1a759ceb3c032777f72631bfb5a47233ee502baa48c301f1ea

# Contract address (will be generated after deployment)
VITE_NEXT_PUBLIC_CONTRACT_ADDRESS=""

# Mint price for the NFT (in ETH)
VITE_NEXT_PUBLIC_MINT_PRICE="1"
```

### 3. Deploy Contract ใหม่ (ถ้าต้องการ Reset การถือ NFT)
```Terminal
yarn deploy:holesky
```
- ใช้ Hardhat version: `2.23.0`
- ใช้ ethers: `5.8.0`
- Deploy เสร็จแล้วนำ `address` มาใส่ใน `.env`

### 4. Start Frontend
```Terminal
yarn dev
```
เปิดที่ [http://localhost:8080](http://localhost:8080)

---

## 📄 หน้าเว็บที่มีอยู่

| Path | รายละเอียด |
|------|-------------|
| `/` | หน้า Landing หลัก มีปุ่ม Mint NFT หรือเข้าหน้า Vault |
| `/vault` | หน้าเนื้อหาพิเศษ ต้องถือ NFT จึงเข้าถึงได้ |
| `/access-denied` | หน้าสำหรับคนที่ไม่ได้ถือ NFT แต่พยายามเข้าถึง /vault |

---

## 🎨 UI & Interaction
- ปรับแต่งด้วย TailwindCSS + Lucide Icon
- Card NFT จะเปลี่ยน icon ถ้าถือ NFT แล้ว
- มีการตรวจสอบ chainId และแจ้งเตือนหากไม่ได้อยู่บน Holesky
- Toast แจ้งเตือนทุก Action เช่น Connect, Mint สำเร็จ, ล้มเหลว

---

## 🚧 การรีเซ็ตให้ Mint ใหม่ได้หมด
หากต้องการล้างสิทธิ์ทั้งหมด และให้ทุกคนสามารถ Mint ใหม่:
1. แก้ไข Smart Contract ถ้าจำกัดจำนวน/เคยมี Token
2. รัน Deploy ใหม่เพื่อรีเซ็ต NFT ทั้งระบบ:
```Terminal
yarn deploy:holesky
```
3. เปลี่ยน CONTRACT_ADDRESS ใน `.env`

---

## 💼 ผู้พัฒนา
**ชื่อโปรเจกต์:** Secret Society Vault Access NFT
**นักพัฒนา:** Fouxth
**เทคโนโลยี:** React + TypeScript + Solidity + Hardhat + Tailwind + Vite

---
