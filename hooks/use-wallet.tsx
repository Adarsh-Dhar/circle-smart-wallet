"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

interface WalletContextType {
  isAuthenticated: boolean
  isInitializing: boolean
  walletAddress: string
  usdcBalance: string
  smartAccount: any
  login: (username: string) => Promise<void>
  logout: () => void
  sendUSDCTransaction: (toAddress: string, amount: string) => Promise<{ success: boolean; hash?: string; error?: string }>
  refreshBalance: () => Promise<void>
  setBalanceUpdateCallback: (callback: ((balance: string) => void) | undefined) => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const [walletAddress, setWalletAddress] = useState("")
  const [usdcBalance, setUsdcBalance] = useState("0.00")
  const [smartAccount, setSmartAccount] = useState<any>(null)
  const [balanceUpdateCallback, setBalanceUpdateCallback] = useState<((balance: string) => void) | undefined>(undefined)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    initializeWallet()
  }, [])

  // Add periodic balance refresh when authenticated
  useEffect(() => {
    if (!isAuthenticated || !smartAccount) return

    // Refresh balance immediately
    refreshBalance()

    // Set up periodic refresh every 30 seconds
    const interval = setInterval(() => {
      refreshBalance()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [isAuthenticated, smartAccount])

  const initializeWallet = async () => {
    try {
      const auth = localStorage.getItem("wallet_authenticated")
      const address = localStorage.getItem("wallet_address")
      const accountData = localStorage.getItem("smart_account")

      if (auth && address) {
        setIsAuthenticated(true)
        setWalletAddress(address)
        
        if (accountData) {
          try {
            const account = JSON.parse(accountData)
            setSmartAccount(account)
            await refreshBalance()
          } catch (error) {
            console.error('Failed to restore smart account:', error)
            // Clear invalid data
            localStorage.removeItem("smart_account")
          }
        }
      }
    } catch (error) {
      console.error('Wallet initialization failed:', error)
    } finally {
      setIsInitializing(false)
    }
  }

  const login = async (username: string) => {
    try {
      setIsInitializing(true)
      
      // Check if WebAuthn is supported
      if (!navigator.credentials) {
        throw new Error('WebAuthn is not supported in this browser')
      }

      // Dynamic import to prevent chunk loading errors
      const {
        createWebAuthnCredential,
        getWebAuthnCredential,
        createSmartAccount,
        getUSDCBalance
      } = await import('@/lib/wallet')

      // Try to get existing credential first
      let credential: PublicKeyCredential
      try {
        credential = await getWebAuthnCredential()
      } catch (error) {
        // If no existing credential, create a new one
        credential = await createWebAuthnCredential(username)
      }

      // Create smart account
      const account = await createSmartAccount(credential)
      setSmartAccount(account)

      // Get wallet address
      const address = account.address
      setWalletAddress(address)

      // Store authentication state
      localStorage.setItem("wallet_authenticated", "true")
      localStorage.setItem("wallet_address", address)
      localStorage.setItem("smart_account", JSON.stringify(account))

      setIsAuthenticated(true)
      await refreshBalance()

      toast({
        title: "Authentication Successful",
        description: "Your smart wallet is ready to use",
        className: "border-[#47D6AA] text-[#47D6AA]",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error('Login failed:', error)
      toast({
        title: "Authentication Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsInitializing(false)
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    setWalletAddress("")
    setUsdcBalance("0.00")
    setSmartAccount(null)
    
    localStorage.removeItem("wallet_authenticated")
    localStorage.removeItem("wallet_address")
    localStorage.removeItem("smart_account")
    
    router.push("/login")
  }

  const sendUSDCTransaction = async (toAddress: string, amount: string) => {
    try {
      if (!smartAccount) {
        throw new Error('Smart account not initialized')
      }

      // Dynamic import to prevent chunk loading errors
      const {
        sendUSDC,
        validateAddress,
        parseUSDCAmount
      } = await import('@/lib/wallet')

      if (!validateAddress(toAddress)) {
        throw new Error('Invalid recipient address')
      }

      const amountBigInt = parseUSDCAmount(amount)
      
      const { userOpHash, receipt } = await sendUSDC(smartAccount, toAddress, amountBigInt)
      
      // Update balance after successful transaction
      await refreshBalance()

      toast({
        title: "Transaction Successful",
        description: `Successfully sent ${amount} USDC`,
        className: "border-[#47D6AA] text-[#47D6AA]",
      })

      return { success: true, hash: userOpHash }
    } catch (error) {
      console.error('USDC transaction failed:', error)
      const errorMessage = error instanceof Error ? error.message : "Transaction failed"
      
      toast({
        title: "Transaction Failed",
        description: errorMessage,
        variant: "destructive",
      })

      return { success: false, error: errorMessage }
    }
  }

  const refreshBalance = async () => {
    try {
      if (!smartAccount) {
        console.log('No smart account available for balance refresh')
        return
      }
      
      console.log('Refreshing USDC balance for address:', smartAccount.address)
      
      // Dynamic import to prevent chunk loading errors
      const { getUSDCBalance } = await import('@/lib/wallet')
      const balance = await getUSDCBalance(smartAccount)
      
      console.log('Balance updated:', { oldBalance: usdcBalance, newBalance: balance })
      setUsdcBalance(balance)
      
      // Notify listeners of balance update
      if (balanceUpdateCallback) {
        balanceUpdateCallback(balance)
      }
    } catch (error) {
      console.error('Failed to refresh balance:', error)
      // Don't show toast for automatic refreshes to avoid spam
      // Only show error for manual refreshes
    }
  }

  const value: WalletContextType = {
    isAuthenticated,
    isInitializing,
    walletAddress,
    usdcBalance,
    smartAccount,
    login,
    logout,
    sendUSDCTransaction,
    refreshBalance,
    setBalanceUpdateCallback,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
} 