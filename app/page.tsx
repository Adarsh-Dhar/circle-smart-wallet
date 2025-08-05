import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Zap, Lock, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-16">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#0B1F56] via-[#4EAAFF] to-[#0B1F56] bg-clip-text text-transparent dark:from-[#4EAAFF] dark:via-white dark:to-[#47D6AA]">
            Smart Wallet Security
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Passkey-based smart contract wallet with real-time compliance screening for secure USDC transfers
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-[#47D6AA] to-[#47D6AA]/80 hover:from-[#47D6AA]/90 hover:to-[#47D6AA]/70 text-white transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Link href="/login">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 bg-transparent"
          >
            <Link href="/dashboard">View Dashboard</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8">
        <Card className="group neumorphic-shadow dark:neumorphic-shadow-dark border-0 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#4EAAFF] to-[#0B1F56] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-slate-900 dark:text-white">Passkey Authentication</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300">
              Secure, passwordless authentication using WebAuthn and biometric verification
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="group neumorphic-shadow dark:neumorphic-shadow-dark border-0 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#47D6AA] to-[#47D6AA]/80 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-slate-900 dark:text-white">Real-time Compliance</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300">
              Dynamic risk assessment and compliance screening for every transaction
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="group neumorphic-shadow dark:neumorphic-shadow-dark border-0 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#4EAAFF] to-[#47D6AA] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-slate-900 dark:text-white">Smart Contract Wallet</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300">
              Advanced wallet functionality with programmable security controls
            </CardDescription>
          </CardHeader>
        </Card>
      </section>
    </div>
  )
}
