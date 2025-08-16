import inquirer from "inquirer";
import { WasapiClient } from "@laiyon/wasapi-sdk";

async function connectWasapi(): Promise<{ apiKey: string; connected: boolean }> {
  let attempts = 0;
  let apiKey = "";
  let connected = false;

  while (attempts < 2 && !connected) {
    const { enteredKey } = await inquirer.prompt([
      {
        type: "input",
        name: "enteredKey",
        message: "Enter your Wasapi API key:"
      }
    ]);

    apiKey = enteredKey;
    const client = new WasapiClient(apiKey);

    try {
      const numbers = await client.whatsapp.getWhatsappNumbers();
      if (numbers.success) {
        connected = true;
      } else {
        console.log("❌ Invalid API key or no numbers found.\n");
      }
    } catch {
      console.log("❌ Connection failed. Try again.\n");
    }

    attempts++;
  }

  if (!connected) {
    console.error("❌ Could not connect after 2 attempts. Exiting...");
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

  const choices = numbers.data.map((num: any) => ({
    name: `${num.display_name} (${num.phone_number})`,
    value: { id: num.id, phoneNumber: num.phone_number }
  }));

  console.log("\n📱 Available phones:\n");
  
  const { phoneData } = await inquirer.prompt([
    {
      type: "list",
      name: "phoneData",
      message: "Select the phone:",
      choices,
      pageSize: 10
    }
  ]);

  return { 
    phone: phoneData.id, 
    phoneNumber: phoneData.phoneNumber, 
    apiKey, 
    connected 
  };
}
