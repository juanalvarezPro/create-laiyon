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
  const isMac = process.platform === 'darwin';
  const hasNgrok = await checkNgrokInstalled();

  return { isMac, hasNgrok };
}
