import chalk from "chalk";
import inquirer from "inquirer";

export const githubStart = async () => {
    const { wantsStar } = await inquirer.prompt([
    {
      type: "confirm",
      name: "wantsStar", 
      message: chalk.yellow("⭐ Would you like to give us a star on GitHub? It helps us a lot!"),
      default: true
    }
  ]);

  return wantsStar;
}