"use client"  // บ่งบอกว่าเป็น client-side component ใน Next.js

// นำเข้า modules ที่จำเป็น
import { useState, useEffect, createContext, useContext, type ReactNode } from "react"  // hooks และ types จาก React
import { ethers } from "ethers"  // library สำหรับทำงานกับ Ethereum
import { useToast } from "@/components/ui/use-toast"  // custom hook สำหรับแสดง notifications

// กำหนด interface สำหรับ context
interface WalletContextType {
  address: string | null            // ที่อยู่กระเป๋า ETH
  provider: ethers.providers.Web3Provider | null  // provider สำหรับเชื่อมต่อกับ blockchain
  signer: ethers.Signer | null     // ตัวเซ็น transactions
  chainId: number | null           // ID ของเครือข่าย
  isConnecting: boolean           // สถานะกำลังเชื่อมต่อ
  isHoleskyNetwork: boolean       // เช็คว่าอยู่บน Holesky testnet
  connectWallet: () => Promise<void>  // ฟังก์ชันเชื่อมต่อกระเป๋า
  disconnectWallet: () => void    // ฟังก์ชันยกเลิกการเชื่อมต่อ
}

// สร้าง context พร้อมค่าเริ่มต้น
const WalletContext = createContext<WalletContextType>({
  address: null,
  provider: null,
  signer: null,
  chainId: null,
  isConnecting: false,
  isHoleskyNetwork: false,
  connectWallet: async () => {},  // ฟังก์ชันว่างเปล่า
  disconnectWallet: () => {},     // ฟังก์ชันว่างเปล่า
})

// สร้าง custom hook สำหรับใช้ context
export const useWallet = () => useContext(WalletContext)

// กำหนด interface สำหรับ props ของ provider
interface WalletProviderProps {
  children: ReactNode  // รับ children components
}

// สร้าง Provider component
export const WalletProvider = ({ children }: WalletProviderProps) => {
  // สร้าง state ทั้งหมดที่จำเป็น
  const [address, setAddress] = useState<string | null>(null)  // state เก็บที่อยู่กระเป๋า
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)  // state เก็บ provider
  const [signer, setSigner] = useState<ethers.Signer | null>(null)  // state เก็บ signer
  const [chainId, setChainId] = useState<number | null>(null)  // state เก็บ chain ID
  const [isConnecting, setIsConnecting] = useState(false)  // state เก็บสถานะการเชื่อมต่อ
  const { toast } = useToast()  // เรียกใช้ toast notification

  const isHoleskyNetwork = chainId === 17000  // เช็คว่าเป็น Holesky network หรือไม่

  // ฟังก์ชันเชื่อมต่อกระเป๋า
  const connectWallet = async () => {
    // เช็คว่ามี MetaMask หรือไม่
    if (typeof window.ethereum === "undefined") {
      toast({
        title: "MetaMask not found",
        description: "Please install MetaMask to connect your wallet.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsConnecting(true)  // เริ่มสถานะกำลังเชื่อมต่อ

      // ขอสิทธิ์เข้าถึงบัญชี
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      // เช็ค MetaMask อีกครั้ง
      if (!window.ethereum) {
        toast({
          title: "MetaMask not found",
          description: "Please install MetaMask to connect your wallet.",
          variant: "destructive",
        })
        return
      }

      // สร้าง provider และ signer
      const ethersProvider = new ethers.providers.Web3Provider(window.ethereum, "any")
      const ethersSigner = ethersProvider.getSigner()
      const network = await ethersProvider.getNetwork()

      // เซ็ตค่าต่างๆ
      setAddress(accounts[0])
      setProvider(ethersProvider)
      setSigner(ethersSigner)
      setChainId(network.chainId)

      // เช็คว่าเชื่อมต่อกับ Holesky หรือไม่
      if (network.chainId !== 17000) {
        toast({
          title: "Wrong Network",
          description: "Please connect to the Holesky testnet (Chain ID: 17000)",
          variant: "destructive",
        })

        try {
          // พยายามสลับไปยัง Holesky
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x4268" }],  // 17000 ในรูปแบบ hex
          })
        } catch (switchError: any) {
          // ถ้าไม่มีเครือข่าย พยายามเพิ่มเครือข่าย
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

      // แสดง toast แจ้งเชื่อมต่อสำเร็จ
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
      setIsConnecting(false)  // จบสถานะกำลังเชื่อมต่อ
    }
  }

  // ฟังก์ชันยกเลิกการเชื่อมต่อ
  const disconnectWallet = () => {
    setAddress(null)       // ล้างที่อยู่กระเป๋า
    setProvider(null)      // ล้าง provider
    setSigner(null)        // ล้าง signer
    setChainId(null)      // ล้าง chain ID
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    })
  }

  // effect สำหรับเช็คการเชื่อมต่อและตั้ง event listeners
  useEffect(() => {
    // เช็คว่ามี MetaMask หรือไม่
    if (typeof window.ethereum !== "undefined") {
      // ฟังก์ชันเช็คการเชื่อมต่อ
      const checkConnection = async () => {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const accounts = await provider.listAccounts()

          // ถ้ามีบัญชีที่เชื่อมต่ออยู่
          if (accounts.length > 0) {
            const signer = provider.getSigner()
            const network = await provider.getNetwork()

            // เซ็ตค่าต่างๆ
            setAddress(accounts[0])
            setProvider(provider)
            setSigner(signer)
            setChainId(network.chainId)
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error)
        }
      }

      checkConnection()  // เรียกใช้ฟังก์ชันเช็คการเชื่อมต่อ

      // ตั้ง event handlers
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet()  // ถ้าไม่มีบัญชี ให้ยกเลิกการเชื่อมต่อ
        } else {
          setAddress(accounts[0])  // อัพเดทที่อยู่กระเป๋า
        }
      }

      const handleChainChanged = (_chainId: string) => {
        const newChainId = Number.parseInt(_chainId, 16)  // แปลง hex เป็น decimal
        setChainId(newChainId)  // อัพเดท chain ID
        window.location.reload()  // รีโหลดหน้าเว็บ
      }

      // เพิ่ม event listeners
      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      // cleanup function
      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [])  // ทำงานครั้งเดียวตอน component mount

  // return Provider component พร้อม value
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