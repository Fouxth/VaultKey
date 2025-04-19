import { KeyNFTCard } from "@/components/KeyNFTCard"
import { Navbar } from "@/components/Navbar"
import { Shield, Wallet, Lock } from "lucide-react"

const Index = () => {
  // Define the mint price with a fallback
  const mintPrice = import.meta.env.NEXT_PUBLIC_MINT_PRICE || "0.001"

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 vault-container py-12">
        <div className="max-w-4xl mx-auto pt-8 pb-16">
          {/* Hero Section */}
          <div className="text-center space-y-6 mb-16">
            <div className="inline-flex items-center justify-center p-3 bg-vault-500/10 rounded-full">
              <Lock className="h-8 w-8 text-vault-500" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-gradient">NFT Vault Access</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Mint your NFT key to unlock exclusive access to our secure vault. Only key holders can view the protected
              content.
            </p>
          </div>

          {/* NFT Card */}
          <div className="max-w-md mx-auto">
            <KeyNFTCard />
          </div>

          {/* Instructions */}
          <div className="mt-16 text-center space-y-4">
            <h2 className="text-2xl font-semibold">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8 text-left mt-8">
              <div className="glass-card p-6 border border-vault-300/20 hover:border-vault-300/50 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-vault-gradient text-white flex items-center justify-center font-bold mb-4">
                  <Wallet className="h-6 w-6" />
                </div>
                <h3 className="font-medium text-lg mb-2">Connect Wallet</h3>
                <p className="text-muted-foreground">Connect your MetaMask wallet to the Holesky testnet.</p>
              </div>

              <div className="glass-card p-6 border border-vault-300/20 hover:border-vault-300/50 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-vault-gradient text-white flex items-center justify-center font-bold mb-4">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="font-medium text-lg mb-2">Mint NFT Key</h3>
                <p className="text-muted-foreground">Mint your NFT Key for {mintPrice} ETH to gain vault access.</p>
              </div>

              <div className="glass-card p-6 border border-vault-300/20 hover:border-vault-300/50 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-vault-gradient text-white flex items-center justify-center font-bold mb-4">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="font-medium text-lg mb-2">Access Vault</h3>
                <p className="text-muted-foreground">
                  Use your key to unlock the exclusive content in our secure vault.
                </p>
              </div>
            </div>
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

export default Index
