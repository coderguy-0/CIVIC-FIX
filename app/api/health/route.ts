export async function GET() {
  return Response.json({
    status: 'ok',
    service: 'civicfix-api',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
}
