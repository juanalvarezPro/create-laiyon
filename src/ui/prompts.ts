import inquirer from "inquirer";

export async function runPrompts() {
    return await inquirer.prompt([
        {
            type: "input",
            name: "projectName",
            message: "Project name:",
            default: "wasabot-app"
        },
        {
            type: "list",
            name: "dbType",
            message: "Which database do you want to use?",
            choices: [
                {
                    name: "Memory",
                    value: "base-ts-wasapi-memory"
                },
                {
                    name: "Json",
                    value: "base-ts-wasapi-json"
                },
                {
                    name: "Mongo",
                    value: "base-ts-wasapi-mongo"
                },
                {
                    name: "MySQL",
                    value: "base-ts-wasapi-mysql"
                },
                {
                    name: "PostgreSQL",
                    value: "base-ts-wasapi-postgresql"
                }
            ],
            default: "base-ts-wasapi-memory"
        }
    ]);
}

export async function askForAutomaticSetup(isMac: boolean, hasNgrok: boolean): Promise<boolean> {
    if (!isMac || !hasNgrok) {
        return false; // Can't do automatic setup
    }

    const { autoSetup } = await inquirer.prompt([
        {
            type: "confirm",
            name: "autoSetup",
            message: "🚀 Automatic setup is available! Would you like to:\n   • Install packages automatically\n   • Start development server\n   • Create ngrok tunnel\n   • Generate WhatsApp test QR\n   \n   Proceed with automatic setup?",
            default: true
        }
    ]);

    return autoSetup;
}
