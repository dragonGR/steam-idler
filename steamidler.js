// Required dependencies:
// chalk, fs, readline-sync, steam-user, steamcommunity
const Steam = require('steam-user'),
fs = require('fs'),
readlineSync = require('readline-sync'),
chalk = require('chalk'),
SteamCommunity = require('steamcommunity');

const client = new Steam();
const Settings = {
    "games": [289070, 271590] // appIDs(max it can do it's 15) MUST be included. Read README.md for more info.
}

// Introduction
console.log(chalk.black.bold.yellowBright('==================='));
console.log(chalk.black.bold.yellowBright('Steam idler'));
console.log(chalk.black.bold.yellowBright('by dragonGR'));
console.log(chalk.black.bold.yellowBright('===================\n'));

// Login credentials message
console.log(chalk.black.italic.blueBright('Please enter your credentials'));
var user = readlineSync.question(chalk.whiteBright.bold('Steam username') + ': ');
var pass = readlineSync.question(chalk.whiteBright.bold('Password') + ': ', {hideEchoBack: true});
var mobileCode // User MUST Have steam guard proper configured through Steam's mobile app

// Find the total games this user has and store it in array so we can later use it in the limitation check.
var TotalGames = function(array) {
    for (var i = array.Length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = array[i];
        array[i] = array[j];
        array[j] = tmp;
    }
    return array;
}

// Trigger
// Below variables are from SteamCommunity node module
client.logOn({
    accountName: user,
    password: pass,
    steamguard: mobileCode
});

client.on("loggedOn", function() {
    client.setPersona(Steam.EPersonaState.Away);

    if (user === "" || pass === "") {
        log((chalk.redBright("Failed Login Attempt"))); // Empty field or wrong credentials
        shutdown(); // Shut down the program
    } else {
        log((chalk.greenBright("Login Success!"))); // Big Success
        client.gamesPlayed(TotalGames(Settings.games)); // Call Math to have array ready
    }
});

// Check if the server is up and running. Steam isn't exactly 24/7 reliable
if (fs.existsSync('servers')) {
    Steam.servers = JSON.parse(fs.readFileSync('servers'));
    log((chalk.greenBright("Connecting...")));
}

client.on("connected", function() {
    log((chalk.greenBright("Warming up...")));
});

// Add a limitation of 5 games in library and let the user know if they fall in this category
// For more info read here: https://support.steampowered.com/kb_article.php?ref=5406-WFZC-5519
// And here: https://support.steampowered.com/kb_article.php?ref=3330-iagk-7663
client.on('accountLimitations', function(limited, locked, communityBanned) {
    if (limited) {
        if (Settings.games.length < 5) {
            log((chalk.blueBright("Limited Account.")));
            log((chalk.greenBright("Warming up. ID(s): " + Settings.games + ".")));
        } else {
            log("Exceeded the limit of 5 Games.");
            log((chalk.redBright("For more info read here: https://support.steampowered.com/kb_article.php?ref=3330-iagk-7663")));
            client.logOff();
            shutdown();
        }
    } else if (Settings.games.length < 15) {
        log((chalk.greenBright("Warming up. ID(s): " + Settings.games + ".")));
    } else {
        log((chalk.redBright("Exceeded the limit of 15 Games")));
        client.logOff();
        shutdown();
    }
    if (locked) {
        log((chalk.redBright("Locked account.")));
        log((chalk.redBright("For more info read here: https://support.steampowered.com/kb_article.php?ref=5406-WFZC-5519")));
        client.logOff();
        shutdown();
    }
    if (communityBanned) {
        log((chalk.redBright("Banned account.")));
        log((chalk.redBright("For more info read here: https://support.steampowered.com/kb_article.php?ref=5406-WFZC-5519")));
        client.logOff();
        shutdown();
    }
});

/// Functions ///
// Make 'log' great - Display format: HH:MM:SS
function log(message) {
    var date = new Date();
    var time = [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()];

    for (var i = 1; i < 6; i++) {
        if (time[i] < 10) {
            time[i] = '0' + time[i];
        }
    }
    console.log(' ' + time[3] + ':' + time[4] + ':' + time[5] + ' - \x1b[36m%s\x1b[0m', '[STEAM] ' + message);
}
// err log
client.on("error", function(err) {
    if (err.eresult == Steam.EResult.InvalidPassword) {
        log((chalk.redBright("Login Denied - Incorrect credentials.")));
        shutdown();
    } else if (err.eresult == Steam.EResult.AlreadyLoggedInElsewhere) {
        log((chalk.redBright("Login Denied -  Already logged in!")));
        shutdown();
    } else if (err.eresult == Steam.EResult.AccountLogonDenied) {
        log((chalk.redBright("Login Denied - SteamGuard is required")));
        shutdown();
    }
});
// shutdown();
function shutdown(code) {
    client.logOff();
    client.once('disconnected', function() {
        process.exit(code);
    });

    setTimeout(function() {
        process.exit(code);
    }, 500);
}
// Print "Logging off..." everytime we use shutdown function
process.on('SIGINT', function() {
    log((chalk.redBright("Logging off...")));
    shutdown();
});