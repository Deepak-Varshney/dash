import { auth } from "@clerk/nextjs/server";

export async function getUserIdFromRequest(request: Request): Promise<string | null> {
  const { userId } =  await auth();
  return userId ?? null;
}