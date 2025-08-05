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

  const validateForm = () => {
    const newErrors: { recipient?: string; amount?: string } = {}

    if (!recipient) {
      newErrors.recipient = "Recipient address is required"
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(recipient)) {
      newErrors.recipient = "Invalid Ethereum address"
    }

    if (!amount) {
      newErrors.amount = "Amount is required"
    } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = "Amount must be a positive number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleReview = () => {
    if (validateForm()) {
      // Simulate risk assessment
      const isHighRisk = Number(amount) > 1000 || recipient.toLowerCase().includes("bad")
      setRiskLevel(isHighRisk ? "high" : "low")
      setStep("review")
    }
  }

  const handleSend = async () => {
    if (riskLevel === "high") {
      setStep("authenticating")

      // Simulate passkey authentication
      setTimeout(async () => {
        try {
          // Mock authentication delay
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
            setStep("processing")
            setTimeout(() => {
              toast({
                title: "Transaction Sent",
                description: `Successfully sent $${amount} USDC`,
                className: "border-[#47D6AA] text-[#47D6AA]",
              })
              onClose()
              resetForm()
            }, 2000)
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
      setStep("processing")
      setTimeout(() => {
        toast({
          title: "Transaction Sent",
          description: `Successfully sent $${amount} USDC`,
          className: "border-[#47D6AA] text-[#47D6AA]",
        })
        onClose()
        resetForm()
      }, 2000)
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
                  <Badge className="bg-[#47D6AA] hover:bg-[#47D6AA]/80 text-white mr-2">✅ Ready to Send</Badge>
                  This transaction passed all compliance checks
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive" className="border-orange-500 bg-orange-50 dark:bg-orange-950/20">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800 dark:text-orange-400">
                  <Badge variant="destructive" className="bg-orange-500 hover:bg-orange-600 mr-2">
                    ⚠️ High Risk
                  </Badge>
                  This transaction requires passkey reconfirmation
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleSend}
              disabled={riskLevel === "high"}
              className={`w-full transition-all duration-200 ${
                riskLevel === "high"
                  ? "bg-slate-400 hover:bg-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#47D6AA] to-[#47D6AA]/80 hover:from-[#47D6AA]/90 hover:to-[#47D6AA]/70"
              } text-white`}
            >
              {riskLevel === "high" ? (
                <>
                  <Fingerprint className="mr-2 h-4 w-4" />
                  Requires Passkey Reconfirmation
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Transaction
                </>
              )}
            </Button>

            {riskLevel === "high" && (
              <Button
                onClick={handleSend}
                variant="outline"
                className="w-full border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20 bg-transparent"
              >
                <Fingerprint className="mr-2 h-4 w-4" />
                Click to Re-authenticate
              </Button>
            )}
          </div>
        )}

        {step === "authenticating" && (
          <div className="flex flex-col items-center space-y-4 py-8">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#4EAAFF] to-[#0B1F56] flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
            <div className="text-center">
              <p className="font-medium">Authenticating...</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Please complete the passkey verification</p>
            </div>
          </div>
        )}

        {step === "processing" && (
          <div className="flex flex-col items-center space-y-4 py-8">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#47D6AA] to-[#47D6AA]/80 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
            <div className="text-center">
              <p className="font-medium">Processing Transaction...</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Your USDC transfer is being processed</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
