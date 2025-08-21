import chalk from "chalk";
import ora from "ora";
import { installTemplate } from "../templates/templateInstaller.js";
import { setupEnv } from "../setupEnv.js";
import { IDatabaseConfig } from "./database/Interfaces/IDatabase.js";

export interface TemplateInstallationResult {
  success: boolean;
  error?: string;
}

export class TemplateInstallationService {
  static async installTemplate(
    projectName: string,
    dbType: string,
    apiKey: string,
    phone: string,
    dbConfig?: IDatabaseConfig
  ): Promise<TemplateInstallationResult> {
    try {
      // Continue with automatic setup steps that are already clear
      console.log("");
      console.log(chalk.bgGreen.black(" 📦 TEMPLATE INSTALLATION "));
      console.log("");
      
      const spinner = ora("📦 Installing template...").start();
      await installTemplate(projectName, dbType);
      spinner.succeed(chalk.green("✅ Template installed successfully"));

      // Configure environment variables
      console.log("");
      console.log(chalk.bgBlue.white(" 🔧 ENVIRONMENT SETUP "));
      console.log("");
      
      await setupEnv(projectName, {
        API_KEY: apiKey,
        PHONE_ID: phone
      }, dbType, dbConfig);

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }
}
