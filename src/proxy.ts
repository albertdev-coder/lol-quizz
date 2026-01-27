import type { NextRequest } from "next/server";

export const config = {
  matcher: [
    "/((?!api/health|_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js).*)",
  ],
};

export function proxy(_req: NextRequest) {
  // solo dejo pasar la request
}
