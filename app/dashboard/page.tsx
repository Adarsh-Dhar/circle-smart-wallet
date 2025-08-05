"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Send, TrendingUp, Clock, CheckCircle, XCircle, LogOut } from "lucide-react"
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
  const { toast } = useToast()
  const { 
    isAuthenticated, 
    isInitializing, 
    walletAddress, 
    usdcBalance, 
    logout 
  } = useWallet()

  useEffect(() => {
    // Check authentication
    if (!isInitializing && !isAuthenticated) {
      window.location.href = "/login"
      return
    }

    // Transaction data - in a real app, this would come from the blockchain
    setTransactions([
      {
        id: "1",
        recipient: "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
        amount: "100.00",
        timestamp: "2024-01-15 14:30:22",
        status: "approved",
        hash: "0xabc123...",
      },
      {
        id: "2",
        recipient: "0x8ba1f109551bD432803012645Hac136c22C177ec",
        amount: "2,500.00",
        timestamp: "2024-01-15 12:15:10",
        status: "blocked",
        hash: "0xdef456...",
      },
      {
        id: "3",
        recipient: "0x1234567890123456789012345678901234567890",
        amount: "50.25",
        timestamp: "2024-01-14 16:45:33",
        status: "approved",
        hash: "0xghi789...",
      },
    ])
  }, [isAuthenticated, isInitializing])

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
            <TrendingUp className="h-5 w-5 text-[#47D6AA] group-hover:scale-110 transition-transform duration-300" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-4xl font-bold text-[#0B1F56] dark:text-white">${usdcBalance}</div>
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
            {transactions.map((tx) => (
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
            ))}
          </div>
        </CardContent>
      </Card>

      <SendUSDCModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} currentBalance={usdcBalance} />
    </div>
  )
}
