"use client"

import { createContext, useContext, type ReactNode } from "react"
import { WalletProvider, useWallet } from "@/hooks/useWallet"
import { useVaultContract } from "@/hooks/useVaultContract"

interface VaultContextType {
  // Wallet data
  address: string | null
  isConnecting: boolean
  isHoleskyNetwork: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void

  // Contract data
  mintPrice: string
  isMinting: boolean
  hasVaultAccess: boolean
  isLoading: boolean
  mintNFT: () => Promise<void>
  checkAccess: () => Promise<boolean>
}

const VaultContext = createContext<VaultContextType | null>(null)

export const useVault = () => {
  const context = useContext(VaultContext)
  if (!context) {
    throw new Error("useVault must be used within a VaultProvider")
  }
  return context
}

interface VaultProviderProps {
  children: ReactNode
}

export const VaultProvider = ({ children }: VaultProviderProps) => {
  return (
    <WalletProvider>
      <VaultProviderInner>{children}</VaultProviderInner>
    </WalletProvider>
  )
}

const VaultProviderInner = ({ children }: { children: ReactNode }) => {
  const wallet = useWallet()
  const contract = useVaultContract()

  const value: VaultContextType = {
    // Wallet data
    address: wallet.address,
    isConnecting: wallet.isConnecting,
    isHoleskyNetwork: wallet.isHoleskyNetwork,
    connectWallet: wallet.connectWallet,
    disconnectWallet: wallet.disconnectWallet,

    // Contract data
    mintPrice: contract.mintPrice,
    isMinting: contract.isMinting,
    hasVaultAccess: contract.hasVaultAccess,
    isLoading: contract.isLoading,
    mintNFT: contract.mintNFT,
    checkAccess: contract.checkAccess,
  }

  return <VaultContext.Provider value={value}>{children}</VaultContext.Provider>
}
