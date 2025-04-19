"use client"

import { Button } from "@/components/ui/button"
import { useVault } from "@/context/VaultContext"
import { Wallet, LogOut, Loader2 } from "lucide-react"

export function ConnectButton() {
  const { address, connectWallet, disconnectWallet, isConnecting } = useVault()

  if (isConnecting) {
    return (
      <Button variant="outline" disabled className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
        <span className="opacity-0">Connecting...</span>
      </Button>
    )
  }

  if (address) {
    return (
      <div className="flex items-center gap-2">
        <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium border border-green-500/20">
          Connected
        </div>
        <Button variant="outline" size="sm" onClick={disconnectWallet} className="flex items-center gap-2">
          <span className="hidden sm:inline">{`${address.slice(0, 6)}...${address.slice(-4)}`}</span>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={connectWallet} className="bg-vault-gradient hover:opacity-90">
      <Wallet className="mr-2 h-4 w-4" />
      Connect Wallet
    </Button>
  )
}
