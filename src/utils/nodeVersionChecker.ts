import chalk from "chalk";

// Check Node.js version compatibility
export function checkNodeVersion(): void {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  
  if (majorVersion < 18) {
    console.log("");
    console.log(chalk.bgRed.white(" ❌ UNSUPPORTED NODE.JS VERSION "));
    console.log("");
    console.log(chalk.red(`   Current version: ${chalk.bold(nodeVersion)}`));
    console.log(chalk.yellow("   Required: Node.js 18+"));
    console.log(chalk.blue("   Download: https://nodejs.org/"));
    console.log("");
    process.exit(1);
  }
  
  // Only show warning for very new versions, not for every version
  if (majorVersion >= 22) {
    console.log("");
    console.log(chalk.bgYellow.black(" ⚠️  COMPATIBILITY NOTICE "));
    console.log("");
    console.log(chalk.yellow(`   Node.js version: ${chalk.bold(nodeVersion)}`));
    console.log(chalk.gray("   For best compatibility, consider using Node.js 18-24 LTS"));
    console.log(chalk.blue("   → Download LTS: https://nodejs.org/"));
    console.log("");
  }
}
