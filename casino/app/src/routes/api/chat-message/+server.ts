import type { RequestHandler } from './$types';

type StoredMessage = {
  id: string;
  text: string;
  username: string;
  type: 'npc' | 'bot' | 'user';
  time: number;
};

// In-memory message store (resets on server restart)
let messageStore: StoredMessage[] = [];

export const GET: RequestHandler = async () => {
  return new Response(JSON.stringify(messageStore), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    // Require authentication for posting
    if (!locals.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized: You must be logged in to post' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid message' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Determine message type based on who's posting
    // Bot account gets type 'bot', everyone else gets type 'user'
    const isBot = locals.user.email === (process.env.BOT_EMAIL || 'bot@admin.com');
    const messageType: 'user' | 'bot' = isBot ? 'bot' : 'user';

    const msg: StoredMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      text,
      username: locals.user.name || locals.user.email || 'Anonymous',
      type: messageType,
      time: Date.now(),
    };

    messageStore.push(msg);
    console.log(`[API] Message added: ${msg.username} (${messageType}): ${text.substring(0, 50)}`);

    return new Response(JSON.stringify(msg), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('Error posting message:', e);
    return new Response(JSON.stringify({ error: 'Failed to post message' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
