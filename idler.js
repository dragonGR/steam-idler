// Importing necessary modules
import Steam from "steam-user"; // Steam client for steam-based functions
import readlineSync from "readline-sync"; // For reading input from the user
import chalk from "chalk"; // For styling console outputs

// Object to hold the game IDs to be idled
const client = new Steam();
const Games = {
    ids: [] // Array to store the game IDs
};

console.log(chalk.bold.yellowBright("===================\nSteam Idler\nby dragonGR\n==================="));

// Reading Steam username and password from the user
const username = readlineSync.question(chalk.italic.blueBright("Steam username: "));
const password = readlineSync.question(chalk.italic.blueBright("Password: "), {
    hideEchoBack: true
});

// Checking if the user has entered both username and password
if (!username || !password) {
    console.log(chalk.redBright("Please enter your Steam username and password."));
    process.exit(1); // Exiting the process with code 1 (error)
}

// Instantiating the Steam client with the entered credentials
client.logOn({
    accountName: username,
    password: password
});

// Event listener for successful login
client.on("loggedOn", function() {
    // Checking if the game IDs array is empty
    if (!Games.ids.length) {
        console.log(chalk.redBright("No game ID was included."));
        client.logOff(); // Logging off the Steam client
        process.exit(1); // Exiting the process with code 1 (error)
    }

    // Setting the Steam client persona to Online
    client.setPersona(Steam.EPersonaState.Online);
    console.log(chalk.greenBright("Successfully logged in!"));

    // Playing the specified game IDs on the Steam client
    client.gamesPlayed(shuffleArray(Games.ids));
});

// Event listener for account limitations
client.on('accountLimitations', function(locked, communityBanned) {
    // Checking if the number of game IDs is more than 15
    if (Games.ids.length >= 15) {
        console.log(chalk.redBright("Exceeded limit of 15 games."));
        client.logOff(); // Logging off the Steam client
        process.exit(1); // Exiting the process with code 1 (error)
    }

    // Checking if the Steam account is locked
    if (locked) {
        console.log(chalk.redBright("Locked account."));
        client.logOff(); // Logging off the Steam client
        process.exit(1); // Exiting the process with code 1 (error)
    }

    // Checking if the Steam account is banned from the community
    if (communityBanned) {
        console.log(chalk.redBright("Banned account."));
        client.logOff(); // Logging off the Steam client
        process.exit(1); // Exiting the process with code 1 (error)
    }

    console.log(chalk.greenBright(`Game ID(s) to roll: ${Games.ids}.`));
});

    // Error handling function
client.on("error", function(err) {
    // Switch case to check the result of the error
    switch (err.eresult) {
        case Steam.EResult.InvalidPassword:
            // Login Denied due to incorrect credentials
            console.log(chalk.redBright("Login Denied - Incorrect credentials."));
            break;
        case Steam.EResult.AlreadyLoggedInElsewhere:
            // Login Denied due to the account being logged in elsewhere
            console.log(chalk.redBright("Login Denied - Already logged in."));
            break;
        case Steam.EResult.AccountLogonDenied:
            // Login Denied due to SteamGuard being required
            console.log(chalk.redBright("Login Denied - SteamGuard is required."));
            break;
    }

    client.logOff(); // Logging off the Steam client
    process.exit(1); // Exiting the process with code 1 (error)
});

// ShuffleArray function shuffles an array of multiple Game ID(s)
function shuffleArray(array) {
    // Loops through the array
    for (let i = array.length - 1; i > 0; i--) {
        // Generates a random index
        const j = Math.floor(Math.random() * (i + 1));
        // Swaps the elements of the array at indices i and j
        [array[i], array[j]] = [array[j], array[i]];
    }

    // Returns the shuffled array
    return array;
}