// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
// import { NextRequest } from 'next/server';

// // Define protected routes
// const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

// // Define restricted routes
// const isRestrictedRoute = createRouteMatcher(['/dashboard/event/new', '/dashboard/expense/new']);

// export default clerkMiddleware(async (auth, req: NextRequest) => {
//   // Protect dashboard routes
//   if (isProtectedRoute(req)) {
//     await auth.protect();
//   }
// });

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//     // Include event and expense routes
//     '/event(.*)',
//     '/expense(.*)'
//   ]
// };


import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

// Define protected routes (require authentication)
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

// Define restricted routes (require admin role)
const isRestrictedRoute = createRouteMatcher([
  '/dashboard/event/new',
  '/dashboard/expense/new',
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  if (isProtectedRoute(req)) {
    const { userId, sessionClaims } = await auth.protect();

    // If user is trying to access a restricted route
    if (isRestrictedRoute(req)) {
      const role = sessionClaims?.metadata?.role;

      if (role !== 'admin') {
        // Redirect to unauthorized page or return 403
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    // Include event and expense routes
    '/event(.*)',
    '/expense(.*)'
  ]
};
