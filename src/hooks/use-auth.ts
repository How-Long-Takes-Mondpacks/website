"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { Role } from "@prisma/client"

export function useAuth() {
  const { data: session, status } = useSession()
  const isLoading = status === "loading"
  const isAuthenticated = status === "authenticated"

  // Helper function to check if user has a specific role
  const hasRole = (role: Role) => {
    if (role === Role.Public) return true
    if (!session?.user?.role) return false

    const sessionRole = session.user.role

    switch(role) {
      case "SuperAdmin": return sessionRole === 'SuperAdmin'
      case 'Admin': return sessionRole === 'SuperAdmin' || sessionRole === 'Admin'
      case 'Editor': return sessionRole === 'SuperAdmin' || sessionRole === 'Admin' || sessionRole === 'Editor'
      case 'User': return sessionRole === 'SuperAdmin' || sessionRole === 'Admin' || sessionRole === 'Editor' || sessionRole === 'User'
    }
  }

  return {
    status,
    session,
    user: session?.user || null,
    isLoading,
    isAuthenticated,
    hasRole,
    signInDiscord: () => signIn("discord"),
    signInCredentials: () => signIn("credentials"),
    signOut: () => signOut(),
  }
}
