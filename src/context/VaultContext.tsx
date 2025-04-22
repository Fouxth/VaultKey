"use client" // บ่งบอกว่าเป็น client-side component

// นำเข้า dependencies
import { createContext, useContext, type ReactNode } from "react"
import { WalletProvider, useWallet } from "@/hooks/useWallet"
import { useVaultContract } from "@/hooks/useVaultContract"

// กำหนด interface สำหรับ context
interface VaultContextType {
    // ข้อมูล Wallet
    address: string | null          // address ของ wallet
    isConnecting: boolean          // สถานะการเชื่อมต่อ
    isHoleskyNetwork: boolean     // เช็คว่าอยู่บน Holesky network
    connectWallet: () => Promise<void>    // ฟังก์ชันเชื่อมต่อ wallet
    disconnectWallet: () => void          // ฟังก์ชันยกเลิกการเชื่อมต่อ

    // ข้อมูล Contract
    mintPrice: string             // ราคา mint
    isMinting: boolean           // สถานะการ mint
    hasVaultAccess: boolean     // สถานะการเข้าถึง vault
    isLoading: boolean          // สถานะการโหลด
    mintNFT: () => Promise<void>   // ฟังก์ชัน mint NFT
    checkAccess: () => Promise<boolean>  // ฟังก์ชันตรวจสอบการเข้าถึง
}

// สร้าง context
const VaultContext = createContext<VaultContextType | null>(null)

// Hook สำหรับใช้งาน context
export const useVault = () => {
    const context = useContext(VaultContext)
    if (!context) {
        throw new Error("useVault must be used within a VaultProvider")
    }
    return context
}

// Provider component
export const VaultProvider = ({ children }: VaultProviderProps) => {
    return (
        <WalletProvider>
            <VaultProviderInner>{children}</VaultProviderInner>
        </WalletProvider>
    )
}

// Component ภายในสำหรับจัดการ Context ของ Vault
const VaultProviderInner = ({ children }: { children: ReactNode }) => {
  // ใช้ hooks เพื่อเข้าถึง wallet และ contract
  const wallet = useWallet()           // hook จัดการ wallet
  const contract = useVaultContract()  // hook จัดการ smart contract

  // สร้าง object ที่จะส่งไปยัง context
  const value: VaultContextType = {
    // ข้อมูลเกี่ยวกับ Wallet
    address: wallet.address,            // ที่อยู่ wallet ปัจจุบัน
    isConnecting: wallet.isConnecting, // สถานะกำลังเชื่อมต่อ wallet
    isHoleskyNetwork: wallet.isHoleskyNetwork, // เช็คว่าอยู่บนเครือข่าย Holesky
    connectWallet: wallet.connectWallet,       // ฟังก์ชันเชื่อมต่อ wallet
    disconnectWallet: wallet.disconnectWallet, // ฟังก์ชันยกเลิกการเชื่อมต่อ wallet

    // ข้อมูลเกี่ยวกับ Smart Contract
    mintPrice: contract.mintPrice,           // ราคาในการ mint NFT
    isMinting: contract.isMinting,           // สถานะกำลัง mint
    hasVaultAccess: contract.hasVaultAccess, // สถานะการมีสิทธิ์เข้าถึง vault
    isLoading: contract.isLoading,           // สถานะกำลังโหลดข้อมูล
    mintNFT: contract.mintNFT,               // ฟังก์ชันสำหรับ mint NFT
    checkAccess: contract.checkAccess,       // ฟังก์ชันตรวจสอบสิทธิ์การเข้าถึง
  }

  // ส่งค่า value ผ่าน Context Provider ไปยัง children components
  return <VaultContext.Provider value={value}>{children}</VaultContext.Provider>
}