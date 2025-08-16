import { startNgrok } from "./ngrokService.js";
import { getFreePort } from "../utils/portUtils.js";

// Function to install packages and run server with ngrok
export async function startDevServerWithNgrok(projectName: string, phoneNumber: string) {
  const { spawn, execSync } = await import('child_process');
  const path = await import('path');
  
  try {
    const projectPath = path.join(process.cwd(), projectName);
    
    // Install packages
    console.log("📦 Installing npm packages...");
    execSync('npm install', { cwd: projectPath, stdio: 'inherit' });
    
    // Find available port
    const port = await getFreePort(3000);
    console.log(`🚀 Starting development server on port ${port}...`);
    
    // Run npm run dev
    const devProcess = spawn('npm', ['run', 'dev'], {
      cwd: projectPath,
      stdio: 'pipe',
      env: { ...process.env, PORT: port.toString() }
    });
    
    // Wait for the server to start
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Start ngrok
    await startNgrok(projectName, port, phoneNumber);
    
  } catch (error) {
    console.error(`❌ Error starting development server: ${error}`);
    console.log("\n📋 Manual instructions:");
    console.log(`   1. cd ${projectName}`);
    console.log(`   2. npm install`);
    console.log(`   3. npm run dev`);
  }
}
