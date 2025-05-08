export async function getUsersFromClerk() {
  const res = await fetch('https://api.clerk.com/v1/users', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch users: ${res.statusText}`);
  }

  const data = await res.json();
  return data;

}

export async function getSupervisorsFromClerk() {
  const res = await fetch('https://api.clerk.com/v1/users', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch users: ${res.statusText}`);
  }

  const data = await res.json();

  // Filter users whose publicMetadata.role is 'supervisor'
  const supervisors = data.filter(
    (user: any) => user.public_metadata?.role === 'supervisor'
  );
  return supervisors;
}
