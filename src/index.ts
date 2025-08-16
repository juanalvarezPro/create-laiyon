#!/usr/bin/env node
import { runPrompts, askForAutomaticSetup } from "./ui/prompts.js";
import { showBanner } from "./ui/banner.js";
import { setupEnv } from "./setupEnv.js";
import { installTemplate } from "./templates/templateInstaller.js";
import { validateTemplate} from "./templates/templateConfig.js";
import { selectPhone } from "./services/phoneSelector.js";
import { detectSystemConfig, setupNgrokToken } from "./utils/systemDetector.js";
import { startDevServerWithNgrok } from "./services/devServer.js";
import { showManualInstructions } from "./ui/instructions.js";
import { askForGitHubStar } from "./ui/githubStar.js";
import ora from "ora";

async function main() {
  try {
    // Show awesome banner
    showBanner();
    
    const answers = await runPrompts();

    // Validate the selected template
    if (!validateTemplate(answers.dbType)) {
      console.error(`❌ Template "${answers.dbType}" is not valid`);
      process.exit(1);
    }


    const spinner = ora("📦 Installing template...").start();
    
    await installTemplate(answers.projectName, answers.dbType);
    spinner.succeed("✅ Template installed correctly");

    console.log(`\n🔧 Configuring environment variables...`);
    
    const selectedPhone = await selectPhone();
    if (!selectedPhone) {
      console.error("\n❌ No phone selected");
      process.exit(1);
    }
    
    const { phone, phoneNumber, apiKey } = selectedPhone;
    console.log(`\n✅ Phone selected: ${phoneNumber}`);
    
    await setupEnv(answers.projectName, {
      API_KEY: apiKey,
      PHONE_ID: phone
    });

    // Detect system configuration
    const systemConfig = await detectSystemConfig();

    // Ask user if they want automatic setup (only if ngrok is available)
    let canAutoSetup = systemConfig.canAutoSetup;
    
    // If ngrok is installed but no token, offer to configure it
    if (systemConfig.ngrokInstalled && !systemConfig.ngrokHasToken) {
      const tokenConfigured = await setupNgrokToken();
      canAutoSetup = tokenConfigured;
    }
    
    const wantsAutoSetup = await askForAutomaticSetup(canAutoSetup);

    if (canAutoSetup && wantsAutoSetup) {
      console.log("\n🚀 Starting automatic setup...");
      console.log("🔧 Installing packages and starting development server...");
      
      try {
        await startDevServerWithNgrok(answers.projectName, phoneNumber);
        console.log("\n🎉 Setup completed successfully!");
      } catch (autoSetupError) {
        console.log("\n⚠️ Automatic setup failed, showing manual instructions:");
        await showManualInstructions(answers.projectName, systemConfig);
      }
    } else {
      if (canAutoSetup && !wantsAutoSetup) {
        console.log("\n👤 User chose manual setup");
      }
      await showManualInstructions(answers.projectName, systemConfig);
    }

    // Ask for GitHub star at the end
    await askForGitHubStar();
    
    console.log("\n🎉 Congratulations! Your WhatsApp bot is ready!");
    console.log("Thank you for using create-laiyon");
    
    // Exit cleanly
    process.exit(0);
    
  } catch (error) {
    console.error(`\n❌ Error during project creation: ${error}`);
    process.exit(1);
  }
}

main();
