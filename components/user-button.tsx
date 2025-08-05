"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Settings } from "lucide-react"
import { useRouter } from "next/navigation"

export function UserButton() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userAddress, setUserAddress] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated (mock implementation)
    const auth = localStorage.getItem("wallet_authenticated")
    const address = localStorage.getItem("wallet_address")
    setIsAuthenticated(!!auth)
    setUserAddress(address || "")
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem("wallet_authenticated")
    localStorage.removeItem("wallet_address")
    setIsAuthenticated(false)
    router.push("/login")
  }

  if (!isAuthenticated) {
    return (
      <Button
        onClick={() => router.push("/login")}
        className="bg-gradient-to-r from-[#47D6AA] to-[#47D6AA]/80 hover:from-[#47D6AA]/90 hover:to-[#47D6AA]/70 text-white transition-all duration-200"
      >
        Connect Wallet
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-gradient-to-br from-[#4EAAFF] to-[#0B1F56] text-white">
              {userAddress.slice(2, 4).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">Smart Wallet</p>
            <p className="w-[200px] truncate text-sm text-muted-foreground font-mono">{userAddress}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
