import chalk from "chalk";
import inquirer from "inquirer";

export const apiKeyWasapi = async () => {
    const { enteredKey } = await inquirer.prompt([
    {
      type: "password",
      name: "enteredKey",
      message: chalk.blue("🔑 Enter your Wasapi API Key:"),
      mask: "*"
    }
  ]);

  return enteredKey;
}