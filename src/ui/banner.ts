import chalk from "chalk";

export function showBanner() {
  console.log("");
  console.log(chalk.green(`
██      █████  ██ ██    ██  ██████  ███    ██ 
██     ██   ██ ██  ██  ██  ██    ██ ████   ██ 
██     ███████ ██   ████   ██    ██ ██ ██  ██ 
██     ██   ██ ██    ██    ██    ██ ██  ██ ██ 
██████ ██   ██ ██    ██     ██████  ██   ████ 
  `));
  
  console.log(chalk.green.bold("    🚀 WhatsApp Bot Generator"));
  console.log(chalk.gray("    Create professional WhatsApp bots with ease"));
  console.log("");
}
