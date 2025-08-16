#!/usr/bin/env node
import { runPrompts, askForAutomaticSetup } from "./ui/prompts.js";
import { showBanner } from "./ui/banner.js";
import { setupEnv } from "./setupEnv.js";
import { installTemplate } from "./templates/templateInstaller.js";
import { validateTemplate} from "./templates/templateConfig.js";
import { selectPhone } from "./services/phoneSelector.js";
import { detectSystemConfig } from "./utils/systemDetector.js";
import { startDevServerWithNgrok } from "./services/devServer.js";
import { showManualInstructions } from "./ui/instructions.js";
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
    console.log("   Setting up Wasapi connection");
    
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
    const { isMac, hasNgrok } = await detectSystemConfig();

    // Ask user if they want automatic setup (only if available)
    const wantsAutoSetup = await askForAutomaticSetup(isMac, hasNgrok);

    if (isMac && hasNgrok && wantsAutoSetup) {
      console.log("\n🚀 Starting automatic setup...");
      console.log("🔧 Installing packages and starting development server...");
      await startDevServerWithNgrok(answers.projectName, phoneNumber);
    } else {
      if (isMac && hasNgrok && !wantsAutoSetup) {
        console.log("\n👤 User chose manual setup");
      }
      await showManualInstructions(answers.projectName, isMac, hasNgrok);
    }
    
  } catch (error) {
    console.error(`\n❌ Error during project creation: ${error}`);
    process.exit(1);
  }
}

main();
