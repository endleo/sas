import { BOT_TOKEN } from '$lib/server/static/bot-token';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
  // Set a special bot cookie that is vulnerable to XSS
  // httpOnly is false so JavaScript can read it (educational purpose)
  cookies.set('bot_token', BOT_TOKEN, {
    path: '/',
    httpOnly: false, // Intentionally vulnerable - allows JS to read it
    secure: false,
    sameSite: 'lax',
  });

  return new Response(JSON.stringify({ message: 'Bot initialized' }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
