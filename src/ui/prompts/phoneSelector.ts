import chalk from "chalk";
import inquirer from "inquirer";

export const phoneSelector = async (choices: any) => {
    const { phoneData } = await inquirer.prompt([
    {
      type: "list",
      name: "phoneData",
      message: chalk.blue("📱 Select the phone number:"),
      choices,
      pageSize: 10
    }
  ]);

  return phoneData;
}