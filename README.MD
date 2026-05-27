## How to run the project

1. Install `docker` and `docker compose`.
2. `cd /casino/app`
3. `docker compose up`

This starts up the web-page and the bot automatically. The bot is a chromium browser that automatically refreshes the page every so-often. 

## How to solve

1. Inject XSS payload into the chat: 
    - To bypass the CSP, we simply make the bot post it's own cookie to the chat (as opposed to some attacker controlled server)
    - One way to do this is by sending: `<img src="x" onerror="fetch('/api/chat-message', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({text: document.cookie})})">`
2. Set the cookie in your own browser.
3. Discover the new `admin` page.
4. On the admin page, retrieve the parameters of the LCG.
5. Write a script to crack the LCG (example in poc.py)
6. Predict successive states
7. Win a lot of money
8. Buy the flag