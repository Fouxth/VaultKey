import { ConnectButton } from "./ConnectButton"
import { LockKeyhole, Users } from "lucide-react"
import { useLocation, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const location = useLocation()
  const isNotIndex = location.pathname !== "/"

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="vault-container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <LockKeyhole className="h-8 w-8 text-vault-500" />
            <h1 className="text-xl font-bold tracking-tight">
              <span className="text-gradient">NFT Vault Access</span>
            </h1>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/developers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Team</span>
            </Link>
          </Button>
          <ConnectButton />
        </div>
      </div>
    </header>
  )
}
