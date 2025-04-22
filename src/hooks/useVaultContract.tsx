"use client"  // บ่งบอกว่าเป็น client-side component

import { useState, useEffect } from "react"  // นำเข้า React hooks
import { ethers } from "ethers"  // นำเข้า ethers.js
import { useWallet } from "./useWallet"  // นำเข้า wallet hook
import { useToast } from "@/components/ui/use-toast"  // นำเข้า toast notification

// ABI ของ VaultKeyNFT contract
const vaultKeyABI = [
  "function mint() public payable",
  "function hasAccess(address user) public view returns (bool)",
  "function balanceOf(address owner) public view returns (uint256)",
  "function tokenURI(uint256 tokenId) public view returns (string memory)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function mintPrice() public view returns (uint256)",
  "function maxTokens() public view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
]

// สร้าง hook สำหรับใช้งาน contract
export const useVaultContract = () => {
  const { address, signer, isHoleskyNetwork } = useWallet()  // เรียกใช้ wallet hook
  const [contract, setContract] = useState<ethers.Contract | null>(null)  // state เก็บ contract instance
  const [isOwner, setIsOwner] = useState<boolean>(false)  // state เก็บสถานะเจ้าของ
  const [mintPrice, setMintPrice] = useState<string>("0")  // state เก็บราคา mint
  const [isMinting, setIsMinting] = useState<boolean>(false)  // state เก็บสถานะกำลัง mint
  const [hasVaultAccess, setHasVaultAccess] = useState<boolean>(false)  // state เก็บสถานะการเข้าถึง
  const [isLoading, setIsLoading] = useState<boolean>(true)  // state เก็บสถานะกำลังโหลด
  const { toast } = useToast()  // เรียกใช้ toast notification

  // effect สำหรับเริ่มต้น contract
  useEffect(() => {
    const initializeContract = async () => {
      if (!signer || !address || !isHoleskyNetwork) {  // เช็คเงื่อนไขที่จำเป็น
        setContract(null)
        setIsOwner(false)
        setHasVaultAccess(false)
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)  // เริ่มสถานะกำลังโหลด
        const contractAddress = import.meta.env.VITE_NEXT_PUBLIC_CONTRACT_ADDRESS  // ดึงที่อยู่ contract

        if (!contractAddress) {  // เช็คว่ามีที่อยู่ contract หรือไม่
          console.error("Contract address not found in environment variables")
          setIsLoading(false)
          return
        }

        // สร้าง contract instance
        const vaultContract = new ethers.Contract(contractAddress, vaultKeyABI, signer)
        setContract(vaultContract)

        // เช็คสิทธิ์การเข้าถึง
        const access = await vaultContract.hasAccess(address)
        setHasVaultAccess(access)

        // ดึงราคา mint
        const price = await vaultContract.mintPrice()
        setMintPrice(ethers.utils.formatEther(price))
      } catch (error) {
        console.error("Error initializing contract:", error)
        toast({
          title: "Contract Connection Error",
          description: "Failed to connect to the NFT contract",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)  // จบสถานะกำลังโหลด
      }
    }

    initializeContract()  // เรียกใช้ฟังก์ชันเริ่มต้น
  }, [signer, address, isHoleskyNetwork])  // effect ทำงานเมื่อมีการเปลี่ยนแปลงค่าเหล่านี้

  // ฟังก์ชันสำหรับ mint NFT
  const mintNFT = async () => {
    if (!contract || !signer) {  // เช็คว่ามี contract และ signer หรือไม่
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      })
      return
    }

    if (!isHoleskyNetwork) {  // เช็คว่าอยู่บน Holesky network หรือไม่
      toast({
        title: "Wrong Network",
        description: "Please connect to the Holesky testnet.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsMinting(true)  // เริ่มสถานะกำลัง mint

      const price = await contract.mintPrice()  // ดึงราคา mint

      const tx = await contract.mint({ value: price })  // ส่ง transaction mint

      toast({  // แสดง toast แจ้งว่ากำลัง mint
        title: "Minting NFT",
        description: "Your transaction is being processed...",
      })

      await tx.wait()  // รอให้ transaction เสร็จสิ้น

      toast({  // แสดง toast แจ้งว่า mint สำเร็จ
        title: "Success!",
        description: "Your NFT has been minted successfully.",
      })

      // เช็คสิทธิ์การเข้าถึงอีกครั้ง
      const access = await contract.hasAccess(address)
      setHasVaultAccess(access)
    } catch (error) {
      console.error("Error minting NFT:", error)
      toast({
        title: "Minting Failed",
        description: "Failed to mint your NFT. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsMinting(false)  // จบสถานะกำลัง mint
    }
  }

  // ฟังก์ชันตรวจสอบสิทธิ์การเข้าถึง
  const checkAccess = async () => {
    if (!contract || !address) return false  // เช็คเงื่อนไขที่จำเป็น

    try {
      const access = await contract.hasAccess(address)  // เรียกใช้ฟังก์ชัน hasAccess ของ contract
      setHasVaultAccess(access)  // เซ็ตสถานะการเข้าถึง
      return access
    } catch (error) {
      console.error("Error checking access:", error)
      return false
    }
  }

  // return ค่าต่างๆ ที่จำเป็น
  return {
    contract,
    isOwner,
    mintPrice,
    isMinting,
    hasVaultAccess,
    isLoading,
    mintNFT,
    checkAccess,
  }
}