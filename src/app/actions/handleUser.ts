// 'use server'

// import { clerkClient } from "@clerk/nextjs/server"

// type CreateUserInput = {
//   firstName: string
//   lastName: string
//   emailAddress: string
//   password: string
//   address: string
// }

// export async function createUser(data: CreateUserInput) {
//   const client = await clerkClient()
//   const response = await client.users.createUser({
//     firstName: data.firstName,
//     lastName: data.lastName,
//     emailAddress: [data.emailAddress],
//     password: data.password,
//     publicMetadata: {
//       address: data.address,
//     },
//   })

//   return response
// }


'use server'

import { clerkClient } from '@clerk/nextjs/server'

type CreateUserInput = {
  firstName: string
  lastName: string
  emailAddress: string
  address: string
}
export async function createUser(data: CreateUserInput) {
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