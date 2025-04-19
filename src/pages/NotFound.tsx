"use client"

import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/Navbar"
import { FileQuestion, Home } from "lucide-react"
import { Link } from "react-router-dom"
import {useEffect} from "react"
import { useLocation } from "react-router-dom"

const NotFound = () => {
  const location = useLocation()

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname)
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 vault-container py-12 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="inline-flex items-center justify-center p-4 bg-vault-500/10 rounded-full mx-auto">
            <FileQuestion className="h-12 w-12 text-vault-500" />
          </div>

          <h1 className="text-4xl font-bold">404</h1>
          <h2 className="text-2xl font-medium">Page Not Found</h2>

          <p className="text-muted-foreground">The page you are looking for doesn't exist or has been moved.</p>

          <div className="pt-4">
            <Button
              asChild
              className="bg-vault-gradient text-white hover:opacity-90 inline-flex items-center gap-2 px-6 py-2 rounded-md"
            >
              <Link to="/">
                <Home className="h-4 w-4" />
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

export default NotFound
