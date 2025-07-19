import NextAuth, { Session } from "next-auth"
import Discord from "next-auth/providers/discord"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/prisma"
import { Role } from "@prisma/client"

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: 'jwt'
  },
  providers: [Discord],
  callbacks: {
    session: async ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          dId: token.id as string,
          token: token.token,
          userId: token.sub,
          icon: token.icon as string,
          name: token.name,
          image: token.image as string,
          role: token.role as Role
        }
      }
    },
    jwt: ({ token, account, user }) => {
      if (account) {
        return {
          ...token,
          id: account?.providerAccountId,
          token: account?.access_token,
          role: user?.role,
          icon: user?.icon,
          image: user?.image,
          name: user?.name
        }
      }
      return token
    }
  },
  adapter: PrismaAdapter(prisma),
})

export const hasRole = (role: Role, session: Session | null) => {
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
