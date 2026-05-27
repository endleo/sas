<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { chat, type ChatMessage } from "./chat.ts";

  let messages = $state<ChatMessage[]>([]);
  let container: HTMLElement;
  let autoScroll = $state(true);
  let stopSim: () => void;
  let unsub: () => void | null = null;
  let inputValue = $state('');
  let sending = $state(false);
  let pollInterval: ReturnType<typeof setInterval>; // Store the interval ID

  onMount(async () => {
    console.log('Chat component mounted');

    // Load existing messages from server initially
    await chat.loadMessages();

    // Subscribe only in the browser to avoid SSR errors
    unsub = chat.subscribe((v) => {
      console.log('Chat store updated, messages count:', v.length);
      messages = v;
      // schedule scroll after DOM updates
      requestAnimationFrame(() => {
        if (!container) return;
        if (autoScroll) {
          container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        }
      });
    });

    console.log('Starting simulation...');
    stopSim = await chat.startSimulation(2500, 15000);
    console.log('Simulation started');

    // Live Polling: Fetch new messages from the server database every 3 seconds
    console.log('Starting live chat polling...');
    pollInterval = setInterval(async () => {
      try {
        await chat.loadMessages();
      } catch (e) {
        console.error('Failed to poll new messages:', e);
      }
    }, 3000); 
  });

  onDestroy(() => {
    if (unsub) unsub();
    if (stopSim) stopSim();
    if (pollInterval) clearInterval(pollInterval); // Clean up interval to prevent memory leaks
  });

  function toggleAuto() {
    autoScroll = !autoScroll;
  }

  function clearChat() {
    chat.clear();
  }

  async function sendMessage() {
    if (!inputValue.trim()) return;
    
    sending = true;
    try {
      const response = await fetch('/api/chat-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputValue }),
      });
      
      if (response.ok) {
        // Force an immediate reload from the server instead of just optimistically 
        // appending to ensure state syncs cleanly with any backend modifications
        await chat.loadMessages();
        inputValue = '';
      } else if (response.status === 401) {
        console.error('Not authenticated');
        alert('You must be logged in to send messages');
      } else {
        const error = await response.json().catch(() => ({}));
        console.error('Failed to send message:', error.error || response.statusText);
      }
    } catch (e) {
      console.error('Failed to send message:', e);
    } finally {
      sending = false;
    }
  }
</script>

<div class="chat-root">
  <div class="chat-header">
    <div>Chat</div>
    <div class="chat-controls">
      <button on:click={toggleAuto} class="control">{autoScroll ? 'Pause' : 'Resume'}</button>
      <button on:click={clearChat} class="control">Clear</button>
    </div>
  </div>
  <div bind:this={container} class="chat-body">
    {#each messages as m (m.id)}
      <div class="chat-line {m.type}">
        <div class="chat-time">{new Date(m.time).toLocaleTimeString()}</div>
        <div class="chat-user">{m.username}</div>
        <div class="chat-text">
          <!-- Intentionally unsanitized for XSS education -->
          {@html m.text}
        </div>
      </div>
    {/each}
  </div>
  <div class="chat-input-area">
    <input
      type="text"
      bind:value={inputValue}
      placeholder="Type a message..."
      on:keydown={(e) => e.key === 'Enter' && sendMessage()}
      class="chat-input"
    />
    <button on:click={sendMessage} disabled={sending || !inputValue.trim()} class="send-btn">
      {#if sending}
        <span class="spinner icon-[tdesign--load]"></span>
      {:else}
        <span class="icon-[mdi--send]"></span>
      {/if}
    </button>
  </div>
</div>

<style>
  .chat-root {
    display: flex;
    flex-direction: column;
    height: 280px;
    max-height: 40vh;
    background: rgba(12, 18, 30, 0.55);
    border: 1px solid rgba(255,255,255,0.04);
    padding: 8px;
    border-radius: 12px;
    gap: 8px;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 700;
    font-size: 0.95rem;
  }
  .chat-controls .control {
    margin-left: 6px;
    padding: 6px 8px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.04);
    color: inherit;
    border-radius: 8px;
    cursor: pointer;
  }
  .chat-body {
    overflow-y: auto;
    padding: 6px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 1;
    min-height: 0;
  }
  .chat-line {
    display: flex;
    gap: 8px;
    align-items: flex-start;
    padding: 8px;
    border-radius: 8px;
    background: rgba(255,255,255,0.08);
    font-size: 0.9rem;
    flex-shrink: 0;
  }
  .chat-line.npc { color: #cbd5e1; }
  .chat-line.user { color: #fff; background: rgba(78,222,163,0.06); }
  .chat-line.bot { color: #fff; background: rgba(239, 68, 68, 0.1); border-left: 3px solid rgba(239, 68, 68, 0.5); }
  .chat-time { opacity: 0.6; font-size: 0.75rem; width: 70px; white-space: nowrap; }
  .chat-user { opacity: 0.7; font-size: 0.85rem; font-weight: 600; min-width: 80px; }
  .chat-text { flex: 1; word-break: break-word; }
  
  .chat-input-area {
    display: flex;
    gap: 8px;
    border-top: 1px solid rgba(255,255,255,0.04);
    padding-top: 8px;
  }
  
  .chat-input {
    flex: 1;
    padding: 8px 12px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    color: #fff;
    font-size: 0.9rem;
  }
  
  .chat-input::placeholder {
    color: rgba(255,255,255,0.4);
  }
  
  .chat-input:focus {
    outline: none;
    border-color: rgba(78,222,163,0.5);
    background: rgba(255,255,255,0.08);
  }
  
  .send-btn {
    padding: 8px 12px;
    background: rgba(78,222,163,0.15);
    border: 1px solid rgba(78,222,163,0.3);
    border-radius: 8px;
    color: #4ede a3;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .send-btn:hover:not(:disabled) {
    background: rgba(78,222,163,0.25);
    border-color: rgba(78,222,163,0.5);
  }
  
  .send-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
