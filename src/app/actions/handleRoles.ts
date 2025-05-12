'use server'

import { clerkClient, currentUser } from '@clerk/nextjs/server'


export async function setRole(formData: FormData): Promise<void> {
  const userId = formData.get('id') as string
  const role = formData.get('role') as string

  // ❗️Ensure this works server-side — see note below
  const isAuthorized = await currentUser()
  if (isAuthorized?.publicMetadata?.role !== 'admin') {
    console.error('Not authorized to set role')
    return
  }

  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { role },
    })
  } catch (err) {
    console.error('Failed to set role:', err)
  }
}

export async function removeRole(formData: FormData): Promise<void> {
  const userId = formData.get('id') as string
  const isAuthorized = await currentUser()
  if (isAuthorized?.publicMetadata?.role !== 'admin') {
    console.error('Not authorized to set role')
    return
  }
  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { role: null },
    })
  } catch (err) {
    console.error('Failed to remove role:', err)
  }
}

