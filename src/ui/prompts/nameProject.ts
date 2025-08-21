import chalk from "chalk";

// Project name question
export const PROJECT_NAME_QUESTION = {
    type: "input",
    name: "projectName",
    message: chalk.blue("📁 Project name:"),
    default: "laiyonWasapi"
} as const;
    