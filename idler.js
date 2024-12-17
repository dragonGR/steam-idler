import Steam from "steam-user";
import chalk from "chalk";
import prompts from "prompts";
import dotenv from "dotenv";

dotenv.config();

// Define the game IDs to idle
const games = {
    ids: [], // Add game IDs here
};

// Utility function to shuffle an array
const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

// Function to retrieve user credentials (supports environment variables)
async function getCredentials() {
    if (process.env.STEAM_USERNAME && process.env.STEAM_PASSWORD) {
        return {
            username: process.env.STEAM_USERNAME,
            password: process.env.STEAM_PASSWORD,
        };
    }

    console.log(chalk.cyan("Credentials not found in environment variables. Prompting user..."));

    const response = await prompts([
        {
            type: "text",
            name: "username",
            message: chalk.blue("Steam username:"),
            validate: (username) => username.length >= 3 || "Username must be at least 3 characters long."
        },
        {
            type: "password",
            name: "password",
            message: chalk.blue("Password:"),
            validate: (password) => password.length >= 6 || "Password must be at least 6 characters long."
        },
    ]);

    if (!response.username || !response.password) {
        console.error(chalk.red("Username and password are required."));
        process.exit(1);
    }

    return response;
}

// Steam login error handler
function handleSteamError(err, client) {
    const errorMessages = {
        [Steam.EResult.InvalidPassword]: "Incorrect credentials.",
        [Steam.EResult.AlreadyLoggedInElsewhere]: "Already logged in elsewhere.",
        [Steam.EResult.AccountLogonDenied]: "SteamGuard required.",
    };

    const message = errorMessages[err.eresult] || `Unexpected error: ${err}`;
    console.error(chalk.red(`Login failed: ${message}`));
    client.logOff();
}

// Main function to idle games
(async function main() {
    console.log(
        chalk.yellowBright.bold(`\n==========\n Steam Idler by dragonGR \n==========`)
    );

    const { username, password } = await getCredentials();

    const client = new Steam();
    client.logOn({ accountName: username, password: password });

    client.on("loggedOn", () => {
        if (!games.ids.length) {
            console.error(chalk.red("No game IDs provided. Exiting."));
            client.logOff();
            return;
        }

        console.log(chalk.green("Successfully logged into Steam!"));
        client.setPersona(Steam.EPersonaState.Online);
        const shuffledGames = shuffleArray(games.ids);
        console.log(chalk.cyan(`Idling games: ${shuffledGames.join(", ")}`));
        client.gamesPlayed(shuffledGames);
    });

    client.on("error", (err) => handleSteamError(err, client));

    client.on("accountLimitations", (locked, banned) => {
        if (locked || banned) {
            console.error(chalk.red("Account has limitations. Exiting..."));
            client.logOff();
            return;
        }
    });
})();
