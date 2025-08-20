import inquirer from "inquirer";
import chalk from "chalk";

export async function askForGitHubStar() {
  console.log("");
  console.log(chalk.bgGreen.black(" 🎉 CONGRATULATIONS! "));
  console.log("");
  console.log(chalk.green("✅ Your WhatsApp bot is ready!"));
  console.log(chalk.gray("   Thank you for using create-laiyon"));
  console.log("");
  
  const { wantsStar } = await inquirer.prompt([
    {
      type: "confirm",
      name: "wantsStar", 
      message: chalk.yellow("⭐ Would you like to give us a star on GitHub? It helps us a lot!"),
      default: true
    }
  ]);

  if (wantsStar) {
    console.log("");
    console.log(chalk.bgYellow.black(" 🙏 THANK YOU! "));
    console.log("");
    console.log(chalk.green("✨ Opening GitHub..."));
    console.log(chalk.blue.bold("🔗 https://github.com/juanalvarezPro/create-laiyon"));
    console.log(chalk.gray("   Or search for 'create-laiyon' on GitHub"));
    console.log("");
    
    // Try to open the URL automatically
    try {
      const { execSync } = await import('child_process');
      const command = process.platform === 'darwin' ? 'open' :
                     process.platform === 'win32' ? 'start' : 'xdg-open';
      
      execSync(`${command} https://github.com/juanalvarezPro/create-laiyon`, { 
        stdio: 'ignore' 
      });
    } catch {
      // If opening fails, just show the message
      console.log(chalk.yellow("   💡 Please visit the link manually"));
    }
  } else {
    console.log("");
    console.log(chalk.bgBlue.white(" 💙 NO PROBLEM! "));
    console.log("");
    console.log(chalk.blue("Maybe next time! We're always here to help 😊"));
    console.log(chalk.gray("Build amazing WhatsApp bots with ease!"));
    console.log("");
  }
  
  console.log(chalk.bgMagenta.white(" 🚀 HAPPY BOT BUILDING! 🤖 "));
  console.log("");
}
