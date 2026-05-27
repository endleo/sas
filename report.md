# Project Title: Hacking Weak Randomness to Win at Gambling

Group N: 
- Rijkman Pilaar (12434685)
- Josef Rabmer (11911128)
- Leonhard Ender (12027408)

Source code at [https://github.com/endleo/sas](https://github.com/endleo/sas)

## Introduction & Problem Field

### Core Idea and Vulnerability

The basic idea for the CTF is a two-step exploit to break an online casino's faulty roulette implementation. The first step consists of using a vulnerability (code injection/XSS) in the site's chatbot to obtain information about the underlying backend implementation, and the second step is to use that information to break the game's random number generator and win against the house.

After signing up to the online casino, the player gets a small amount of starting money and can begin playing roulette. There is a shop with only one item (the flag) for sale, but it is very expensive - quickly googling roulette (or just playing for a while) makes it obvious that winning such a huge amount of money is not realistic.
In the background, the app implements the roulette wheel (which in practice is just a random number generator) using a [Linear congruential generator](https://en.wikipedia.org/wiki/Linear_congruential_generator), which can be [broken](https://msm.lt/posts/cracking-rngs-lcgs/) under the right circumstances. Doing so makes it possible to predict future spins, which in turn enables the player to always bet on the right number and rack up huge winnings very quickly.

Before the player can do this, however, they need to find out about these technical details. The roulette implementation resides in the backend, and players do not have access to its source code. But there is a chat function built into the app, and upon close inspection it becomes clear that messages sent in the chat are rendered as html - a perfect opportunity to inject Javascript into other user's browsers. Conveniently, a moderator bot announces its presence, and injecting the right code into the chat allows the user to get access to that bot's secret cookie, which in turn gives access to the admin page. The trick here is that while maliciously sending a request to an external website may be blocked by the browser, the cookie can still be leaked by sending it to the chat api (which is hosted under the same domain), so it shows up as a chat message. To prevent any spoilers, the chat is not shared between different CTF players.

With the bot's secret cookie, the player can then access the admin page. It contains information about the roulette implementation, as well as the (partial) parameters for the LCG. A closer look at the communication between frontend and backend also reveals that the backend keeps leaking a mysterious state variable after every spin - with the newfound information from the admin page, the player can then draw the obvious conclusion and break the LCG.


### Why is this specific vulnerability relevant?

Weak randomness is a sneaky problem that can have devastating consequences. Popular software stacks have been using weak random generators for years. For example, the PHP [lcg_value()](https://www.php.net/manual/en/function.lcg-value.php) function was used for years for secure randomness (this is the same generator that we're breaking with our challenge). This lead to malicious actors being able to predict session cookie generation and hijack user sessions. As an interesting side-note: It was also used for randomness in early Pokemon generations. Some people cracked the underlying LCG, and then influenced it in game to guarantee certain shinies. 

The second vulnerability, XSS, is a much more popular one. Even though many browsers and web dev frameworks inherently prevent this now, it still happens. A prime example was the Samy worm of 2005, where someone created an XSS script on their myspace page that makes any user who visits it add Samy as a friend, and add the code to their own page. Needless to say this escalated. Within 10 hours all the servers were down and Samy had to pay quite a huge fine.

## Core Work

### Architecture Overview and Design Decisions

From a technical perspective, we are building a modern web app. We have both a frontend and a backend component, but neither are particularly advanced, so it makes sense to use a framework that integrates the development of both. The conventional choice would be React with Next.js, but we wanted to try something new and therefore opted for [Svelte](https://svelte.dev/). It comes with its own backend framework (SvelteKit) and is relatively minimal, which allowed us to spin up a working app very quickly and with minimal coding. Svelte apps can be deployed to various platforms, but we only used the standalone node server.

To make the environment as real as possible, we needed to isolate all the individual player's sessions. We did this by virtualizing the whole challenge into Docker containers. CTF platforms like CTFer can take this to dynamically spin up new instances for individual teams. The major upside is that everyone gets a clean environment, and there is no interaction between players. It comes at a much higher resource cost due to having to run a chromium browser in each individual instance. 

### Intended Solution Path
0. The player inspects all the pages. They learn they can play Roulette, and have a fixed amount of money on their account. When they check out the shop, they see they can buy the flag, but this costs way too much money to "gamble" into. They must somehow obtain enough money to buy the flag.
1. The player should realize that the chat likely contains an XSS vulnerability. This is hinted at by the bot continuously spamming the chat with "No suspicious data in the chat, I check out all of it!". 
2. Then, they will carry out an XSS injection to exfiltrate a cookie that only the bot has. This cookie does not have any type of protection enabled so it's easy to steal.
3. When the player puts this cookie into their own browser, they will get to see a private "management board". On this board, a snippet of source code is shown where the weak randomness (i.e. the LCG) is shown.
4. The player should investigate this function, and quickly realize that it is not fit for secure random generation. There are various sources online (e.g. https://msm.lt/posts/cracking-rngs-lcgs/) that teach you how to crack it from the states.
5. Then, the player will likely investigate how the roulette wheel in the browser obtains its randomness. They will discover that there is a request being made to the backend for the next randomness. The reply contains a json field called "state", which indicates this is the output of the lcg.
6. The player will predict all the next Roulette numbers by reversing the LCG, and doubling their money every turn. Within 10 turns they should have enough to buy the flag.


### Necessary prerequisites
The player arguably needs more knowledge about web than cryptography. We specifically chose the LCG because it only requires high-school level math to crack, which is what makes it fun. You do not need to have in-depth knowledge of cryptography to be able to figure it out. On the other hand, carrying out XSS successfully requires a little bit more experience. This is much better documented, however, and to some extent can even be automated. All in all, a small amount of knowledge of web-based vulnerabilities is expected.

### Technical Challenges
Our main technical problem concerned the implementation of a working roulette wheel. Initial prototyping using Google Stitch (see below) was promising but ultimately did not give us any usable results. After this we switched our focus to preexisting JS libraries to stay within the scope of the project. We found a good-looking candidate but noticed too late that the actual codebase was a bit of a mess and it required a significant amount of work to get into a usable state for our purposes.

In terms of getting the XSS to work, we also faced some challenges. First of all, Svelte and modern hardened browsers already make it incredibly hard to misconfigure your website so badly it allows for XSS. Then secondly, we needed to simulate a bot/person actually interacting with the website and loading the injected code. The tooling for this is quite outstanding, but it is hard to debug a program using a browser. In the end, we just made it run through the whole registration process to make sure it works.

## Conclusion & Future Work
In its current state, the project is a CTF challenge with two separate steps (XSS and LCG), which are both functional and (we think) quite interesting. However, we do not fully know how well it would work in a competitive environment, both in regards to difficulty and evenness. While cracking the LCG is straightforward in principle, it might still take player a while to figure out what they are supposed to do - some playtesting would be a very obvious next step, as would be adding (or removing) hints to make the experience smoother.
In the current version, the player has access to the LCG's state because the backend leaks it to the frontend - this is not really a reasonable design choice. While it might be plausible that a real application would do something like this by mistake, the CTF would still be improved by finding a more elegant way to leak this information.

## Generative AI
We decided to use generative AI to assist with the UI design for the casino, since we wanted to focus on the functional aspects of the implementation (and we are bad at UI design). To this end, we used Google's [Stitch](https://stitch.withgoogle.com/), which is a Gemini-powered web app that can be prompted with a rough description of the project (e.g., an online casino with roulette) and then generates a mock-up for the user interface. Conveniently, Stitch creates the mock-ups using html and [tailwind](https://tailwindcss.com/), so in theory they can be copy-pasted directly into a web application like ours.
In practice, Stitch ended up being primarily useful for coming up with an initial design concept and some general styling, e.g. the overall color scheme. Upon closer inspection of the designs, however, cracks start to appear fairly quickly: Duplicate elements (the same navbar on the side *and* on top), subtle changes between pages (e.g. different fonts), unintuitive interactions, and just generally confusing design choices. While Stitch offers features to iterate on the designs and modify details or specific elements, they are often imprecise and occasionally frustrating to use. They tend to make the requested change, but then also modify other things for no real reason, eventually making it easier to simply do the final touches by hand. 
It should also be noted that every page is its own, standalone html document, and turning them into one cohesive project (where you do not want to redefine the overall theme on every page, for example), requires fairly significant integration effort. The same is also true if one wants to use a framework with certain design principles, e.g. encapsulation of components. 