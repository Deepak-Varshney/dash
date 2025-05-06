export async function getUsersFromClerk() {
    const res = await fetch('https://api.clerk.com/v1/users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // optional, avoids caching on server
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch users: ${res.statusText}`);
    }

    const data = await res.json();
    console.log(data.length)
    return data;
  }