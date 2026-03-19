export function checkApiKey(request: Request): boolean {
  const apiKey = process.env.RECALL_API_KEY;
  if (!apiKey) return false;
  const provided = request.headers.get("X-API-Key");
  return provided === apiKey;
}
