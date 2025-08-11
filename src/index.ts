#!/usr/bin/env node
import { runPrompts } from "./prompts.js";
import { setupEnv } from "./setupEnv.js";
import { startNgrok } from "./ngrokService.js";
import { installTemplate } from "./templateInstaller.js";
import { validateTemplate} from "./templateConfig.js";
import { selectPhone } from "./phoneSelector.js";
import ora from "ora";

async function main() {
  try {
    console.log("🚀 Welcome to create-wasabot CLI\n");
    
    const answers = await runPrompts();

    // Validar el template seleccionado
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
    
    const { phone, apiKey } = selectedPhone;
    
    await setupEnv(answers.projectName, {
      API_KEY: apiKey,
      PHONE_ID: phone
    });

    // console.log("🌐 Iniciando túnel Ngrok...");
    // await startNgrok(answers.projectName);

    console.log("\n🎉 Project created successfully!");
    console.log(`\n📋 Next steps:`);
    console.log(`   1. cd ${answers.projectName}`);
    console.log(`   2. npm install`);
    console.log(`   3. npm start`);
    
  } catch (error) {
    console.error(`\n❌ Error during project creation: ${error}`);
    process.exit(1);
  }
}

main();
