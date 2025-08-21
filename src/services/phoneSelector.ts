import { WasapiClient } from "@laiyon/wasapi-sdk";
import chalk from "chalk";
import ora from "ora";
import { phoneSelector } from "../ui/prompts/phoneSelector.js";
import { apiKeyWasapi } from "../ui/prompts/apiKeyWasapi.js";

async function connectWasapi(): Promise<{ apiKey: string; connected: boolean }> {
  let attempts = 0;
  let apiKey = "";
  let connected = false;

  console.log(chalk.cyan("   🔑 Configuring Wasapi API Key..."));
  console.log("");

  while (attempts < 2 && !connected) {

    const enteredKey = await apiKeyWasapi();
    apiKey = enteredKey;
    
    // Reset singleton before creating new client instance for retry attempts
    if (attempts > 0) {
      const tempClient = new WasapiClient("");
      tempClient.resetClient();
    }
    
    const client = new WasapiClient(apiKey);

    const spinner = ora({
      text: chalk.blue("   🔄 Connecting to Wasapi..."),
      color: "blue"
    }).start();

    try {
      const numbers = await client.whatsapp.getWhatsappNumbers();
      
      if (numbers.success) {
        spinner.succeed(chalk.green("   ✅ Successfully connected to Wasapi"));
        connected = true;
      } else {
        spinner.fail(chalk.red("   ❌ Invalid API key or no numbers available"));
        console.log(chalk.red("   💡 Verify your API key and try again"));
        console.log("");
      }
    } catch {
      spinner.fail(chalk.red("   ❌ Connection error"));
      console.log(chalk.red("   💡 Check your internet connection and try again"));
      console.log("");
    }

    attempts++;
  }

  if (!connected) {
    console.error(chalk.red("   ❌ Could not connect after 2 attempts. Exiting..."));
    process.exit(1);
  }

  return { apiKey, connected };
}


// Function to select phone
export async function selectPhone(): Promise<{ phone: string; phoneNumber: string; apiKey: string; connected: boolean }> {
  const { apiKey, connected } = await connectWasapi();

  if (!connected) {
    return { phone: "", phoneNumber: "", apiKey, connected };
  }

  const client = new WasapiClient(apiKey);
  const numbers = await client.whatsapp.getWhatsappNumbers();

  console.log("");
  console.log(chalk.cyan("   📱 Available WhatsApp numbers:"));
  console.log("");

  const choices = numbers.data.map((num: any) => ({
    name: `${chalk.green("📞")} ${num.display_name} ${chalk.gray(`(${num.phone_number})`)}`,
    value: { id: num.id, phoneNumber: num.phone_number }
  }));

  const phoneData = await phoneSelector(choices);

  console.log("");
  console.log(chalk.green(`   ✅ Selected number: ${chalk.bold(phoneData.phoneNumber)}`));
  console.log("");

  return { 
    phone: phoneData.id, 
    phoneNumber: phoneData.phoneNumber, 
    apiKey, 
    connected 
  };
}
