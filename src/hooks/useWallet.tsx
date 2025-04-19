"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { ethers } from "ethers"
import { useToast } from "@/components/ui/use-toast"

interface WalletContextType {
  address: string | null
  provider: ethers.providers.Web3Provider | null
  signer: ethers.Signer | null
  chainId: number | null
  isConnecting: boolean
  isHoleskyNetwork: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  provider: null,
  signer: null,
  chainId: null,
  isConnecting: false,
  isHoleskyNetwork: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
})

export const useWallet = () => useContext(WalletContext)

interface WalletProviderProps {
  children: ReactNode
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [address, setAddress] = useState<string | null>(null)
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()

  const isHoleskyNetwork = chainId === 17000

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      toast({
        title: "MetaMask not found",
        description: "Please install MetaMask to connect your wallet.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsConnecting(true)

      // Request account access
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      if (!window.ethereum) {
        toast({
          title: "MetaMask not found",
          description: "Please install MetaMask to connect your wallet.",
          variant: "destructive",
        })
        return
      }

      const ethersProvider = new ethers.providers.Web3Provider(window.ethereum, "any")
      const ethersSigner = ethersProvider.getSigner()
      const network = await ethersProvider.getNetwork()

      setAddress(accounts[0])
      setProvider(ethersProvider)
      setSigner(ethersSigner)
      setChainId(network.chainId)

      // Check if connected to Holesky
      if (network.chainId !== 17000) {
        toast({
          title: "Wrong Network",
          description: "Please connect to the Holesky testnet (Chain ID: 17000)",
          variant: "destructive",
        })

        try {
          // Try to switch to Holesky
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x4268" }], // 17000 in hex
          })
        } catch (switchError: any) {
          // If the network isn't added, try to add it
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: "0x4268",
                    chainName: "Holesky",
                    nativeCurrency: {
                      name: "Holesky ETH",
                      symbol: "ETH",
                      decimals: 18,
                    },
                    rpcUrls: ["https://ethereum-holesky-rpc.publicnode.com"],
                    blockExplorerUrls: ["https://holesky.etherscan.io/"],
                  },
                ],
              })
            } catch (addError) {
              console.error("Error adding Holesky network", addError)
            }
          }
        }
      }

      toast({
        title: "Wallet Connected",
        description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
      })
    } catch (error) {
      console.error("Error connecting wallet:", error)
      toast({
        title: "Connection Failed",
        description: "There was a problem connecting to your wallet.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setAddress(null)
    setProvider(null)
    setSigner(null)
    setChainId(null)
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    })
  }

  useEffect(() => {
    // Check if already connected
    if (typeof window.ethereum !== "undefined") {
      const checkConnection = async () => {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const accounts = await provider.listAccounts()

          if (accounts.length > 0) {
            const signer = provider.getSigner()
            const network = await provider.getNetwork()

            setAddress(accounts[0])
            setProvider(provider)
            setSigner(signer)
            setChainId(network.chainId)
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error)
        }
      }

      checkConnection()

      // Setup event listeners
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet()
        } else {
          setAddress(accounts[0])
        }
      }

      const handleChainChanged = (_chainId: string) => {
        const newChainId = Number.parseInt(_chainId, 16)
        setChainId(newChainId)
        window.location.reload()
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [])

  return (
    <WalletContext.Provider
      value={{
        address,
        provider,
        signer,
        chainId,
        isConnecting,
        isHoleskyNetwork,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
