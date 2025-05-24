'use server'

import { clerkClient, currentUser } from '@clerk/nextjs/server'

type CreateUserInput = {
  firstName: string
  lastName: string
  emailAddress: string
  address: string
}
export async function createUser(data: CreateUserInput) {
  const user = await currentUser();
  if (!user) {
    throw new Error('User is not authenticated.')
  }
  if (user.publicMetadata?.role !== 'admin') {
    throw new Error('User does not have permission to create other users.')
  }
  const { firstName, lastName, emailAddress, address } = data
  const client = await clerkClient()
  try {
    const response = await client.users.createUser({
      firstName,
      lastName,
      emailAddress: [emailAddress], // Clerk expects an array for emailAddress
      skipPasswordRequirement: true,
      publicMetadata: {
        address,
        role:'user',
      }
    })

    return response
  } catch (error: any) {
    console.error('Error creating user:', error)
    console.error('Clerk error details:', error.errors) // Log Clerk's error details
    throw error // Rethrow error to be handled by the API route
  }
}


export async function deleteUser(userId: string) {
  const client = await clerkClient()
  try {
    await client.users.deleteUser(userId)
  } catch (error: any) {
    console.error('Error deleting user:', error)
    throw error // Rethrow error to be handled by the API route
  }
}

type UpdateUserInput = {
  userId: string
  firstName?: string
  lastName?: string
  emailAddress?: string
  address?: string
}

export async function updateUser(data: UpdateUserInput) {
  const user = await currentUser()
  if (!user) {
    throw new Error('User is not authenticated.')
  }

  if (user.publicMetadata?.role !== 'admin') {
    throw new Error('User does not have permission to update other users.')
  }

  const { userId, firstName, lastName, emailAddress, address } = data

  try {
    // Get current user details to preserve existing metadata
    const client = await clerkClient()
    const existingUser = await client.users.getUser(userId)

    // Merge the existing publicMetadata to preserve fields like `role`
    const updatedMetadata = {
      ...existingUser.publicMetadata,
      ...(address && { address }), // Only update address if provided
    }

    const updatedUser = await client.users.updateUser(userId, {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(emailAddress && { emailAddress: [emailAddress] }),
      publicMetadata: updatedMetadata,
    })

    return updatedUser
  } catch (error: any) {
    console.error('Error updating user:', error)
    console.error('Clerk error details:', error.errors)
    throw error
  }
}