"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Eye, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { useRouter } from "next/navigation"

interface RiskLog {
  id: string
  txHash: string
  amount: string
  recipient: string
  riskFlag: "high" | "medium" | "low"
  status: "approved" | "blocked" | "pending"
  ruleTriggered: string
  timestamp: string
  details: {
    rule: string
    verdict: string
    reason: string
    riskScore: number
  }
}

export default function LogsPage() {
  const [logs, setLogs] = useState<RiskLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<RiskLog[]>([])
  const [selectedLog, setSelectedLog] = useState<RiskLog | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [riskFilter, setRiskFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const router = useRouter()

  const logsPerPage = 10

  useEffect(() => {
    // Check authentication
    const auth = localStorage.getItem("wallet_authenticated")
    if (!auth) {
      router.push("/login")
      return
    }

    // Risk log data - in a real app, this would come from the blockchain and compliance system
    const mockLogs: RiskLog[] = [
      {
        id: "1",
        txHash: "0xabc123def456789012345678901234567890abcdef123456789012345678901234",
        amount: "2500.00",
        recipient: "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
        riskFlag: "high",
        status: "blocked",
        ruleTriggered: "Amount > $1000",
        timestamp: "2024-01-15 14:30:22",
        details: {
          rule: "High Value Transaction Rule",
          verdict: "DENIED",
          reason: "Transaction amount exceeds $1000 threshold and requires additional verification",
          riskScore: 85,
        },
      },
      {
        id: "2",
        txHash: "0xdef456abc789012345678901234567890123456789abcdef012345678901234567",
        amount: "100.00",
        recipient: "0x8ba1f109551bD432803012645Hac136c22C177ec",
        riskFlag: "low",
        status: "approved",
        ruleTriggered: "Standard Check",
        timestamp: "2024-01-15 12:15:10",
        details: {
          rule: "Standard Compliance Check",
          verdict: "APPROVED",
          reason: "Transaction passed all compliance checks",
          riskScore: 15,
        },
      },
      {
        id: "3",
        txHash: "0x789012345678901234567890123456789012345678901234567890123456789abc",
        amount: "750.50",
        recipient: "0x1234567890123456789012345678901234567890",
        riskFlag: "medium",
        status: "pending",
        ruleTriggered: "Manual Review",
        timestamp: "2024-01-14 16:45:33",
        details: {
          rule: "Manual Review Required",
          verdict: "PENDING",
          reason: "Transaction flagged for manual compliance review",
          riskScore: 55,
        },
      },
    ]

    setLogs(mockLogs)
    setFilteredLogs(mockLogs)
  }, [router])

  useEffect(() => {
    let filtered = logs

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.txHash.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((log) => log.status === statusFilter)
    }

    // Risk filter
    if (riskFilter !== "all") {
      filtered = filtered.filter((log) => log.riskFlag === riskFilter)
    }

    setFilteredLogs(filtered)
    setCurrentPage(1)
  }, [logs, searchTerm, statusFilter, riskFilter])

  const totalPages = Math.ceil(filteredLogs.length / logsPerPage)
  const startIndex = (currentPage - 1) * logsPerPage
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + logsPerPage)

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "bg-red-500 hover:bg-red-600 text-white"
      case "medium":
        return "bg-orange-500 hover:bg-orange-600 text-white"
      case "low":
        return "bg-[#47D6AA] hover:bg-[#47D6AA]/80 text-white"
      default:
        return "bg-slate-500 hover:bg-slate-600 text-white"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-[#47D6AA]" />
      case "blocked":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-orange-500" />
      default:
        return null
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatTxHash = (hash: string) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`
  }

  const openDetails = (log: RiskLog) => {
    setSelectedLog(log)
    setIsDetailOpen(true)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-[#0B1F56] dark:text-white">Risk Logs</h1>
        <p className="text-slate-600 dark:text-slate-300">Transaction screening results and compliance details</p>
      </div>

      {/* Filters */}
      <Card className="neumorphic-shadow dark:neumorphic-shadow-dark border-0 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <Input
                  placeholder="Search by address or tx hash..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Risk Level</label>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600">
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card className="neumorphic-shadow dark:neumorphic-shadow-dark border-0 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white">Transaction Logs</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-300">
            Showing {startIndex + 1}-{Math.min(startIndex + logsPerPage, filteredLogs.length)} of {filteredLogs.length}{" "}
            results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-2 text-slate-700 dark:text-slate-300 font-medium">Tx Hash</th>
                  <th className="text-left py-3 px-2 text-slate-700 dark:text-slate-300 font-medium">Amount</th>
                  <th className="text-left py-3 px-2 text-slate-700 dark:text-slate-300 font-medium">Recipient</th>
                  <th className="text-left py-3 px-2 text-slate-700 dark:text-slate-300 font-medium">Risk</th>
                  <th className="text-left py-3 px-2 text-slate-700 dark:text-slate-300 font-medium">Status</th>
                  <th className="text-left py-3 px-2 text-slate-700 dark:text-slate-300 font-medium">Rule</th>
                  <th className="text-left py-3 px-2 text-slate-700 dark:text-slate-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <td className="py-3 px-2">
                      <code className="text-sm bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded font-mono text-slate-900 dark:text-slate-100">
                        {formatTxHash(log.txHash)}
                      </code>
                    </td>
                    <td className="py-3 px-2 font-medium text-slate-900 dark:text-white">${log.amount}</td>
                    <td className="py-3 px-2">
                      <code className="text-sm bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded font-mono text-slate-900 dark:text-slate-100">
                        {formatAddress(log.recipient)}
                      </code>
                    </td>
                    <td className="py-3 px-2">
                      <Badge className={getRiskBadgeColor(log.riskFlag)}>{log.riskFlag.toUpperCase()}</Badge>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(log.status)}
                        <span className="capitalize text-slate-900 dark:text-white">{log.status}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm text-slate-600 dark:text-slate-400">{log.ruleTriggered}</td>
                    <td className="py-3 px-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDetails(log)}
                        className="hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Previous
              </Button>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-lg bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-white">Compliance Details</DialogTitle>
            <DialogDescription className="text-slate-600 dark:text-slate-300">
              Transaction screening results and risk assessment
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Transaction Hash</label>
                  <div className="code-block mt-1 text-xs break-all bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                    {selectedLog.txHash}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Amount</label>
                  <p className="font-medium mt-1 text-slate-900 dark:text-white">${selectedLog.amount} USDC</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Recipient</label>
                <div className="code-block mt-1 break-all bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                  {selectedLog.recipient}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Risk Score</label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          selectedLog.details.riskScore >= 70
                            ? "bg-red-500"
                            : selectedLog.details.riskScore >= 40
                              ? "bg-orange-500"
                              : "bg-[#47D6AA]"
                        }`}
                        style={{ width: `${selectedLog.details.riskScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {selectedLog.details.riskScore}/100
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Status</label>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIcon(selectedLog.status)}
                    <Badge
                      className={`${
                        selectedLog.status === "approved"
                          ? "bg-[#47D6AA] hover:bg-[#47D6AA]/80 text-white"
                          : selectedLog.status === "blocked"
                            ? "bg-red-500 hover:bg-red-600 text-white"
                            : "bg-orange-500 hover:bg-orange-600 text-white"
                      }`}
                    >
                      {selectedLog.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Rule Triggered</label>
                  <p className="mt-1 font-medium text-slate-900 dark:text-white">{selectedLog.details.rule}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Verdict</label>
                  <p
                    className={`mt-1 font-bold ${
                      selectedLog.details.verdict === "APPROVED"
                        ? "text-[#47D6AA]"
                        : selectedLog.details.verdict === "DENIED"
                          ? "text-red-500"
                          : "text-orange-500"
                    }`}
                  >
                    {selectedLog.details.verdict}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Reason</label>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{selectedLog.details.reason}</p>
                </div>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400">Timestamp: {selectedLog.timestamp}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
