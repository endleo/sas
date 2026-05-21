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

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { text, username = 'You', type = 'user' } = body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid message' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const msg: StoredMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      text,
      username,
      type,
      time: Date.now(),
    };

    messageStore.push(msg);
    console.log(`[API] Message added: ${username} (${type}): ${text.substring(0, 50)}`);

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
