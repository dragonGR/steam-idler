# Steam idler
## _Boost your Steam playtime hour_

Steam idler is a Script written in JS for idling and boosting playtime for chosen games without using computer resources.

## Note
I do not store any of your credentials, this take advantage of open-source'd modules which you are obligated to check their sources if you are this concerned about transparency. This is a 100% open-source project with complete transparency. It's kinda the same as using Steam Auth App on your client, the only difference is that it simulates the games.

## Required modules
- [steam-user](https://www.npmjs.com/package/steam-user)
- [fs](https://www.npmjs.com/package/fs)
- [chalk](https://www.npmjs.com/package/chalk)
- [steamcommunity](https://www.npmjs.com/package/steamcommunity)
- [readline-sync](https://www.npmjs.com/package/readline-sync)

## Installation
Let's git clone this repo somewhere.
``` 
git clone https://github.com/dragonGR/steam-idle
```
Then, install required dependencies.
This can be achieved by doing
```
npm install
```
Now, open the file with an editor, Windows' notepad can do the job as well and head over to line 11 and place your preferred game's ID inside of those brackets. Can be separated by a comma[,].

``"games": []``

And finally, run it
```
node steamidler.js
```

## Frequently Asked Questions
**How to find my game's ID?**
- Open the steam page of the game you want and copy the numbers in the URL.
For example: https://store.steampowered.com/app/**123**/steam
the app ID is the numeric ones, **123**.

**How many games can i idle simutalneously?**
- For now it can go up to 15 games.

**Is it safe? I don't want to get a VAC ban on my 6.9k CS:GO account**
- It won't ban you even when playing on VAC secured server. It doesn't modify working memory pool so VAC won't go crazy. I played CSGO comp with Idle Master running in background a couple of times.

**Is this Bot saving Information about my Account?**
- Read [#Note](https://github.com/dragonGR/steam-idler#note): I do not store any of your credentials, this take advantage of open-source'd modules which you are obligated to check their sources if you are this concerned about transparency. This is a 100% open-source project with complete transparency. It's kinda the same as using Steam Auth App on your client, the only difference is that it simulates the games.

**Does the Author tracks my IP?**
- No, this Bot runs on localhost (Your PC) and your details cannot be Tracked.

## Resources
- [steam-user](https://www.npmjs.com/package/steam-user)
- [fs](https://www.npmjs.com/package/fs)
- [chalk](https://www.npmjs.com/package/chalk)
- [steamcommunity](https://www.npmjs.com/package/steamcommunity)
- [readline-sync](https://www.npmjs.com/package/readline-sync)
- [Steam](https://developer.valvesoftware.com/wiki/Steam_Web_API) - web API

## License
GPL v3.0
