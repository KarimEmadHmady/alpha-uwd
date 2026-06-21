import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import {NextRequest, NextResponse} from 'next/server';

export default async function middleware(request: NextRequest) {
  // Handle internationalization first
  const intlMiddleware = createMiddleware(routing);
  const response = intlMiddleware(request);
  
  const { pathname } = request.nextUrl;
  
  // Check if trying to access dashboard
  if (pathname.includes('/dashboard')) {
    const token = request.cookies.get('auth_token')?.value;
    
    // If no token, redirect to login
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    
    // For dashboard root, fetch user role and redirect if manager
    if (pathname === '/dashboard' || pathname === '/dashboard/') {
      try {
        // Fetch user data to get role
        const userResponse = await fetch(`${request.nextUrl.origin}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          const userRole = userData?.user?.role || userData?.role || userData?.user_type;
          
          console.log('Middleware: User role detected:', userRole);
          
          // If manager, redirect to funds-manager
          if (userRole === 'manager') {
            const fundsManagerUrl = new URL('/dashboard/funds-manager', request.url);
            return NextResponse.redirect(fundsManagerUrl);
          }
        }
      } catch (error) {
        console.error('Middleware: Error fetching user role:', error);
        // Continue to normal dashboard if API fails
      }
    }
  }
  
  return response;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};