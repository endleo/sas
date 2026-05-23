# Project Title: Hacking Weak Randomness to Win at Gambling

Group Members: 
- Rijkman Pilaar (12434685)
- Josef
- Leo

## Introduction & Problem Field

```
For CTF:
- Describe the core idea and vulnerability.

(Taken from the proposal)
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

- Why is this specific vulnerability relevant?

Weak randomness is a sneaky problem, that has devastating consequences. Popular software stacks have been using weak random generators for years. For example, the PHP [lcg_value()](https://www.php.net/manual/en/function.lcg-value.php) function, was used for years for secure randomness (this is the same generator that we're breaking with our challenge). This lead to malicious actors being able to predict session cookie generation, and hijack user sessions. As an interesting side-note; it was also used for randomness in early Pokemon generations. Some people cracked the underlying LCG, and then influenced it in game to guarantee certain shinies. The second vulnerability, XSS, is a much more popular one. Even though many browsers and web dev frameworks inherently prevent this now, it still happens. A prime example was the Samy worm of 2005, where someone created an XSS script on their myspace page that makes any user who visits it add Samy as a friend, and add the code to their own page. Needless to say this escalated. Within 10 hours all the servers were down and Samy had to pay quite a huge fine...

## Core Work

```
For CTF:
- Detail the architecture of your challenge and design decisions you made.
We are using Svelte for frontend and backend. -> Probably best explained by Leo

- What is the intended solution path (i.e. from not-knowing to getting the flag)?
0. The player inspects all the pages. They learn they can play Roulette, and have a fixed amount of money on their account. When they check out the shop, they see they can buy the flag, but this costs way too much money to "gamble" into. They must somehow obtain enough money to buy the flag.
1. The player should realize that the chat likely contains an XSS vulnerability. This is hinted at by the bot continously spamming the chat with "No suspicious data in the chat, I check out all of it!". 
2. Then, they will carry out an XSS injection to exfiltrate a cookie that only the bot has. This cookie does not have any type of protection enabled so it's easy to steal.
3. When the player puts this cookie into their own browser, they will get to see a private "management board". On this board, a snippet of source code is shown where the weak randomness (i.e. the LCG) is shown.
4. The player should investigate this function, and quickly realize that it is not fit for secure random generation. There are various sources online (e.g. https://msm.lt/posts/cracking-rngs-lcgs/) that teach you how to crack it from the states.
5. Then, the player will likely investigate how the roulette wheel in the browser obtains its randomness. They will discover that there is a request being made to the backend for the next randomness. The reply contains a json field called "state", which indicates this is the output of the lcg.
6. The player will predict all the next Roulette numbers by reversing the LCG, and doubling their money every turn. Within 10 turns they should have enough to buy the flag.


- What is the necessary knowledge of someone trying to solve the challenge?
- The player arguably needs more knowledge about web than crypto. We specifically chose this LCG because it essentially requires high-school level math to crack, which is what makes it fun. You do not need to be deep into crypto to be able to figure it out. On the other hand, carrying out XSS succesfully requires a little bit more experience. This is however much more documented and to some extent even automated. All in all, it a moderate amount of knowledge of web-based vulnerabilities is expected.

For Research:
- What was the state of the artifact(s) when you started?
- What modifications did you made to the research artifact(s)?
- If you extended them, how did you do it?
- Would you consider the artifact(s) as available, functional, and reproducible? 

For Both:
- What technical problems did you encounter, and how did you handle them?
```


## Conclusion & Future Work

```
What are the limitations of your current implementation?
If a future student were to pick up this project, what is the logical "next step"?
```
The next logical step would be scalability. How do 

## Generative AI (If Applicable)

```
Provide a brief summary of how generative tools actually influenced the project compared to your initial proposal.
```