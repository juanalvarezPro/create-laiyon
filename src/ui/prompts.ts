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
                    value: "base-ts-wasapi-json",
                    disabled: "(Coming Soon)"
                },
                {
                    name: "MongoDB",
                    value: "base-ts-wasapi-mongo",
                    disabled: "(Coming Soon)"
                },
                {
                    name: "MySQL",
                    value: "base-ts-wasapi-mysql", 
                    disabled: "(Coming Soon)"
                },
                {
                    name: "PostgreSQL",
                    value: "base-ts-wasapi-postgresql",
                    disabled: "(Coming Soon)"
                }
            ],
            default: "base-ts-wasapi-memory"
        }
    ]);
}

export async function askForAutomaticSetup(canAutoSetup: boolean): Promise<boolean> {
    if (!canAutoSetup) {
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
