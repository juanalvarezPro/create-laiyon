import chalk from "chalk";

// Function to show manual instructions
export async function showManualInstructions(projectName: string, systemConfig: any) {
  console.log("");
  console.log(chalk.bgGreen.black(" 🎉 PROJECT CREATED "));
  console.log("");
  console.log(chalk.green("✅ Your project is ready for manual setup!"));
  console.log("");
  
  console.log(chalk.bgBlue.white(" 📋 SETUP INSTRUCTIONS "));
  console.log("");
  console.log(chalk.blue.bold("📁 Navigate to your project:"));
  console.log(chalk.cyan(`   cd ${projectName}`));
  console.log("");
  
  console.log(chalk.blue.bold("📦 Install dependencies:"));
  console.log(chalk.cyan("   npm install"));
  console.log("");
  
  console.log(chalk.blue.bold("🚀 Start development server:"));
  console.log(chalk.cyan("   npm run dev"));
  console.log("");
  
  console.log(chalk.blue.bold("🌐 Setup ngrok tunnel:"));
  if (!systemConfig.ngrokInstalled) {
    console.log(chalk.yellow("   → First install ngrok:"));
    console.log(chalk.cyan("     https://ngrok.com/download"));
    console.log("");
    console.log(chalk.yellow("   → Configure your token:"));
    console.log(chalk.cyan("     ngrok config add-authtoken <your-token>"));
    console.log("");
    console.log(chalk.yellow("   → Create tunnel (in another terminal):"));
    console.log(chalk.cyan("     ngrok http <port>"));
  } else if (!systemConfig.ngrokHasToken) {
    console.log(chalk.yellow("   → Configure your token:"));
    console.log(chalk.cyan("     ngrok config add-authtoken <your-token>"));
    console.log("");
    console.log(chalk.yellow("   → Create tunnel (in another terminal):"));
    console.log(chalk.cyan("     ngrok http <port>"));
  } else {
    console.log(chalk.yellow("   → In another terminal:"));
    console.log(chalk.cyan("     ngrok http <port>"));
  }
  
  console.log("");
  console.log(chalk.bgYellow.black(" 💡 HELPFUL TIPS "));
  console.log("");
  console.log(chalk.gray("• The default port is usually 3000"));
  console.log(chalk.gray("• Copy the ngrok URL and use it in your Wasapi webhook"));
  console.log(chalk.gray("• Add '/webhook/wasapi' to your ngrok URL"));
  console.log("");
}
