import { chromium } from 'playwright';

// Helper function to make sure the server is awake before launching the browser
async function waitForCasino(url, timeoutMs = 60000) {
  const startTime = Date.now();
  console.log(`Waiting for Casino web server at ${url} to wake up...`);
  while (Date.now() - startTime < timeoutMs) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (res.ok || res.status < 500) {
        console.log('Casino web server is responsive!');
        return true;
      }
    } catch (e) {
      // Server not ready yet
    }
    await new Promise(r => setTimeout(r, 2000));
  }
  throw new Error('Casino web server failed to become responsive in time.');
}

async function run() {
  const targetUrl = process.env.CASINO_URL || 'http://localhost:5173';
  
  // 1. Ensure target is online before doing anything
  await waitForCasino(targetUrl);

  console.log('Launching headless browser...');
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'] // Critical for running inside Docker
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 2. Navigate straight to the registration form page
    console.log('Navigating to casino registration page...');
    await page.goto(`${targetUrl}/signup`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    console.log('Registration page loaded. Current URL:', page.url());

    // 3. Wait for the form selectors to render securely
    console.log('Waiting for registration form fields...');
    await page.waitForSelector('#email', { timeout: 30000 });
    await page.waitForSelector('#name', { timeout: 30000 });
    await page.waitForSelector('#password', { timeout: 30000 });
    
    // Brief stability delay for animations/glassmorphism styles
    await page.waitForTimeout(1000);

    // 4. Extract registration data from environment properties
    const email = process.env.BOT_EMAIL || 'bot@admin.com';
    const username = 'SecurityBot'; // Name value specified in form
    const password = process.env.BOT_PASSWORD || 'bot_password_123';

    console.log(`Filling registration fields for: ${email}`);
    await page.fill('#email', email);
    await page.fill('#name', username);
    await page.fill('#password', password);

    // 5. Click create account and wait for the SvelteKit client-side redirect
    console.log('Submitting registration form...');
    
    // We click the button, then wait for SvelteKit to update the URL (e.g., redirecting to /profile or /)
    await page.click('button[type="submit"]');

    console.log('Waiting for post-registration routing to complete...');
    // This looks at the active browser URL state, handling client-side SPA navigation cleanly
    await page.waitForURL(url => url.pathname !== '/signup' && url.pathname !== '/register', {
      timeout: 30000,
      waitUntil: 'domcontentloaded'
    });

    console.log('Form processed. Current URL post-registration:', page.url());

    // 6. Set the special CTF administration accessibility cookie
    console.log('Setting admin_source_access session cookie...');
    await page.context().addCookies([
      {
        name: 'bot_token',
        value: '9d74932bdb6f21dc7ab21d6fc5260f474e0d538571fba7a82b74ffe47e6f9a10',
        url: targetUrl,
        httpOnly: false,
        secure: false,
        sameSite: 'Lax'
      }
    ]);
    console.log('Admin cookie configured.');

    // 7. Route over to the play screen safely
    console.log('Navigating to game play page...');
    await page.goto(`${targetUrl}/play`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    console.log('Bot is live on the play dashboard with active session credentials');

    // 8. Inject the operational message posting loop
    console.log('Injecting active bot tracking loop into runtime instance...');
    await page.evaluate(() => {
      (async () => {
        async function loadNpcMessages() {
          try {
            const r = await fetch('/api/npc-messages');
            if (!r.ok) return [];
            const text = await r.text();
            return text.split('\n').map(m => m.trim()).filter(Boolean);
          } catch (e) {
            return [];
          }
        }

        let messages = await loadNpcMessages();
        setInterval(async () => {
          messages = await loadNpcMessages();
        }, 60_000);

        const post = async (text) => {
          try {
            await fetch('/api/chat-message', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text, username: 'SecurityBot', type: 'bot' }),
            });
          } catch (e) {
            // ignore
          }
        };

        post('SecurityBot online and monitoring the chat');

        setInterval(() => {
          const txt = messages.length ? messages[Math.floor(Math.random() * messages.length)] : 'Hello from SecurityBot';
          post(txt);
        }, 15_000);
      })();
    });

    console.log('Loop injected safely. Transitioning into long-poll surveillance...');
    
    // 9. Continuous observation refresh execution loop
    while (true) {
      await page.waitForTimeout(30000); 
      console.log('Refreshing interface elements to evaluate fresh user messages...');
      await page.reload({ waitUntil: 'domcontentloaded' });
    }

  } catch (error) {
    console.error('An unexpected exception crashed automation context:', error);
    console.error(error.stack);
  } finally {
    await browser.close();
    console.log('Context destroyed.');
  }
}

run();