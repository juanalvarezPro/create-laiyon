import chalk from "chalk";
import { askForAutomaticSetup } from "../ui/prompts/automaticSetup.js";
import { detectSystemConfig, setupNgrokToken } from "../utils/systemDetector.js";
import { startDevServerWithNgrok } from "./devServer.js";
import { showManualInstructions } from "../ui/instructions.js";
import { askForGitHubStar } from "../ui/githubStar.js";

export interface AutomaticSetupResult {
  success: boolean;
  serverRunning: boolean;
  error?: string;
}

export class AutomaticSetupService {
  static async handleAutomaticSetup(projectName: string, phoneNumber: string, databaseFailed: boolean = false): Promise<AutomaticSetupResult> {
    try {
      // Detect system configuration
      const systemConfig = await detectSystemConfig();

      // If database connection failed, don't offer automatic setup
      if (databaseFailed) {
        console.log(chalk.yellow("\n⚠️ Database connection failed. Automatic setup is not available."));
        console.log(chalk.yellow("📝 Showing manual setup instructions instead."));
        await showManualInstructions(projectName, systemConfig, true);
        await askForGitHubStar();
        return { success: true, serverRunning: false };
      }
      
      // Ask user if they want automatic setup (only if ngrok is available)
      let canAutoSetup = systemConfig.canAutoSetup;
      
      // If ngrok is installed but no token, offer to configure it
      if (systemConfig.ngrokInstalled && !systemConfig.ngrokHasToken) {
        const tokenConfigured = await setupNgrokToken();
        canAutoSetup = tokenConfigured;
      }
      
      const wantsAutoSetup = await askForAutomaticSetup(canAutoSetup);

      if (canAutoSetup && wantsAutoSetup) {
        try {
          await startDevServerWithNgrok(projectName, phoneNumber);
          // ✅ SUCCESS: Server is running with ngrok
          return { success: true, serverRunning: true };
        } catch (autoSetupError) {
          console.log("\n⚠️ Automatic setup failed, showing manual instructions:");
          await showManualInstructions(projectName, systemConfig);
          return { 
            success: false, 
            serverRunning: false, 
            error: autoSetupError instanceof Error ? autoSetupError.message : String(autoSetupError) 
          };
        }
      } else {
        if (canAutoSetup && !wantsAutoSetup) {
          console.log("\n👤 User chose manual setup");
        }
        await showManualInstructions(projectName, systemConfig);
        
        // Ask for GitHub star at the end (only for manual setup)
        await askForGitHubStar();
        
        return { success: true, serverRunning: false };
      }
    } catch (error) {
      return { 
        success: false, 
        serverRunning: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }
}
