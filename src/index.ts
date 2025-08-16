#!/usr/bin/env node
import { runPrompts } from "./ui/prompts.js";
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
    console.log("🚀 Welcome to create-wasabot CLI\n");
    
    const answers = await runPrompts();

    // Validate the selected template
    if (!validateTemplate(answers.dbType)) {
      console.error(`❌ Template "${answers.dbType}" is not valid`);
      process.exit(1);
    }


    const spinner = ora("📦 Installing template...").start();
    
    await installTemplate(answers.projectName, answers.dbType);
    spinner.succeed("✅ Template installed correctly");

    console.log(`\n🔧 Configuring environment variables......`);
    const selectedPhone = await selectPhone();
    if (!selectedPhone) {
      console.error("❌ No phone selected");
      process.exit(1);
    }
    
    const { phone, phoneNumber, apiKey } = selectedPhone;
    
    await setupEnv(answers.projectName, {
      API_KEY: apiKey,
      PHONE_ID: phone
    });

    // Detect system configuration
    const { isMac, hasNgrok } = await detectSystemConfig();

    if (isMac && hasNgrok) {
      console.log("\n🚀 Automatic configuration enabled!");
      console.log("🔧 Installing packages and starting development server...");
      await startDevServerWithNgrok(answers.projectName, phoneNumber);
    } else {
      await showManualInstructions(answers.projectName, isMac, hasNgrok);
    }
    
  } catch (error) {
    console.error(`\n❌ Error during project creation: ${error}`);
    process.exit(1);
  }
}

main();
