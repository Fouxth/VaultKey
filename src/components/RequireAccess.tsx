"use client"

import { type ReactNode, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useVault } from "@/context/VaultContext"
import { Loader2 } from "lucide-react"

interface RequireAccessProps {
  children: ReactNode
}

export function RequireAccess({ children }: RequireAccessProps) {
  const { address, hasVaultAccess, isLoading, checkAccess } = useVault()
  const [isChecking, setIsChecking] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const verifyAccess = async () => {
      setIsChecking(true)

      if (!address) {
        navigate("/access-denied")
        return
      }

      // Wait for contract to load and then check access
      if (!isLoading) {
        const hasAccess = await checkAccess()
        if (!hasAccess) {
          navigate("/access-denied")
        }
      }

      setIsChecking(false)
    }

    verifyAccess()
  }, [address, hasVaultAccess, isLoading, navigate, checkAccess])

  if (isChecking || isLoading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-vault-500/10 rounded-full">
            <Loader2 className="h-12 w-12 animate-spin text-vault-500" />
          </div>
          <p className="text-lg font-medium">Verifying access...</p>
          <p className="text-sm text-muted-foreground">Please wait while we check your NFT ownership</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
