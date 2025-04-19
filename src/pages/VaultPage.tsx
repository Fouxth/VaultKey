"use client"

import { useVault } from "@/context/VaultContext"
import { useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, MessageSquare, User, Shield } from "lucide-react"
import { Navbar } from "@/components/Navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const VaultPage = () => {
  const { hasVaultAccess, isLoading } = useVault()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !hasVaultAccess) {
      navigate("/access-denied")
    }
  }, [hasVaultAccess, isLoading, navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-vault-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg font-medium">Checking your access...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 vault-container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-6 mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-green-500/10 rounded-full">
              <Shield className="h-8 w-8 text-green-500" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gradient">Secret Vault</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Welcome to the exclusive content vault. This secure area is only accessible to holders of the Vault Key
              NFT.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <Card className="glass-card border-vault-300/20 hover:border-vault-300/50 transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex items-start gap-4">
                  <FileText className="h-8 w-8 text-vault-500" />
                  <div>
                    <CardTitle>Secret Whitepaper</CardTitle>
                    <CardDescription>Exclusive research and insights</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Access our confidential whitepaper with detailed analysis and future roadmap.
                </p>
                <Button asChild className="w-full bg-vault-gradient hover:opacity-90">
                  <a href="https://github.com/Fouxth/VaultKey/blob/main/README.md" target="_blank" rel="noreferrer">
                    View README.md
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card border-vault-300/20 hover:border-vault-300/50 transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex items-start gap-4">
                  <MessageSquare className="h-8 w-8 text-vault-500" />
                  <div>
                    <CardTitle>Secret Discord</CardTitle>
                    <CardDescription>Join our private community</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Connect with other NFT holders in our exclusive Discord server.
                </p>
                <Button asChild className="w-full bg-vault-gradient hover:opacity-90">
                  <a href="https://discord.gg/r94rTrRuCw" target="_blank" rel="noreferrer">
                    Join Discord
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card border-vault-300/20 hover:border-vault-300/50 transition-all duration-300 md:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex items-start gap-4">
                  <User className="h-8 w-8 text-vault-500" />
                  <div>
                    <CardTitle>Secret Person</CardTitle>
                    <CardDescription>Connect with our special guest</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Exclusive access to our special guest's content and private sessions.
                </p>
                <Button asChild className="w-full bg-vault-gradient hover:opacity-90">
                  <a href="https://www.tiktok.com/@it_spu" target="_blank" rel="noreferrer">
                    Access Now
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center pt-12">
            <Button asChild variant="outline" className="inline-flex items-center gap-2">
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

export default VaultPage
