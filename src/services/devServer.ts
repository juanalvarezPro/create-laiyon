import { startNgrok } from "./ngrokService.js";
import { getFreePort } from "../utils/portUtils.js";
import { promises as fs } from "fs";

// Function to update .env file with port
async function updateEnvWithPort(projectName: string, port: number) {
  const path = await import('path');
  const envPath = path.join(process.cwd(), projectName, '.env');
  
  try {
    // Read existing .env content
    const envContent = await fs.readFile(envPath, 'utf-8');
    
    // Check if PORT already exists
    const lines = envContent.split('\n');
    const portLineIndex = lines.findIndex(line => line.startsWith('PORT='));
    
    if (portLineIndex !== -1) {
      // Update existing PORT line
      lines[portLineIndex] = `PORT=${port}`;
    } else {
      // Add new PORT line
      lines.push(`PORT=${port}`);
    }
    
    // Write updated content back to .env
    await fs.writeFile(envPath, lines.join('\n'));
    
  } catch (error) {
    console.warn(`⚠️ Warning: Could not update .env with port: ${error}`);
  }
}

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
    
    // Save port to .env file
    await updateEnvWithPort(projectName, port);
    
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
