import { NextRequest, NextResponse } from "next/server"

const publicRoutes = [
  { path: '/auth', whenAuthenticated: 'redirect' },
  { path: '/in-development', whenAuthenticated: 'next' },
] as const

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = '/auth'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicRoute = publicRoutes.find(route => route.path === path)
  const authHeader = request.headers.get("Authorization");
  const authToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : request.cookies.get("readmes_app.accessToken")?.value;

  if(!authToken && publicRoute) {
    return NextResponse.next()
  }

  if(!authToken && !publicRoute) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE
    return NextResponse.redirect(redirectUrl)
  }

  if(authToken && publicRoute && publicRoute.whenAuthenticated === 'redirect') {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/auth'

    return NextResponse.redirect(redirectUrl)
  }

  if(authToken && !publicRoute) {
    try {
      return NextResponse.next();
    } catch (error) {
      console.error("Error in middleware:", error);
      return resetLogin(request);
    }
  }

  return NextResponse.next()
}

function resetLogin(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/auth", request.url));

  response.headers.append(
    "Set-Cookie",
    "readmes_app.accessToken=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax"
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}