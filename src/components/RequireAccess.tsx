// Higher-order component สำหรับตรวจสอบการเข้าถึง Vault
"use client"

import { type ReactNode, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useVault } from "@/context/VaultContext"
import { Loader2 } from "lucide-react"

// Props สำหรับ component
interface RequireAccessProps {
  children: ReactNode
}

export function RequireAccess({ children }: RequireAccessProps) {
  // ดึงข้อมูลและฟังก์ชันที่จำเป็นจาก Vault Context
  const { address, hasVaultAccess, isLoading, checkAccess } = useVault()
  const [isChecking, setIsChecking] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // ฟังก์ชันตรวจสอบการเข้าถึง
    const verifyAccess = async () => {
      setIsChecking(true)

      // ถ้าไม่มี address ให้ redirect ไปหน้า access-denied
      if (!address) {
        navigate("/access-denied")
        return
      }

      // รอให้ contract โหลดเสร็จแล้วตรวจสอบการเข้าถึง
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

  // แสดง loading screen ขณะตรวจสอบ
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

  // ถ้าผ่านการตรวจสอบแล้ว แสดงเนื้อหา
  return <>{children}</>
}