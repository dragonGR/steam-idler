# Steam Idler

This is a script written in Node JS and what it does is boost your playtime for a given game, thus acquiring trading card drops that can be only obtained by playing it.

You can do a lot of things with trading cards. You can craft them to earn items that will help you customise your profile by levelling up, and you can sell them for some profit as well.

Please note that it's not possible to farm all of the set cards but only what the developers of the game choose to.

For example, Half-Life 2 has eight cards in its set. You can receive four card drops by playing it, but you'll need to collect the other half of the set from other community members by either purchasing them or trading them.

## A note from the developer
Hey and thanks for using my module. Any contribution is welcome, and I will try my best to assist you with anything if possible. Please feel free to fork it and do whatever you want with it.

This script runs locally, which means it does not involve any kind of server on my behalf. The code itself and the modules as well are open-sourced, so you can check them if you are concerned about the legitimacy of it.

Steam is not going to ban you because of using such scripts, nor are you going to get a VAC ban. If you do, then you have done something terribly wrong, such as cheating. Steam doesn't take action against users for using idlers.

I have decided to write this script solely because I wanted to bump up my playtime on certain games so I could show off to people and say, "Hey, I'm a veteran too!". Of course, that didn't work because I was so terrible at playing them and I couldn't find an explanation of what I was doing throughout the 650 hours of TF2.

Here is my Steam profile if you want to reach out to me:  
https://steamcommunity.com/id/chapo102/

My e-mail can be located below my profile picture on Github. ;)

# Installation
- ```git clone https://github.com/dragonGR/steam-idler```
- ```cd steam-idler```
- ```npm install```

## Modules
This script takes advantage of three modules:
- [steam-user](https://www.npmjs.com/package/steam-user)
- [chalk](https://www.npmjs.com/package/chalk)
- [prompts](https://www.npmjs.com/package/prompts)

So, please make sure you have them installed with either of the following methods after ```git clone```:

- ```npm install steam-user chalk prompts```
- ```npm install```

# Editing it
Now, open the ```idler.js``` file with your favourite editor and check the following code:

```javascript
const  Games  = {
"ids": []
}
```
What you have to do is to paste the game's ID within those ```[]``` brackets. That can be easily done by visiting the game's steam store and pasting the ID from the URL.

For example, this is the URL for Civilization VI:
https://store.steampowered.com/app/289070/Sid_Meiers_Civilization_VI/

The game ID for it is 289070``` so the final code will look like this:
```javascript
const  Games  = {
"ids": [289070]
}
```
If you want to add a second game, you can add a comma after the first ID and you are set. You can go as high as 15 games.

# Running it
Finally, we can run it by executing:
```node idler.js```

And it will prompt us to enter our Steam username, password, and Steam Auth code (only if you have 2FA enabled).

If you have successfully entered the details, it will notify you that the magic is actually taking place and you can see it by checking your Steam account's current status.

###  That's all, folks!
