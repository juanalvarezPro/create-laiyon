import inquirer from "inquirer";
import { WasapiClient } from "wasapi-sdk";

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


// Función para seleccionar el teléfono
export async function selectPhone(): Promise<{ phone: string; apiKey: string; connected: boolean }> {
  const { apiKey, connected } = await connectWasapi();

  if (!connected) {
    return { phone: "", apiKey, connected };
  }

  const client = new WasapiClient(apiKey);
  const numbers = await client.whatsapp.getWhatsappNumbers();

  const choices = numbers.data.map((num: any) => ({
    name: `${num.display_name} (${num.phone_number})`,
    value: num.id
  }));

  const { phone } = await inquirer.prompt([
    {
      type: "list",
      name: "phone",
      message: "Select the phone:",
      choices
    }
  ]);

  return { phone, apiKey, connected };
}
