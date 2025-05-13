import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Tambahkan semua path Clerk sebagai public
const isPublicRoute = createRouteMatcher(["/"]);

export default clerkMiddleware(async (auth, req) => {
  // Properly check if current user matches any admin ID

  // Proteksi semua route kecuali yang di-list di isPublicRoute
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next|_next/auth|sign-in|sign-up|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)"],
};
