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
