import { BOT_TOKEN } from "./src/lib/server/static/bot-token"

/**
 * Simple CTF bot that periodically fetches chat messages
 * and evaluates them (simulating XSS execution in a browser)
 */

const BOT_INTERVAL = 30000; // Run every 30 seconds
const PAGE_URL = process.env.BOT_URL || 'http://web:5173';

type ChatMessage = {
  id: string;
  text: string;
  username: string;
  type: 'npc' | 'bot' | 'user';
  time: number;
};

// Simulate bot cookies/session
const botCookies = {
  bot_token: BOT_TOKEN,
  session_id: 'bot_session_' + Math.random().toString(36).slice(2, 9),
};

let processedMessages = new Set<string>();

async function fetchMessages(): Promise<ChatMessage[]> {
  try {
    const response = await fetch(`${PAGE_URL}/api/chat-message`);
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    console.log(`[Bot] Failed to fetch messages: ${e}`);
  }
  return [];
}

function evaluateXSS(code: string): string {
  // Simple XSS detection and simulation
  // In a real CTF, this would actually execute the code
  try {
    // Look for suspicious patterns
    if (code.includes('document.cookie')) {
      console.log(`[Bot] XSS Detected! Attempting to access cookies...`);
      // Simulate cookie exfiltration
      console.log(`[Bot] Bot cookies: ${JSON.stringify(botCookies)}`);
      return `Cookies exposed: ${JSON.stringify(botCookies)}`;
    }
    if (code.includes('alert')) {
      console.log(`[Bot] XSS with alert() detected`);
      return `Alert would execute`;
    }
    if (code.includes('fetch') || code.includes('XMLHttpRequest')) {
      console.log(`[Bot] XSS with network request detected`);
      return `Network request detected`;
    }
  } catch (e) {
    // Safely catch any eval errors
  }
  return null;
}

async function processChatMessages() {
  try {
    console.log(`[Bot] Fetching messages at ${new Date().toLocaleTimeString()}`);
    const messages = await fetchMessages();
    console.log(`[Bot] Received ${messages.length} messages`);

    for (const msg of messages) {
      // Skip if we already processed this message
      if (processedMessages.has(msg.id)) {
        continue;
      }

      processedMessages.add(msg.id);

      // Check for XSS patterns in the message
      const text = msg.text.toLowerCase();

      if (
        text.includes('<script') ||
        text.includes('onerror=') ||
        text.includes('onclick=') ||
        text.includes('fetch') ||
        text.includes('alert') ||
        text.includes('document.cookie')
      ) {
        console.log(`[Bot] Suspicious message from ${msg.username}: ${msg.text.substring(0, 80)}`);

        // Try to detect XSS
        const result = evaluateXSS(msg.text);
        if (result) {
          console.log(`[Bot] XSS Result: ${result}`);
        }
      }
    }
  } catch (e) {
    console.error(`[Bot] Error processing messages: ${e}`);
  }
}

async function startBot() {
  console.log(`[Bot] Starting bot service...`);
  console.log(`[Bot] Targeting: ${PAGE_URL}`);
  console.log(`[Bot] Update interval: ${BOT_INTERVAL}ms`);

  // Process immediately
  await processChatMessages();

  // Then process periodically
  setInterval(processChatMessages, BOT_INTERVAL);
}

console.log(`[Bot] Initializing at ${new Date().toLocaleTimeString()}`);
startBot().catch(console.error);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('[Bot] Shutting down gracefully...');
  process.exit(0);
});
