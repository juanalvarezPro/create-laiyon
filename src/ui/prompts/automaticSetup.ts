import chalk from "chalk";
import inquirer from "inquirer";

export async function askForAutomaticSetup(canAutoSetup: boolean): Promise<boolean> {
    if (!canAutoSetup) {
        return false; // Can't do automatic setup
    }

    console.log("");
    console.log(chalk.bgGreen.black(" 🚀 AUTOMATIC SETUP "));
    console.log("");
    console.log(chalk.green("   ✨ Includes:"));
    console.log(chalk.gray("   • Package installation"));
    console.log(chalk.gray("   • Development server"));
    console.log(chalk.gray("   • ngrok tunnel"));
    console.log(chalk.gray("   • WhatsApp QR"));
    console.log("");

    const { autoSetup } = await inquirer.prompt([
        {
            type: "confirm",
            name: "autoSetup",
            message: chalk.blue("🚀 Proceed with automatic setup?"),
            default: true
        }
    ]);

    return autoSetup;
}