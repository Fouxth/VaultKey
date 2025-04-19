"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { useWallet } from "./useWallet"
import { useToast } from "@/components/ui/use-toast"

// ABI for the VaultKeyNFT contract
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

export const useVaultContract = () => {
  const { address, signer, isHoleskyNetwork } = useWallet()
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [isOwner, setIsOwner] = useState<boolean>(false)
  const [mintPrice, setMintPrice] = useState<string>("0")
  const [isMinting, setIsMinting] = useState<boolean>(false)
  const [hasVaultAccess, setHasVaultAccess] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { toast } = useToast()

  useEffect(() => {
    const initializeContract = async () => {
      if (!signer || !address || !isHoleskyNetwork) {
        setContract(null)
        setIsOwner(false)
        setHasVaultAccess(false)
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const contractAddress = import.meta.env.VITE_NEXT_PUBLIC_CONTRACT_ADDRESS

        if (!contractAddress) {
          console.error("Contract address not found in environment variables")
          setIsLoading(false)
          return
        }

        const vaultContract = new ethers.Contract(contractAddress, vaultKeyABI, signer)

        setContract(vaultContract)

        // Check if user has access
        const access = await vaultContract.hasAccess(address)
        setHasVaultAccess(access)

        // Get mint price
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
        setIsLoading(false)
      }
    }

    initializeContract()
  }, [signer, address, isHoleskyNetwork])

  const mintNFT = async () => {
    if (!contract || !signer) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      })
      return
    }

    if (!isHoleskyNetwork) {
      toast({
        title: "Wrong Network",
        description: "Please connect to the Holesky testnet.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsMinting(true)

      const price = await contract.mintPrice()

      const tx = await contract.mint({ value: price })

      toast({
        title: "Minting NFT",
        description: "Your transaction is being processed...",
      })

      await tx.wait()

      // ✅ Re-check access after mint
      const access = await contract.hasAccess(address)
      setHasVaultAccess(access) // ← สำคัญที่สุด!

      toast({
        title: "NFT Minted Successfully!",
        description: "Your Vault Key NFT has been minted!",
      })
    } catch (error: any) {
      console.error("Error minting NFT:", error)
      toast({
        title: "Minting Failed",
        description: error.message?.includes("insufficient funds")
          ? "Insufficient funds in your wallet."
          : "There was an error minting your NFT.",
        variant: "destructive",
      })
    } finally {
      setIsMinting(false)
    }
  }

  const checkAccess = async () => {
    if (!contract || !address) {
      setHasVaultAccess(false)
      return false
    }

    try {
      const access = await contract.hasAccess(address)
      setHasVaultAccess(access)
      return access
    } catch (error) {
      console.error("Error checking access:", error)
      setHasVaultAccess(false)
      return false
    }
  }

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
