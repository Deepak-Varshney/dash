'use server'

import { checkRole } from '@/utils/roles'
import { clerkClient } from '@clerk/nextjs/server'

// export async function setRole(formData: any) {
//   const client = await clerkClient()

//   // Check that the user trying to set the role is an admin
//   if (!checkRole('admin')) {
//     return { message: 'Not Authorized' }
//   }

//   try {
//     const res = await client.users.updateUserMetadata(formData.get('id') as string, {
//       publicMetadata: { role: formData.get('role') },
//     })
//     return { message: res.publicMetadata }
//   } catch (err) {
//     return { message: err }
//   }
// }

// export async function removeRole(formData: any) {
//   const client = await clerkClient()

//   try {
//     const res = await client.users.updateUserMetadata(formData.get('id') as string, {
//       publicMetadata: { role: null },
//     })
//     return { message: res.publicMetadata }
//   } catch (err) {
//     return { message: err }
//   }
// }


export async function setRole(formData: FormData): Promise<void> {
  const userId = formData.get('id') as string
  const role = formData.get('role') as string

  // ❗️Ensure this works server-side — see note below
  const isAuthorized = await checkRole('admin')
  if (!isAuthorized) {
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

  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { role: null },
    })
  } catch (err) {
    console.error('Failed to remove role:', err)
  }
}
