import inquirer from "inquirer";

// Database choices (DRY principle)
const DATABASE_CHOICES = [
    {
        name: "Memory",
        value: "base-ts-wasapi-memory"
    },
    {
        name: "Json",
        value: "base-ts-wasapi-json",
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
];

// Project name question
const PROJECT_NAME_QUESTION = {
    type: "input",
    name: "projectName",
    message: "Project name:",
    default: "wasabot-app"
} as const;

// Database question
const DATABASE_QUESTION = {
    type: "list",
    name: "dbType",
    message: "Which database do you want to use?",
    choices: DATABASE_CHOICES,
    default: "base-ts-wasapi-memory"
} as const;

export async function runPrompts(projectNameFromArgs?: string) {
    // If project name provided via CLI, only ask for database
    if (projectNameFromArgs) {
        const dbAnswer = await inquirer.prompt([DATABASE_QUESTION]);
        
        return {
            projectName: projectNameFromArgs,
            dbType: dbAnswer.dbType
        };
    } else {
        // Ask for both project name and database
        return await inquirer.prompt([PROJECT_NAME_QUESTION, DATABASE_QUESTION]);
    }
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
