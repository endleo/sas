import { writable } from 'svelte/store';

export type ChatMessage = {
  id: string;
  text: string;
  time: number;
  type: 'npc' | 'bot' | 'user';
  username: string;
};

let npcMessages: string[] = [];

// Load NPC messages from the file
async function loadNpcMessages() {
  try {
    console.log('Loading NPC messages...');
    const response = await fetch('/api/npc-messages');
    console.log('NPC messages response status:', response.status);
    const text = await response.text();
    console.log('Raw NPC messages text:', text.substring(0, 100));
    npcMessages = text
      .split('\n')
      .map((m) => m.trim())
      .filter((m) => m.length > 0);
    console.log('Loaded NPC messages count:', npcMessages.length);
  } catch (e) {
    console.error('Failed to load NPC messages:', e);
    npcMessages = ['Player is here', 'Let me place a bet'];
  }
}

// Fetch messages from server
async function fetchServerMessages(): Promise<ChatMessage[]> {
  try {
    const response = await fetch('/api/chat-message');
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    console.error('Failed to fetch messages:', e);
  }
  return [];
}

const createChat = () => {
  const { subscribe, update, set } = writable<ChatMessage[]>([]);

  return {
    subscribe,
    add(text: string, type: 'npc' | 'bot' | 'user' = 'npc', username = 'Player') {
      const msg: ChatMessage = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        text,
        time: Date.now(),
        type,
        username,
      };
      update((m) => [...m, msg]);
      
      // Also post to server so bot can see it
      fetch('/api/chat-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, username, type }),
      }).catch((e) => console.error('Failed to sync message to server:', e));
    },
    clear() {
      set([]);
    },
    // Load messages from server (for page reload or initial load)
    async loadMessages() {
      const messages = await fetchServerMessages();
      set(messages);
    },
    // Start simulated NPC + bot message stream; returns a stop function
    async startSimulation(npcInterval = 2500, botInterval = 15000) {
      console.log('Starting simulation...');
      await loadNpcMessages();

      // Capture context
      const addMessage = this.add.bind(this);

      // NPC messages
      const npcId = setInterval(() => {
        console.log('NPC interval fired, npcMessages.length =', npcMessages.length);
        if (npcMessages.length > 0) {
          const text = npcMessages[Math.floor(Math.random() * npcMessages.length)];
          const npcName = `Player${Math.floor(Math.random() * 100)}`;
          console.log('Adding NPC message:', text);
          addMessage(text, 'npc', npcName);
        }
      }, npcInterval);

      // Bot messages (less frequent, special behavior)
      const botId = setInterval(() => {
        console.log('Bot interval fired');
        addMessage('No suspicious data in the chat, I check out all of it!', 'bot', 'SecurityBot');
      }, botInterval);

      return () => {
        clearInterval(npcId);
        clearInterval(botId);
      };
    },
  };
};

export const chat = createChat();
