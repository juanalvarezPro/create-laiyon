import chalk from "chalk";
import { DATABASE_CHOICES } from "../ui/prompts/databaseSetup.js";
import { validateTemplate } from "../templates/templateConfig.js";
import { selectPhone } from "./phoneSelector.js";
import { DatabaseConfigService } from "./database/services/DatabaseConfigService.js";
import { IDatabaseConfig } from "./database/Interfaces/IDatabase.js";
import inquirer from "inquirer";

export interface ProjectSetupResult {
  projectName: string;
  dbType: string;
  phone: string;
  phoneNumber: string;
  apiKey: string;
  dbConfig?: IDatabaseConfig;
  databaseConnectionFailed?: boolean;
}

export class ProjectSetupService {
  static async setupProject(projectNameFromArgs?: string): Promise<ProjectSetupResult> {
    // STEP 3: Show project name or create project name
    console.log(chalk.bgGreen.black(" 📁 PROJECT SETUP "));
    console.log("");
    
    // Validate project name if provided via command line
    if (projectNameFromArgs) {
      if (!/^[a-zA-Z0-9_-]+$/.test(projectNameFromArgs)) {
        console.error("❌ Project name can only contain letters, numbers, hyphens, and underscores");
        process.exit(1);
      }
      console.log(chalk.green(`   Project: ${chalk.bold(projectNameFromArgs)}`));
      console.log("");
    }
    
    // Get project name first
    let projectName: string;
    if (projectNameFromArgs) {
      projectName = projectNameFromArgs;
    } else {
      const { projectName: name } = await inquirer.prompt([
        {
          type: "input",
          name: "projectName",
          message: chalk.blue("📁 Project name:"),
          default: "wasabot-app"
        }
      ]);
      projectName = name;
    }

    // STEP 4: Wasapi environment API key and then select number (FIRST)
    console.log("");
    console.log(chalk.bgBlue.white(" 🔑 WHATSAPP CONFIGURATION "));
    console.log("");
    
    const selectedPhone = await selectPhone();
    if (!selectedPhone) {
      console.error("\n❌ No phone selected");
      process.exit(1);
    }
    
    const { phone, phoneNumber, apiKey } = selectedPhone;
    console.log(`\n✅ Phone selected: ${phoneNumber}`);

    // STEP 5: Database selection (SECOND)
    console.log("");
    console.log(chalk.bgYellow.black(" 🗄️ DATABASE SELECTION "));
    console.log("");

    const { dbType } = await inquirer.prompt([
      {
        type: "list",
        name: "dbType",
        message: chalk.blue("🗄️ Database:"),
        choices: DATABASE_CHOICES,
        default: "base-ts-wasapi-memory"
      }
    ]);

    // Validate the selected template
    if (!validateTemplate(dbType)) {
      console.error(`❌ Template "${dbType}" is not valid`);
      process.exit(1);
    }

    // STEP 6: Database configuration (if not memory or json)
    let dbConfig: IDatabaseConfig | undefined = undefined;
    let databaseConnectionFailed = false;
    if (dbType !== "base-ts-wasapi-memory" && dbType !== "base-ts-wasapi-json") {
      console.log("");
      console.log(chalk.bgCyan.black(" ⚙️ DATABASE CONFIGURATION "));
      console.log("");
      
      try {
        const dbTypeName = dbType.replace('base-ts-wasapi-', '');
        dbConfig = await DatabaseConfigService.configureDatabase(dbTypeName);
        
        // Test real database connection using optimized validation
        const isValid = await DatabaseConfigService.validateDatabaseConnection(dbTypeName, dbConfig);
        if (isValid) {
          console.log(`✅ Successfully connected to ${dbTypeName.toUpperCase()}`);
        } else {
          throw new Error(`Could not connect to ${dbTypeName.toUpperCase()}`);
        }
      } catch (error) {
        console.error(`\n❌ Error configuring database: ${error}`);
        console.log("📝 Database connection failed. You'll need to fix this manually.");
        console.log("📝 Continuing with basic configuration...");
        // Mark that database connection failed, but keep the config for .env file
        console.log("📝 Database configuration will be saved to .env file for manual troubleshooting.");
        databaseConnectionFailed = true;
      }
    }

    return {
      projectName,
      dbType,
      phone,
      phoneNumber,
      apiKey,
      dbConfig,
      databaseConnectionFailed
    };
  }
}
