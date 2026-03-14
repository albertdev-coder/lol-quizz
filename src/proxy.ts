import { NextResponse, type NextRequest } from 'next/server';

// Configuración del proxy (Next.js 16.1.5)
export const config = {
  matcher: ['/((?!api/health|_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js).*)'],
};

// Rate limiting en memoria (simple y suficiente para tu PWA)
const RATE_LIMIT_WINDOW = 10_000; // 10 segundos
const RATE_LIMIT_MAX = 30; // 30 requests por ventana
const ipHits = new Map<string, { count: number; timestamp: number }>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipHits.get(ip);

  if (!entry) {
    ipHits.set(ip, { count: 1, timestamp: now });
    return true;
  }

  // Reiniciar ventana
  if (now - entry.timestamp > RATE_LIMIT_WINDOW) {
    ipHits.set(ip, { count: 1, timestamp: now });
    return true;
  }

  // Incrementar
  entry.count++;

  // Excedió límite
  if (entry.count > RATE_LIMIT_MAX) return false;

  return true;
}

// Sanitización básica de URL
function sanitizeUrl(url: string): string {
  return url.replace(/<|>|"|'/g, '');
}

// Proxy principal
export function proxy(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';

  const url = sanitizeUrl(req.nextUrl.pathname);

  // Logging simple
  console.log(`[PROXY] ${req.method} ${url} from ${ip}`);

  // Rate limiting
  if (!rateLimit(ip)) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }

  // Headers de seguridad
  const res = NextResponse.next();
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.headers.set('X-XSS-Protection', '1; mode=block');

  return res;
}
