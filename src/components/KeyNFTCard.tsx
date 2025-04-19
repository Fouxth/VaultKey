"use client"

import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useVault } from "@/context/VaultContext"
import { Shield, Key, LockKeyhole } from "lucide-react"

export function KeyNFTCard() {
  const { mintNFT, mintPrice, isMinting, hasVaultAccess, checkAccess } = useVault()
  const navigate = useNavigate()

  const handleAccessVault = async () => {
    const access = await checkAccess()
    if (access) {
      navigate("/vault")
    } else {
      navigate("/access-denied")
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden border-2 border-vault-300/50 shadow-xl transition-all duration-300 hover:shadow-vault-300/20 glass-card">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-center text-2xl font-bold text-gradient">Vault Key NFT</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="flex justify-center mb-6">
          {hasVaultAccess ? (
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-vault-100 flex items-center justify-center">
                <Key size={80} className="text-vault-600 animate-float" />
              </div>
              <div className="absolute -right-2 -bottom-2">
                <Shield size={32} className="text-green-500" fill="#10b981" />
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-vault-100/50 flex items-center justify-center">
                <LockKeyhole size={80} className="text-vault-400 animate-pulse-slow" />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4 text-center">
          <h3 className="text-xl font-medium">
            {hasVaultAccess ? "You own a Vault Key!" : "Mint your Vault Access Key"}
          </h3>

          <p className="text-muted-foreground">
            {hasVaultAccess
              ? "This NFT grants you exclusive access to the secure vault."
              : "Get unlimited access to the exclusive content vault with this NFT key."}
          </p>

          {!hasVaultAccess && (
            <div className="mt-4 p-3 bg-vault-100/50 rounded-lg border border-vault-300/20">
              <p className="text-sm font-medium">
                Price: <span className="font-bold">{mintPrice} ETH</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">on Holesky Testnet</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        {!hasVaultAccess ? (
          <Button
            onClick={mintNFT}
            disabled={isMinting}
            className="w-full bg-vault-gradient hover:opacity-90 font-medium"
            size="lg"
          >
            {isMinting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Minting...
              </>
            ) : (
              "Mint Key NFT"
            )}
          </Button>
        ) : (
          <Button
            onClick={handleAccessVault}
            className="w-full bg-vault-gradient hover:opacity-90 font-medium"
            size="lg"
          >
            Access Vault
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
