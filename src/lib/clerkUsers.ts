import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
function sanitize(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(sanitize);
  } else if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, sanitize(value)])
    );
  }
  return obj;
}

export async function getUsers() {
  const client = await clerkClient();
  const users = await client.users.getUserList({ limit: 100 });

  const plainUsers = users.data.map((user) => sanitize(user));

  return plainUsers;
}


type CreateUserParams = {
  firstName: string
  lastName: string
  email: string
  password: string
  address: string
}

export async function createUser({
  firstName,
  lastName,
  email,
  password,
  address,
}: CreateUserParams) {
  const client = await clerkClient()
  const response = await client.users.createUser({
    firstName,
    lastName,
    emailAddress: [email],
    password,
    publicMetadata: {
      address,
    },
  })

  return response
}


export async function getUserById(userId: string) {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return sanitize(user);
}