import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  // Previously this endpoint set a `bot_token` cookie for the legacy bot.
  // That cookie is no longer used; keep this endpoint as a no-op initializer.
  return new Response(JSON.stringify({ message: 'Bot initialized (no cookie set)' }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
