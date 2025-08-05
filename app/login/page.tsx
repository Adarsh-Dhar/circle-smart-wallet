"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Fingerprint, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handlePasskeyLogin = async () => {
    setIsAuthenticating(true)
    setError("")

    try {
      // Mock WebAuthn implementation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate random success/failure for demo
      if (Math.random() > 0.2) {
        setSuccess(true)

        // Mock wallet address generation
        const mockAddress =
          "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")

        localStorage.setItem("wallet_authenticated", "true")
        localStorage.setItem("wallet_address", mockAddress)

        setTimeout(() => {
          router.push("/dashboard")
        }, 1500)
      } else {
        throw new Error("Passkey authentication failed")
      }
    } catch (err) {
      setError("Authentication failed. Please try again.")
    } finally {
      setIsAuthenticating(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-md neumorphic-shadow dark:neumorphic-shadow-dark border-0 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 transition-all duration-300">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-[#4EAAFF] to-[#0B1F56] flex items-center justify-center shadow-lg">
            <Fingerprint className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-slate-900 dark:text-white">Welcome Back</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-300">
            Sign in to your smart wallet using your passkey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-gradient-to-r from-[#47D6AA] to-[#47D6AA]/80 hover:from-[#47D6AA]/90 hover:to-[#47D6AA]/70 text-white h-12 transition-all duration-200 shadow-lg hover:shadow-xl"
            size="lg"
          >
            <Fingerprint className="mr-2 h-5 w-5" />
            Sign in with Passkey
          </Button>

          <p className="text-center text-sm text-slate-600 dark:text-slate-400">
            New to SmartWallet?{" "}
            <button className="text-[#0B1F56] dark:text-[#4EAAFF] hover:underline transition-colors duration-200">
              Create account
            </button>
          </p>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
              <Fingerprint className="h-5 w-5" />
              Passkey Authentication
            </DialogTitle>
            <DialogDescription className="text-slate-600 dark:text-slate-300">
              Use your device's biometric authentication to sign in
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {error && (
              <Alert variant="destructive" className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-800 dark:text-red-400">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-[#47D6AA] bg-[#47D6AA]/10 dark:bg-[#47D6AA]/20">
                <CheckCircle className="h-4 w-4 text-[#47D6AA]" />
                <AlertDescription className="text-[#47D6AA] dark:text-[#47D6AA]">
                  Authentication successful! Redirecting...
                </AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col items-center space-y-4 py-8">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#4EAAFF] to-[#0B1F56] flex items-center justify-center shadow-lg">
                {isAuthenticating ? (
                  <Loader2 className="h-10 w-10 text-white animate-spin" />
                ) : success ? (
                  <CheckCircle className="h-10 w-10 text-white" />
                ) : (
                  <Fingerprint className="h-10 w-10 text-white" />
                )}
              </div>

              <div className="text-center">
                <p className="font-medium text-slate-900 dark:text-white">
                  {isAuthenticating ? "Authenticating..." : success ? "Success!" : "Ready to authenticate"}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {isAuthenticating
                    ? "Please complete the biometric verification"
                    : success
                      ? "Taking you to your dashboard"
                      : "Click the button below to start"}
                </p>
              </div>
            </div>

            <Button
              onClick={handlePasskeyLogin}
              disabled={isAuthenticating || success}
              className="w-full bg-gradient-to-r from-[#47D6AA] to-[#47D6AA]/80 hover:from-[#47D6AA]/90 hover:to-[#47D6AA]/70 text-white transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isAuthenticating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : success ? (
                "Redirecting..."
              ) : (
                "Authenticate with Passkey"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
