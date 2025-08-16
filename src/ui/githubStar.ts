import inquirer from "inquirer";
import chalk from "chalk";

export async function askForGitHubStar() {
  console.log(chalk.green("\n🎉 Congratulations! Your WhatsApp bot is ready!"));
  console.log(chalk.gray("   Thank you for using create-laiyon"));
  
  const { wantsStar } = await inquirer.prompt([
    {
      type: "confirm",
      name: "wantsStar",
      message: "⭐ Would you like to give us a star on GitHub? It helps us a lot!",
      default: true
    }
  ]);

  if (wantsStar) {
    console.log(chalk.green("\n🙏 Thank you so much! Opening GitHub..."));
    console.log(chalk.blue("   🔗 https://github.com/juanalvarezPro/create-laiyon"));
    console.log(chalk.gray("   Or search for 'create-laiyon' on GitHub"));
    
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
    console.log(chalk.yellow("\n💛 No problem! Maybe next time 😊"));
    console.log(chalk.gray("   We're always here to help you build amazing bots!"));
  }
  
  console.log(chalk.green("\n🚀 Happy bot building! 🤖\n"));
}
