import type { NextRequest } from "next/server";

export const config = {
  // Aplica a todo excepto healthcheck
  matcher: [
    "/((?!api/health|_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js).*)",
  ],
};

export function proxy(_req: NextRequest) {
  // solo dejo pasar la request
}
