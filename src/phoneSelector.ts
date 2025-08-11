import inquirer from "inquirer";
import { WasapiClient } from "wasapi-sdk";

export async function selectPhone(): Promise<{ phone: string; apiKey: string } | null> {
  let phone: string | null = null;
  let apiKey: string = "";

  while (!phone) {
    // Pedir API key al usuario
    const { apiKey: enteredKey } = await inquirer.prompt([
      {
        type: "input",
        name: "apiKey",
        message: "Enter your Wasapi API key:"
      }
    ]);

    apiKey = enteredKey;
    const client = new WasapiClient(apiKey);

    try {
      const numbers = await client.whatsapp.getWhatsappNumbers();

      if (!numbers.success) {
        console.log("❌ Invalid API key or no numbers found. Please try again.\n");
        return null;
      }

      const choices = numbers.data.map((num: any) => ({
        name: `${num.display_name} (${num.phone_number})`,
        value: num.id
      }));

      const { phone: selectedPhone } = await inquirer.prompt([
        {
          type: "list",
          name: "phone",
          message: "Select the phone:",
          choices
        }
      ]);

      phone = selectedPhone;
    } catch {
      // No mostramos el error real del SDK
      console.log("❌ Could not connect to Wasapi. Check your API key and try again.\n");
    }
  }

  return { phone, apiKey };
}
