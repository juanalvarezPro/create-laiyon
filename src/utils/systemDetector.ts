import chalk from "chalk";

// Function to check if ngrok is installed and configured
export async function checkNgrokInstalled(): Promise<{ installed: boolean; hasToken: boolean }> {
  try {
    const { execSync } = await import('child_process');
    
    // First check if ngrok command exists (cross-platform)
    const command = process.platform === 'win32' ? 'where ngrok' : 'which ngrok';
    execSync(command, { stdio: 'ignore' });
    
    // Then verify ngrok actually works by running it
    try {
      execSync('ngrok version', { stdio: 'pipe', timeout: 3000 });
    } catch {
      // If ngrok version fails, it means ngrok is not properly installed
      return { installed: false, hasToken: false };
    }
    
    // Check if ngrok token is configured
    let hasToken = false;
    try {
      const output = execSync('ngrok config check', { stdio: 'pipe', encoding: 'utf-8', timeout: 3000 });
      hasToken = !output.includes('not found') && !output.includes('invalid');
    } catch {
      hasToken = false;
    }
    
    return { installed: true, hasToken };
  } catch {
    return { installed: false, hasToken: false };
  }
}

// Function to detect system configuration
export async function detectSystemConfig() {
  const platform = process.platform;
  const platformName = platform === 'darwin' ? '🍎 macOS' : 
                      platform === 'win32' ? '🪟 Windows' : 
                      platform === 'linux' ? '🐧 Linux' : 
                      `💻 ${platform}`;
  
  const ngrokStatus = await checkNgrokInstalled();
  
  console.log("");
  console.log(chalk.bgGray.white(" 🔍 SYSTEM DETECTION "));
  console.log("");
  console.log(chalk.blue(`   Platform: ${platformName}`));
  console.log(chalk.blue(`   Ngrok: ${ngrokStatus.installed ? (ngrokStatus.hasToken ? '✅ Ready' : '⚠️ Needs token') : '❌ Not installed'}`));
  console.log("");

  return { 
    platform, 
    ngrokInstalled: ngrokStatus.installed, 
    ngrokHasToken: ngrokStatus.hasToken,
    canAutoSetup: ngrokStatus.installed && ngrokStatus.hasToken
  };
}

// Function to setup ngrok token if needed
export async function setupNgrokToken(): Promise<boolean> {
  const inquirer = await import('inquirer');
  
  console.log("\n🔑 Ngrok token required for automatic setup");
  console.log("   Get your free token from: https://dashboard.ngrok.com/get-started/your-authtoken");
  
  const { token } = await inquirer.default.prompt([
    {
      type: "password",
      name: "token",
      message: "Enter your ngrok authtoken:",
      mask: "*"
    }
  ]);
  
  if (!token || token.trim() === '') {
    console.log("❌ No token provided");
    return false;
  }
  
  try {
    const { execSync } = await import('child_process');
    execSync(`ngrok config add-authtoken ${token.trim()}`, { stdio: 'pipe' });
    console.log("✅ Ngrok token configured successfully");
    return true;
  } catch (error) {
    console.error("❌ Failed to configure ngrok token");
    return false;
  }
}
