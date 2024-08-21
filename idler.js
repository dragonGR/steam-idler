import Steam from "steam-user";
import chalk from "chalk";
import prompts from "prompts";

// Define the game IDs to idle
const games = {
    ids: [], // Add game IDs here
};

// Utility function to shuffle an array
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

// Function to retrieve user credentials with validation
async function getCredentials() {
    try {
        const response = await prompts([
            {
                type: "text",
                name: "username",
                message: chalk.italic.blueBright("Steam username:"),
                validate: (username) => {
                    if (!username || username.length < 3) {
                        return "Username must be at least 3 characters long.";
                    }
                    return true;
                }
            },
            {
                type: "password",
                name: "password",
                message: chalk.italic.blueBright("Password:"),
                validate: (password) => {
                    if (!password || password.length < 6) {
                        return "Password must be at least 6 characters long.";
                    }
                    return true;
                }
            },
        ]);

        if (!response.username || !response.password) {
            console.error(chalk.redBright("Please enter both your Steam username and password."));
            process.exit(1);
        }

        return response;
    } catch (error) {
        console.error(chalk.redBright("Error retrieving credentials:", error));
        process.exit(1);
    }
}

// Function to handle Steam login errors
function handleSteamError(err, client) {
    let errorMessage = "An error occurred:";
    switch (err.eresult) {
        case Steam.EResult.InvalidPassword:
            errorMessage = "Login Denied - Incorrect credentials.";
            break;
        case Steam.EResult.AlreadyLoggedInElsewhere:
            errorMessage = "Login Denied - Already logged in elsewhere.";
            break;
        case Steam.EResult.AccountLogonDenied:
            errorMessage = "Login Denied - SteamGuard is required.";
            break;
        default:
            errorMessage += ` ${err}`;
    }

    console.error(chalk.redBright(errorMessage));
    client.logOff();
}

// Main function to handle the Steam login and game idling
(async function main() {
    console.log(
        chalk.bold.yellowBright(
            "===================\nSteam Idler\nby dragonGR\n==================="
        )
    );

    const { username, password } = await getCredentials();

    const client = new Steam();

    client.logOn({ accountName: username, password: password });

    client.on("loggedOn", () => {
        if (games.ids.length === 0) {
            console.error(chalk.redBright("No game ID was provided."));
            client.logOff();
            return;
        }

        client.setPersona(Steam.EPersonaState.Online);
        console.log(chalk.greenBright("Successfully logged in!"));

        client.gamesPlayed(shuffleArray(games.ids));
    });

    client.on("accountLimitations", (locked, communityBanned) => {
        if (games.ids.length >= 15) {
            console.error(chalk.redBright("Exceeded limit of 15 games."));
            client.logOff();
            return;
        }

        if (locked) {
            console.error(chalk.redBright("Account is locked."));
            client.logOff();
            return;
        }

        if (communityBanned) {
            console.error(chalk.redBright("Account is community banned."));
            client.logOff();
            return;
        }

        console.log(chalk.greenBright(`Rolling game IDs: ${games.ids.join(", ")}`));
    });

    client.on("error", (err) => handleSteamError(err, client));
})();
