// modules.
import Steam from "steam-user";
import readlineSync from "readline-sync";
import chalk from "chalk";
const client = new Steam();

// This is where you will be inputting your Games' IDS separated by commas.
const Games = {
    "ids": []
}

console.log(chalk.black.bold.yellowBright('==================='));
console.log(chalk.black.bold.yellowBright('Steam Idler'));
console.log(chalk.black.bold.yellowBright('by dragonGR'));
console.log(chalk.black.bold.yellowBright('==================='));

console.log(chalk.black.italic.blueBright('\nCredentials'));
var username = readlineSync.question(chalk.whiteBright.italic('Steam username') + ': ');
var password = readlineSync.question(chalk.whiteBright.italic('Password') + ': ', { hideEchoBack: true});
var steamguard // Steam guard is necessary.

// These are from steam-user module. Assign our inputs to them.
client.logOn({
    accountName: username,
    password: password,
    steamguard: steamguard
});

client.on("loggedOn", function() {
    // Modify the status that user is indeed playing a game.
    client.setPersona(Steam.EPersonaState.Online);
    // Abort program if user has entered backspace as an input.
    if (username === "" || password === "") {
        log((chalk.redBright("Please try again")));
        shutdown();
    } else {
        log((chalk.greenBright("You are successfully logged in!")));
        client.gamesPlayed(TotalGames(Games.ids));
    }
});

// You can farm up to 15 games.
// You can change it to whatever value you want but 15 is enough.
client.on('accountLimitations', function(locked, communityBanned) {
    if (Games.ids.length < 15) {
        log((chalk.greenBright("Game ID(s) to roll: " + Games.ids + ".")));
    } else {
        log("Either you exceeded the limit of 15 games or no game ID was found");
        client.logOff();
        shutdown();
    }
    if (locked) {
        log((chalk.redBright("Locked account.")));
        client.logOff();
        shutdown();
    }
    if (communityBanned) {
        log((chalk.redBright("Banned account.")));
        client.logOff();
        shutdown();
    }
});

// This is to calculate total games of a signed-in Steam profile. Big brain moment.
var TotalGames = function(array) {
    for (var i = array.Length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = array[i];
        array[i] = array[j];
        array[j] = tmp;
    }
    return array;
}

// This is my log thing. Prints time in HH:DD:SS format along with [STEAM].
// You can ditch it and use console.log right away if you don't care about fanciness.
function log(message) {
    var date = new Date();
    var time = [date.getHours(), date.getMinutes(), date.getSeconds()];

    console.log(' ' + time[0] + ':' + time[1] + ':' + time[2] + ' - \x1b[36m%s\x1b[0m', '[STEAM] ' + message);
}

// print err //
client.on("error", function(err) {
    if (err.eresult == Steam.EResult.InvalidPassword) {
        log((chalk.redBright("Login Denied - Incorrect credentials.")));
        shutdown();
    } else if (err.eresult == Steam.EResult.AlreadyLoggedInElsewhere) {
        log((chalk.redBright("Login Denied -  Already logged in!")));
        shutdown();
    } else if (err.eresult == Steam.EResult.AccountLogonDenied) {
        log((chalk.redBright("Login Denied - SteamGuard is required.")));
        shutdown();
    }
});

// First function ends the program without any message on screen
// Second function prints "Disconnecting..." if you interrupt it.
function shutdown(code) {
    client.logOff();
    client.once('disconnected', function() {
        process.exit(code);
    })
};

process.on('SIGINT', function() {
    log((chalk.redBright("Disconnecting...")));
    shutdown();
});