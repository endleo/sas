import { chromium } from 'playwright';


async function signUpBot() {
  const url = process.env.CASINO_URL + '/signup?/signUpEmail';

  // 1. Reconstruct the URL-encoded form payload
  const payload = new URLSearchParams({
    email: process.env.BOT_EMAIL,
    name: "ModeratorBot",
    password: process.env.BOT_PASSWORD
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-sveltekit-action': 'true',
        // Note: Browsers usually block setting the 'Origin' and 'Referer' headers 
        // manually via script due to security policies, but they will add them automatically.
      },
      body: payload.toString(),
      // CRITICAL: SvelteKit relies on cookies for session/bot tracking here.
      // 'include' ensures that the bot_token and admin_source_access cookies are sent.
      credentials: 'include' 
    });

    const data = await response.json();
    console.log('Signup Action Response:', data);
    
  } catch (error) {
    console.error('Error during signup fetch:', error);
  }
}

async function run() {
  console.log('Launching headless browser...');
  // Launch the browser in headless mode
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'] // Critical for running inside Docker
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. Navigate to login page
    console.log('Navigating to casino login page...');
    const targetUrl = process.env.CASINO_URL || 'http://localhost:5173';
    await page.goto(`${targetUrl}/login`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    console.log('Login page loaded. Current URL:', page.url());

    // Wait for the email input to be visible and ready
    console.log('Waiting for login form to be interactive...');
    await page.waitForSelector('#email', { timeout: 30000 });
    await page.waitForSelector('#password', { timeout: 30000 });
    console.log('Form fields found');

    // Give the page a moment to fully render
    await page.waitForTimeout(1000);

    // 2. Fill out the login form with credentials
    console.log('Filling out login credentials...');
    const email = process.env.BOT_EMAIL || 'bot@admin.com';
    const password = process.env.BOT_PASSWORD || 'bot_password_123';
    
    console.log('Filling email:', email);
    await page.fill('#email', email, { timeout: 10000 });
    console.log('Email filled');

    console.log('Filling password...');
    await page.fill('#password', password, { timeout: 10000 });
    console.log('Password filled');

    // 3. Click the submit button and wait for navigation
    console.log('Submitting login form...');
    
    // Wait for both button click and navigation response
    await Promise.all([
      page.waitForNavigation({ timeout: 30000 }),
      page.click('button[type="submit"]', { timeout: 10000 })
    ]);
    
    console.log('Successfully logged in! Current URL:', page.url());

    // 5. Set the special admin cookie
    console.log('Setting admin cookie...');
    await page.context().addCookies([
      {
        name: 'admin_source_access',
        value: 'true',
        url: targetUrl,
        httpOnly: false,
        secure: false,
        sameSite: 'Lax'
      }
    ]);
    console.log('Admin cookie set successfully');

    // 6. Navigate to the play page to verify and start posting messages from the browser
    console.log('Navigating to play page...');
    await page.goto(`${targetUrl}/play`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    console.log('Bot is now on play page with admin access');

    // Start a message-posting loop inside the browser context so requests include cookies
    console.log('Injecting in-page bot posting loop...');
    await page.evaluate(() => {
      (async () => {
        // helper to fetch NPC messages list
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
        // refresh list occasionally
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

        // initial immediate post
        post('SecurityBot online and monitoring the chat');

        // start interval posting from messages
        setInterval(() => {
          const txt = messages.length ? messages[Math.floor(Math.random() * messages.length)] : 'Hello from SecurityBot';
          post(txt);
        }, 15_000);
      })();
    });

  console.log('In-page bot posting loop started (running indefinitely)');
  console.log('Bot injection complete. Keeping browser alive indefinitely...');
  console.log('Bot configuration complete. Starting page refresh loop...');
  while (true) {
    // Wait 30 seconds between checking the chat
    await page.waitForTimeout(30000); 
    
    console.log('Refreshing play page to fetch new player messages...');
    await page.reload({ waitUntil: 'domcontentloaded' });
    
    // Re-inject your loop if your app resets state on reload
    // (Note: Since you set cookies, the session persists natively!)
  }
  } catch (error) {
    console.error('An error occurred during automation:', error);
    console.error('Stack trace:', error.stack);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
}

signUpBot();
run();