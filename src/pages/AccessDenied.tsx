import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/Navbar"
import { ShieldAlert, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { useVault } from "@/context/VaultContext"

const AccessDenied = () => {
  const { address } = useVault()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 vault-container py-12 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="inline-flex items-center justify-center p-4 bg-red-500/10 rounded-full mx-auto">
            <ShieldAlert className="h-12 w-12 text-red-500" />
          </div>

          <h1 className="text-3xl font-bold">Access Denied</h1>

          <p className="text-muted-foreground">
            {address
              ? "You don't have a Vault Key NFT. Please mint one to access this secure area."
              : "Please connect your wallet and mint a Vault Key NFT to access this secure area."}
          </p>

          <div className="pt-4">
            <Button
              asChild
              className="bg-vault-gradient text-white hover:opacity-90 inline-flex items-center gap-2 px-6 py-2 rounded-md"
            >
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                Return to Home
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="vault-container text-center text-sm text-muted-foreground">
          <p>&copy; 2025 NFT Vault Access. All rights reserved | FOG3KP.</p>
        </div>
      </footer>
    </div>
  )
}

export default AccessDenied
