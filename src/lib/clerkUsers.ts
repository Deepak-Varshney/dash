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




export async function getUsers({ page = 1, limit = 10, search = '' }) {
  const offset = (page - 1) * limit;
  const client = await clerkClient();

  const { data, totalCount } = await client.users.getUserList({
    limit: Number(limit),
    offset: offset,
    ...(search && { query: search })
  });
  const plainUsers = data.map((user) => sanitize(user));
  

  return {
    plainUsers,
    totalCount,
    currentPage: page,
    totalPages: Math.ceil(totalCount / limit)
  };
}

export async function getUsersByRoleCounts() {
  const client = await clerkClient();
  const limit = 100; // adjust based on Clerk account limits
  let offset = 0;
  let hasMore = true;
  const roleCounts: Record<string, number> = {};

  while (hasMore) {
    const { data: users, totalCount } = await client.users.getUserList({
      limit,
      offset
    });

    users.forEach((user) => {
      const role: string = (user.publicMetadata?.role as string) ?? 'unknown';
      roleCounts[role] = (roleCounts[role] || 0) + 1;
    });

    offset += users.length;
    hasMore = offset < totalCount;
  }

  // Convert to array for charting
  const result = Object.entries(roleCounts).map(([role, count]) => ({
    id: role,
    name: role.charAt(0).toUpperCase() + role.slice(1),
    value: count
  }));

  return result;
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

export async function getAllUsers(){
  const client = await clerkClient();
  const users = await client.users.getUserList({
  });
  return sanitize(users.data);
}