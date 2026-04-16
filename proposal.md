# Project Title: `Unfair Casino`

TUWEL Group number: `N`

Group Members: `Josef Rabmer (11911128), Leonhard Ender (12027408), Rijkman Pilaar (12434685)`

Project Path: `CTF challenge`

Modifier: `#yesai`

## The Core Idea

- An online casino offering roulette, where you start with an initial (low) amount of credits and must win a certain (very high) amount to buy the flag
- In the background, the app uses a [Linear congruential generator](https://en.wikipedia.org/wiki/Linear_congruential_generator), which can be [broken](https://msm.lt/posts/cracking-rngs-lcgs/)
- There is a script injection vulnerability in the site's chatbot leading to the source code, which reveals the usage of the LCG:
    - There is a login system with an insecure (not HttpOnly) login cookie
    - The bot constantly monitors and evaluates links (we will probably hint to that)
    - If you post a comment with javascript, the bot evaluates it client side
    - Exploit this to obtain the bot's session cookie, so you can log in to the bot's account
    - Here you can see the source code/design idea/etc. for the roulette wheel, which reveals the fact it is using an LCG (and maybe one of the parameters)
- The website leaks the current state of the LCG somewhere in the UI, which allows you to collect successive states
- Using this information, you can predict future random numbers, consistently win against the house and purchase the flag

## Challenges

- Given that the theme is very visual with a roulette wheel and a casino, there is some frontend development work to be done to make it look nice
- Setting up the website, the login, the bot, etc. requires a fair bit of (admittedly quite basic) software development
- There is a danger that the player does not realise they can break the randomness and win, or that they do not make the connection to the LCG being vulnerable - we need to make this obvious, perhaps through hints

### Scope
- We will keep the website and login mechanisms very basic and not go overboard

## Milestones

| Date     | Milestone |
| -------- | -------- |
| 13.04    | Website/UI MVP |
| 27.04    | LCG Randomness |
| 04.05    | Chatbot Script Exploit |
| 18.05    | Bugfixing/Buffer |


## Generative AI

We are planning on using an AI tools like Google Stich to quickly generate a nice looking UI. This will allow us to focus on implementing the functional aspects of the challenge.