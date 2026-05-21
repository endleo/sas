import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
  // Read the NPC messages file
  try {
    const fs = await import('fs/promises');
    const path = await import('path');

    // Get the file path relative to the app root
    const filePath = path.join(process.cwd(), 'src/lib/npc-messages.txt');
    const content = await fs.readFile(filePath, 'utf-8');

    return new Response(content, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    return new Response('Unable to load messages', { status: 500 });
  }
};
