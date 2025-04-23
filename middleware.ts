import { NextRequest, NextResponse } from "next/server"

const publicRoutes = [
  { path: '/auth', whenAuthenticated: 'redirect' },
] as const;

const DEFAULT_PRIVATE_REDIRECT = '/readmes'; // quando logado e acessa rota pública com redirect
const DEFAULT_PUBLIC_REDIRECT = '/auth';     // quando não logado e tenta rota protegida

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const publicRoute = publicRoutes.find(route => route.path === pathname);

  const authHeader = request.headers.get("Authorization");
  const authToken = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : request.cookies.get("readmes_app.accessToken")?.value;

  const isAuthenticated = !!authToken;

  if (!isAuthenticated) {
    if (publicRoute) {
      return NextResponse.next();
    } else {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = DEFAULT_PUBLIC_REDIRECT;
      return NextResponse.redirect(redirectUrl);
    }
  }
  

  if (publicRoute?.whenAuthenticated === 'redirect') {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = DEFAULT_PRIVATE_REDIRECT;
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthenticated && pathname === '/') {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = DEFAULT_PRIVATE_REDIRECT;
    return NextResponse.redirect(redirectUrl);
  }

  try {
    return NextResponse.next();
  } catch (error) {
    console.error("Error in middleware:", error);
    return resetLogin(request);
  }
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
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
