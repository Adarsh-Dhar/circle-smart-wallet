"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserButton } from "@/components/user-button"
import { Menu, X, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/logs", label: "Risk Logs" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#4EAAFF] to-[#0B1F56] group-hover:shadow-lg transition-all duration-200">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#0B1F56] dark:text-white transition-colors duration-200">
              SmartWallet
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-all duration-200 hover:text-[#0B1F56] dark:hover:text-white relative",
                  pathname === item.href
                    ? "text-[#0B1F56] dark:text-white after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-[#4EAAFF] after:to-[#0B1F56] after:rounded-full"
                    : "text-slate-600 dark:text-slate-400",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <UserButton />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors duration-300">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block px-3 py-2 text-base font-medium rounded-md transition-colors duration-200",
                    pathname === item.href
                      ? "bg-slate-100 text-[#0B1F56] dark:bg-slate-800 dark:text-white"
                      : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="px-3 py-2">
                <UserButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
