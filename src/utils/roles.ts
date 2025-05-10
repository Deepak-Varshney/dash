import { Roles } from '@/types/globals'
import { auth } from '@clerk/nextjs/server'

export const checkRole = async (role: Roles) => {
  const { sessionClaims } = await auth()
  const userRole = sessionClaims?.metadata?.role as Roles
  return userRole === role
}
