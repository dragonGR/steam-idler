import Steam from "steam-user";
import chalk from "chalk";
import prompts from "prompts";

const Games = {
    ids: [], // Array to store the game IDs
};

console.log(
    chalk.bold.yellowBright(
        "===================\nSteam Idler\nby dragonGR\n==================="
    )
);

async function getCredentials() {
    try {
        const response = await prompts([
            {
                type: "text",
                name: "username",
                message: chalk.italic.blueBright("Steam username:"),
            },
            {
                type: "password",
                name: "password",
                message: chalk.italic.blueBright("Password:"),
            },
        ]);

        return response;
    } catch (error) {
        console.log(
            chalk.redBright(
                "An error occurred while retrieving credentials:",
                error
            )
        );
        process.exit(1);
    }
}

(async function () {
    try {
        const { username, password } = await getCredentials();

        if (!username || !password) {
            console.log(
                chalk.redBright(
                    "Please enter your Steam username and password."
                )
            );
            return;
        }

        const client = new Steam();

        client.logOn({
            accountName: username,
            password: password,
        });

        client.on("loggedOn", () => {
            if (Games.ids.length === 0) {
                console.log(chalk.redBright("No game ID was included."));
                client.logOff();
                return;
            }

            client.setPersona(Steam.EPersonaState.Online);
            console.log(chalk.greenBright("Successfully logged in!"));

            client.gamesPlayed(shuffleArray(Games.ids));
        });

        client.on("accountLimitations", (locked, communityBanned) => {
            if (Games.ids.length >= 15) {
                console.log(chalk.redBright("Exceeded limit of 15 games."));
                client.logOff();
                return;
            }

            if (locked) {
                console.log(chalk.redBright("Locked account."));
                client.logOff();
                return;
            }

            if (communityBanned) {
                console.log(chalk.redBright("Banned account."));
                client.logOff();
                return;
            }

            console.log(chalk.greenBright(`Game ID(s) to roll: ${Games.ids}.`));
        });

        client.on("error", (err) => {
            switch (err.eresult) {
                case Steam.EResult.InvalidPassword:
                    console.log(
                        chalk.redBright("Login Denied - Incorrect credentials.")
                    );
                    break;
                case Steam.EResult.AlreadyLoggedInElsewhere:
                    console.log(
                        chalk.redBright("Login Denied - Already logged in.")
                    );
                    break;
                case Steam.EResult.AccountLogonDenied:
                    console.log(
                        chalk.redBright(
                            "Login Denied - SteamGuard is required."
                        )
                    );
                    break;
                default:
                    console.log(chalk.redBright("An error occurred:", err));
                    break;
            }

            client.logOff();
        });

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
    } catch (error) {
        console.log(chalk.redBright("An error occurred:", error));
        process.exit(1);
    }
})();
