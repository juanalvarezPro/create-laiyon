import { startNgrok } from "./ngrokService.js";
import { getFreePort } from "../utils/portUtils.js";
import { promises as fs } from "fs";

// Function to check if server is running on port
async function waitForServer(port: number, maxAttempts: number = 10): Promise<boolean> {
  const net = await import('net');
  
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await new Promise((resolve, reject) => {
        const socket = net.connect(port, '127.0.0.1', () => {
          socket.end();
          resolve(true);
        });
        socket.on('error', reject);
        setTimeout(() => reject(new Error('timeout')), 1000);
      });
      return true; // Server is responding
    } catch {
      // Wait 1 second before next attempt
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  return false; // Server didn't start after all attempts
}

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
    console.log(`🚀 Starting development server on port ${port}...`);
    
    // Save port to .env file
    await updateEnvWithPort(projectName, port);
    
    // Run npm run dev
    const devProcess = spawn('npm', ['run', 'dev'], {
      cwd: projectPath,
      stdio: 'pipe',
      env: { ...process.env, PORT: port.toString() }
    });
    
    // Wait for the server to start and verify it's running
    console.log("⏳ Waiting for server to start...");
    const serverStarted = await waitForServer(port);
    
    if (!serverStarted) {
      console.error(`❌ Server failed to start on port ${port}`);
      devProcess.kill();
      throw new Error("Development server failed to start");
    }
    
    console.log(`✅ Server running on port ${port}`);
    
    // Start ngrok with timeout
    console.log("🌐 Starting ngrok tunnel...");
    try {
      await Promise.race([
        startNgrok(projectName, port, phoneNumber),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Ngrok timeout")), 30000)
        )
      ]);
    } catch (ngrokError: any) {
      console.error(`❌ Ngrok failed: ${ngrokError}`);
      devProcess.kill();
      throw ngrokError;
    }
    
  } catch (error) {
    console.error(`❌ Error starting development server: ${error}`);
    console.log("\n📋 Manual instructions:");
    console.log(`   1. cd ${projectName}`);
    console.log(`   2. npm install`);
    console.log(`   3. npm run dev`);
  }
}
