// Function to check if ngrok is installed
export async function checkNgrokInstalled(): Promise<boolean> {
  try {
    const { execSync } = await import('child_process');
    execSync('which ngrok', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// Function to detect system configuration
export async function detectSystemConfig() {
  console.log("\n🔍 Detecting system configuration...");
  const isMac = process.platform === 'darwin';
  const hasNgrok = await checkNgrokInstalled();
  
  console.log(`   Operating system: ${isMac ? '🍎 macOS' : '💻 ' + process.platform}`);
  console.log(`   Ngrok installed: ${hasNgrok ? '✅ Yes' : '❌ No'}`);

  return { isMac, hasNgrok };
}
