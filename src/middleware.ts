import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

// Define protected routes
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

// Define restricted routes
const isRestrictedRoute = createRouteMatcher(['/dashboard/event/new', '/dashboard/expense/new']);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // Protect dashboard routes
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // Restrict access to specific routes
  if (isRestrictedRoute(req)) {
    return new Response('Access Denied', { status: 403 });
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    // Include event and expense routes
    '/event(.*)',
    '/expense(.*)'
  ]
};
