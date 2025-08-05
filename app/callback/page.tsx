"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function CallbackPage() {
  const router = useRouter()

  useEffect(() => {
    // Simulate callback processing
    const timer = setTimeout(() => {
      // Check if authentication was successful
      const auth = localStorage.getItem("wallet_authenticated")
      if (auth) {
        router.push("/dashboard")
      } else {
        router.push("/login")
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-md neumorphic-shadow dark:neumorphic-shadow-dark border-0 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-[#4EAAFF] to-[#0B1F56] flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
          <CardTitle className="text-2xl">Processing Authentication</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-slate-600 dark:text-slate-400">Please wait while we complete your authentication...</p>
        </CardContent>
      </Card>
    </div>
  )
}
