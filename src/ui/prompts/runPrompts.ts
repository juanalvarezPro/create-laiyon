import inquirer from "inquirer";
import { DATABASE_QUESTION } from "./databaseSetup.js";
import { PROJECT_NAME_QUESTION } from "./nameProject.js";

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


