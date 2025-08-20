import { startNgrok } from "./ngrokService.js";
import { getFreePort } from "../utils/portUtils.js";
import { promises as fs } from "fs";
import chalk from "chalk";
import ora from "ora";

// Function to kill process and all its children
async function killProcessTree(process: any): Promise<void> {
  if (!process || !process.pid) return;
  
  try {
    const { execSync } = await import('child_process');
    
    if (global.process.platform === 'win32') {
      // Windows: Kill process tree
      execSync(`taskkill /pid ${process.pid} /T /F`, { stdio: 'ignore' });
    } else {
      // Unix/Linux/Mac: Kill process group
      execSync(`pkill -P ${process.pid}`, { stdio: 'ignore' });
      process.kill('SIGTERM');
      
      // If still alive after 2 seconds, force kill
      setTimeout(() => {
        try {
          if (!process.killed) {
            process.kill('SIGKILL');
          }
        } catch (e) {
          // Process already dead
        }
      }, 2000);
    }
  } catch (error) {
    // Try fallback kill
    try {
      process.kill('SIGKILL');
    } catch (e) {
      // Process already dead
    }
  }
}

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
  
  let devProcess: any = null; // Declare outside try block
  
  try {
    const projectPath = path.join(process.cwd(), projectName);
    
    console.log("");
    console.log(chalk.bgBlue.white(" 🚀 AUTOMATIC SETUP "));
    console.log("");
    
    // Install packages with spinner
    const installSpinner = ora("📦 Installing packages...").start();
    try {
      execSync('npm install', { cwd: projectPath, stdio: 'pipe' });
      installSpinner.succeed(chalk.green("📦 Packages installed"));
    } catch (error) {
      installSpinner.fail(chalk.red("❌ Package installation failed"));
      throw new Error("Failed to install packages");
    }
    
    // Start server with spinner
    const serverSpinner = ora("🚀 Starting development server...").start();
    let port: number;
    try {
      port = await getFreePort(3000);
      await updateEnvWithPort(projectName, port);
      
      devProcess = spawn('npm', ['run', 'dev'], {
        cwd: projectPath,
        stdio: 'inherit', // Cambiar a 'inherit' para mostrar logs en tiempo real
        env: { ...process.env, PORT: port.toString() }
      });
      
      const serverStarted = await waitForServer(port);
      
      if (!serverStarted) {
        serverSpinner.fail(chalk.red("❌ Server failed to start"));
        devProcess.kill();
        throw new Error("Development server failed to start");
      }
      
      serverSpinner.succeed(chalk.green(`🚀 Server running on port ${port}`));
    } catch (error) {
      serverSpinner.fail(chalk.red("❌ Server startup failed"));
      throw error;
    }
    
    // Create ngrok tunnel with spinner
    const ngrokSpinner = ora("🌐 Creating ngrok tunnel...").start();
    try {
      await Promise.race([
        startNgrok(projectName, port, phoneNumber),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Ngrok timeout")), 30000)
        )
      ]);
      
      ngrokSpinner.succeed(chalk.green("🌐 Ngrok tunnel active"));
      
      // ✅ SUCCESS: Ngrok connected successfully
      console.log("");
      console.log(chalk.bgGreen.black(" 🎉 SETUP COMPLETE "));
      console.log("");
      console.log(chalk.green("🤖 Your bot is live and ready!"));
      console.log("");
      console.log(chalk.yellow("💡 Keep this terminal open"));
      console.log(chalk.gray("📋 Press Ctrl+C to stop"));
      
      // Don't kill the server - let it run!
      // The CLI will exit but the server stays alive
      
    } catch (ngrokError: any) {
      ngrokSpinner.fail(chalk.red("❌ Ngrok tunnel failed"));
      console.error(chalk.red(`   Error: ${ngrokError.message}`));
      // Kill development server and all child processes
      await killProcessTree(devProcess);
      throw ngrokError;
    }
    
  } catch (error) {
    // Kill any remaining processes and all child processes
    await killProcessTree(devProcess);
    throw error; // Re-throw to let index.ts handle it
  }
}
