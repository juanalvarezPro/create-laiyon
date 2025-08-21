#!/usr/bin/env node
import { showBanner } from "./ui/banner.js";
import { checkNodeVersion } from "./utils/nodeVersionChecker.js";
import { ProjectSetupService } from "./services/ProjectSetupService.js";
import { TemplateInstallationService } from "./services/TemplateInstallationService.js";
import { AutomaticSetupService } from "./services/AutomaticSetupService.js";

async function main() {
  try {
    // STEP 1: Show laiyon banner
    showBanner();

    // STEP 2: Check Node.js compatibility (silent check)
    checkNodeVersion();
    
    // Get project name from command line arguments if provided
    const projectNameFromArgs = process.argv[2];
    
    // STEP 3-5: Setup project (name, WhatsApp configuration, database)
    const projectSetup = await ProjectSetupService.setupProject(projectNameFromArgs);
    
    // Install and configure template
    const installationResult = await TemplateInstallationService.installTemplate(
      projectSetup.projectName,
      projectSetup.dbType,
      projectSetup.apiKey,
      projectSetup.phone,
      projectSetup.dbConfig
    );
    
    if (!installationResult.success) {
      throw new Error(`Template installation failed: ${installationResult.error}`);
    }
    
    // Handle automatic setup
    const autoSetupResult = await AutomaticSetupService.handleAutomaticSetup(
      projectSetup.projectName,
      projectSetup.phoneNumber,
      projectSetup.databaseConnectionFailed
    );
    
    if (!autoSetupResult.success) {
      throw new Error(`Automatic setup failed: ${autoSetupResult.error}`);
    }
    
    // Exit cleanly to stop any background processes
    if (!autoSetupResult.serverRunning) {
      setTimeout(() => {
        process.exit(0);
      }, 1000);
    }
    
  } catch (error) {
    console.error(`\n❌ Error during project creation: ${error}`);
    setTimeout(() => {
      process.exit(1);
    }, 500);
  }
}

main();
