"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  imageUrl?: string
}

interface AuthContextType {
  user: User | null
  isLoaded: boolean
  isSignedIn: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      // TODO: Initialize Clerk and check authentication status
      // For now, simulate loading
      const timer = setTimeout(() => {
        setIsLoaded(true)
        // Simulate no user signed in initially
        setUser(null)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [mounted])

  const signOut = async () => {
    // TODO: Implement Clerk sign out
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    isLoaded,
    isSignedIn: !!user,
    signOut,
  }

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return <div className="min-h-screen bg-background" />
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
