"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Send, TrendingUp, Clock, CheckCircle, XCircle, LogOut, RefreshCw } from "lucide-react"
import { SendUSDCModal } from "@/components/send-usdc-modal"
import { useToast } from "@/hooks/use-toast"
import { useWallet } from "@/hooks/use-wallet"
import { formatAddress } from "@/lib/wallet"

interface Transaction {
  id: string
  recipient: string
  amount: string
  timestamp: string
  status: "approved" | "blocked"
  hash: string
}

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true)
  const [isRefreshingBalance, setIsRefreshingBalance] = useState(false)
  const [lastBalanceUpdate, setLastBalanceUpdate] = useState<Date | null>(null)
  const { toast } = useToast()
  const { 
    isAuthenticated, 
    isInitializing, 
    walletAddress, 
    usdcBalance, 
    logout,
    refreshBalance,
    setBalanceUpdateCallback
  } = useWallet()

  useEffect(() => {
    // Check authentication
    if (!isInitializing && !isAuthenticated) {
      window.location.href = "/login"
      return
    }

    // Fetch transactions when wallet is ready
    if (isAuthenticated && walletAddress) {
      fetchTransactions()
    }
  }, [isAuthenticated, isInitializing, walletAddress])

  // Set up balance update callback
  useEffect(() => {
    if (isAuthenticated) {
      setBalanceUpdateCallback((balance: string) => {
        setLastBalanceUpdate(new Date())
        console.log('Balance updated via callback:', balance)
      })
    }
  }, [isAuthenticated, setBalanceUpdateCallback])

  const fetchTransactions = async () => {
    try {
      setIsLoadingTransactions(true)
      
      // TODO: Replace with actual API call to fetch user transactions
      // For now, we'll show an empty state or loading
      // In a real implementation, this would call:
      // const response = await fetch(`/api/transactions?address=${walletAddress}`)
      // const data = await response.json()
      // setTransactions(data.transactions)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For now, set empty array - transactions will be populated when API is ready
      setTransactions([])
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
      toast({
        title: "Error",
        description: "Failed to load transaction history",
        variant: "destructive"
      })
    } finally {
      setIsLoadingTransactions(false)
    }
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress)
    toast({
      title: "Address copied",
      description: "Wallet address copied to clipboard",
    })
  }

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
  }

  const handleRefreshBalance = async () => {
    try {
      setIsRefreshingBalance(true)
      await refreshBalance()
      setLastBalanceUpdate(new Date())
      toast({
        title: "Balance Updated",
        description: "Your USDC balance has been refreshed",
      })
    } catch (error) {
      console.error('Failed to refresh balance:', error)
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh balance. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsRefreshingBalance(false)
    }
  }

  if (isInitializing) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#4EAAFF] to-[#0B1F56] flex items-center justify-center shadow-lg mx-auto">
            <div className="h-8 w-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-600 dark:text-slate-300">Loading your smart wallet...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[#0B1F56] dark:text-white">Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-300">Manage your smart wallet and USDC transfers</p>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      {/* Wallet Address Card */}
      <Card className="neumorphic-shadow dark:neumorphic-shadow-dark border-0 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">Smart Wallet Address</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="code-block flex-1 mr-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-3 rounded-lg font-mono text-sm">
              {walletAddress || "Loading..."}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={copyAddress}
              className="shrink-0 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600"
              disabled={!walletAddress}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* USDC Balance Card */}
      <Card className="group neumorphic-shadow dark:neumorphic-shadow-dark border-0 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 hover:shadow-inner dark:hover:shadow-inner transition-all duration-300 cursor-pointer hover:-translate-y-1">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-slate-900 dark:text-white">
            <span>USDC Balance</span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRefreshBalance}
                disabled={isRefreshingBalance}
                className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-700"
                title="Refresh USDC balance"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshingBalance ? 'animate-spin' : ''}`} />
              </Button>
              <TrendingUp className="h-5 w-5 text-[#47D6AA] group-hover:scale-110 transition-transform duration-300" />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-4xl font-bold text-[#0B1F56] dark:text-white">${usdcBalance}</div>
            {lastBalanceUpdate && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Last updated: {lastBalanceUpdate.toLocaleTimeString()}
              </p>
            )}
            <Button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-gradient-to-r from-[#47D6AA] to-[#47D6AA]/80 hover:from-[#47D6AA]/90 hover:to-[#47D6AA]/70 text-white transition-all duration-200 shadow-lg hover:shadow-xl"
              size="lg"
            >
              <Send className="mr-2 h-4 w-4" />
              Send USDC
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Faucet Information Alert */}
      {usdcBalance === "0.00" && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold">💡</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Need USDC to test?
              </h3>
              <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                Get test USDC from a faucet and click the refresh button above to update your balance. 
                The balance will also automatically refresh every 30 seconds.
              </p>
              <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                <p>💧 <strong>Faucet:</strong> Visit a Polygon Amoy faucet and send tokens to: <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">{walletAddress}</code></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <Card className="neumorphic-shadow dark:neumorphic-shadow-dark border-0 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white">Recent Transactions</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-300">
            Your latest USDC transfer activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {isLoadingTransactions ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center space-y-4">
                  <div className="h-8 w-8 border-2 border-[#47D6AA] border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-slate-600 dark:text-slate-300">Loading transactions...</p>
                </div>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-slate-400 dark:text-slate-500 mb-4">
                  <Clock className="h-12 w-12 mx-auto mb-2" />
                </div>
                <p className="text-slate-600 dark:text-slate-300">No transactions yet</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Your USDC transfer history will appear here
                </p>
              </div>
            ) : (
              transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {tx.status === "approved" ? (
                        <CheckCircle className="h-5 w-5 text-[#47D6AA]" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-slate-900 dark:text-white">${tx.amount}</span>
                        <span className="text-sm text-slate-600 dark:text-slate-400">to</span>
                        <code className="text-sm bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded font-mono text-slate-900 dark:text-slate-100">
                          {formatAddress(tx.recipient)}
                        </code>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                        <Clock className="h-3 w-3" />
                        <span>{tx.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={tx.status === "approved" ? "default" : "destructive"}
                    className={tx.status === "approved" ? "bg-[#47D6AA] hover:bg-[#47D6AA]/80 text-white" : ""}
                  >
                    {tx.status === "approved" ? "Approved" : "Blocked"}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <SendUSDCModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} currentBalance={usdcBalance} />
    </div>
  )
}
