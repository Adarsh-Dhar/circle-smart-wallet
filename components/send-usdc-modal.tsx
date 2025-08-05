"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send, AlertTriangle, CheckCircle, Loader2, Fingerprint } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useWallet } from "@/hooks/use-wallet"
import { validateAddress } from "@/lib/wallet"

interface SendUSDCModalProps {
  isOpen: boolean
  onClose: () => void
  currentBalance: string
}

type Step = "form" | "review" | "authenticating" | "processing"
type RiskLevel = "low" | "high"

export function SendUSDCModal({ isOpen, onClose, currentBalance }: SendUSDCModalProps) {
  const [step, setStep] = useState<Step>("form")
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("low")
  const [errors, setErrors] = useState<{ recipient?: string; amount?: string }>({})
  const { toast } = useToast()
  const { sendUSDCTransaction } = useWallet()

  const validateForm = () => {
    const newErrors: { recipient?: string; amount?: string } = {}

    if (!recipient) {
      newErrors.recipient = "Recipient address is required"
    } else if (!validateAddress(recipient)) {
      newErrors.recipient = "Invalid Ethereum address"
    }

    if (!amount) {
      newErrors.amount = "Amount is required"
    } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = "Amount must be a positive number"
    } else if (Number(amount) > Number(currentBalance.replace(/,/g, ""))) {
      newErrors.amount = "Insufficient balance"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleReview = () => {
    if (validateForm()) {
      // Risk assessment based on amount and recipient
      const isHighRisk = Number(amount) > 1000 || recipient.toLowerCase().includes("bad")
      setRiskLevel(isHighRisk ? "high" : "low")
      setStep("review")
    }
  }

  const handleSend = async () => {
    if (riskLevel === "high") {
      setStep("authenticating")

      // Simulate passkey authentication for high-risk transactions
      setTimeout(async () => {
        try {
          // Additional authentication delay for high-risk transactions
          await new Promise((resolve) => setTimeout(resolve, 2000))

          // Simulate compliance check after reauth
          const isBlocked = Math.random() > 0.7 // 30% chance of being blocked

          if (isBlocked) {
            toast({
              title: "Transaction Blocked",
              description: "This transaction was blocked by compliance policy",
              variant: "destructive",
            })
            onClose()
            resetForm()
          } else {
            await processTransaction()
          }
        } catch (error) {
          toast({
            title: "Authentication Failed",
            description: "Please try again",
            variant: "destructive",
          })
          setStep("review")
        }
      }, 100)
    } else {
      await processTransaction()
    }
  }

  const processTransaction = async () => {
    setStep("processing")
    
    try {
      const result = await sendUSDCTransaction(recipient, amount)
      
      if (result.success) {
        toast({
          title: "Transaction Successful",
          description: `Successfully sent $${amount} USDC`,
          className: "border-[#47D6AA] text-[#47D6AA]",
        })
        onClose()
        resetForm()
      } else {
        toast({
          title: "Transaction Failed",
          description: result.error || "Transaction failed",
          variant: "destructive",
        })
        setStep("review")
      }
    } catch (error) {
      toast({
        title: "Transaction Failed",
        description: error instanceof Error ? error.message : "Transaction failed",
        variant: "destructive",
      })
      setStep("review")
    }
  }

  const resetForm = () => {
    setStep("form")
    setRecipient("")
    setAmount("")
    setErrors({})
  }

  const handleClose = () => {
    onClose()
    resetForm()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="relative">
          {/* Diagonal corner trim */}
          <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-[#4EAAFF] to-[#0B1F56] transform rotate-45"></div>
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-white dark:bg-slate-950 transform rotate-45"></div>

          <DialogTitle className="flex items-center gap-2">
            {step === "review" && (
              <Button variant="ghost" size="icon" onClick={() => setStep("form")} className="h-6 w-6">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <Send className="h-5 w-5" />
            Send USDC
          </DialogTitle>
        </DialogHeader>

        {step === "form" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Address</Label>
              <Input
                id="recipient"
                placeholder="0x..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className={errors.recipient ? "border-red-500" : ""}
              />
              {errors.recipient && <p className="text-sm text-red-500">{errors.recipient}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USDC)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={errors.amount ? "border-red-500" : ""}
              />
              {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
              <p className="text-sm text-slate-600 dark:text-slate-400">Available: ${currentBalance}</p>
            </div>

            <Button
              onClick={handleReview}
              className="w-full bg-gradient-to-r from-[#47D6AA] to-[#47D6AA]/80 hover:from-[#47D6AA]/90 hover:to-[#47D6AA]/70 text-white transition-all duration-200"
            >
              Review Transaction
            </Button>
          </div>
        )}

        {step === "review" && (
          <div className="space-y-4">
            <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">To:</span>
                <code className="text-sm font-mono">
                  {recipient.slice(0, 10)}...{recipient.slice(-8)}
                </code>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Amount:</span>
                <span className="font-medium">${amount} USDC</span>
              </div>
            </div>

            {riskLevel === "low" ? (
              <Alert className="border-[#47D6AA] bg-[#47D6AA]/10">
                <CheckCircle className="h-4 w-4 text-[#47D6AA]" />
                <AlertDescription className="text-[#47D6AA]">
                  This transaction appears to be low risk and can proceed normally.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-orange-500 bg-orange-50 dark:bg-orange-950/20">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <AlertDescription className="text-orange-700 dark:text-orange-400">
                  This transaction has been flagged as high risk. Additional authentication will be required.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setStep("form")}
                className="flex-1 border-slate-300 dark:border-slate-600"
              >
                Back
              </Button>
              <Button
                onClick={handleSend}
                className="flex-1 bg-gradient-to-r from-[#47D6AA] to-[#47D6AA]/80 hover:from-[#47D6AA]/90 hover:to-[#47D6AA]/70 text-white transition-all duration-200"
              >
                Send Transaction
              </Button>
            </div>
          </div>
        )}

        {step === "authenticating" && (
          <div className="space-y-4">
            <div className="flex flex-col items-center space-y-4 py-8">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#4EAAFF] to-[#0B1F56] flex items-center justify-center shadow-lg">
                <Fingerprint className="h-10 w-10 text-white" />
              </div>
              <div className="text-center">
                <p className="font-medium text-slate-900 dark:text-white">Additional Authentication Required</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Please complete biometric verification to proceed with this high-risk transaction.
                </p>
              </div>
            </div>
          </div>
        )}

        {step === "processing" && (
          <div className="space-y-4">
            <div className="flex flex-col items-center space-y-4 py-8">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#4EAAFF] to-[#0B1F56] flex items-center justify-center shadow-lg">
                <Loader2 className="h-10 w-10 text-white animate-spin" />
              </div>
              <div className="text-center">
                <p className="font-medium text-slate-900 dark:text-white">Processing Transaction</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Sending {amount} USDC to {recipient.slice(0, 10)}...{recipient.slice(-8)}
                </p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
