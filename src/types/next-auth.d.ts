import { Role } from "@prisma/client"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User {
    role: Role
    icon?: string
  }
  interface Session {
    user: {
      userId: string
      name: string
      email: string
      image: string
      role: Role
      icon?: string
    }
  }
}