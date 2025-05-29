import { currentUser } from "@clerk/nextjs/server"

export async function getTicketAccessFilter() {
  const user = await currentUser()

  if (!user) throw new Error("User not authenticated")

  const role = user.publicMetadata?.role
  const clerkId = user.id

  if (role === "admin") {
    return {} // No filtering for admin
  }

  if (role === "supervisor") {
    return { "assignedTo.clerkId": clerkId }
  }

  // Regular user
  return { "createdBy.clerkId": clerkId }
}
