// Function to check if ngrok is installed and configured
export async function checkNgrokInstalled(): Promise<{ installed: boolean; hasToken: boolean }> {
  try {
    const { execSync } = await import('child_process');
    
    // Check if ngrok command exists (cross-platform)
    const command = process.platform === 'win32' ? 'where ngrok' : 'which ngrok';
    execSync(command, { stdio: 'ignore' });
    
    // Check if ngrok token is configured
    let hasToken = false;
    try {
      const output = execSync('ngrok config check', { stdio: 'pipe', encoding: 'utf-8' });
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
  console.log("\n🔍 Detecting system configuration...");
  
  const platform = process.platform;
  const platformName = platform === 'darwin' ? '🍎 macOS' : 
                      platform === 'win32' ? '🪟 Windows' : 
                      platform === 'linux' ? '🐧 Linux' : 
                      `💻 ${platform}`;
  
  const ngrokStatus = await checkNgrokInstalled();
  
  console.log(`   Platform: ${platformName}`);
  console.log(`   Ngrok: ${ngrokStatus.installed ? (ngrokStatus.hasToken ? '✅ Ready' : '⚠️ Needs token') : '❌ Not installed'}`);
  
  console.log(""); // Add extra spacing

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
