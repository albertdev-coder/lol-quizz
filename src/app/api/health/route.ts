export function GET() {
  return Response.json(
    {
      ok: true,
      status: "healthy",
      timestamp: new Date().toISOString(),
      service: "quiz-api",
      environment: process.env.NODE_ENV,
    },
    { status: 200 }
  );
}
