import ngrok from "ngrok";
import qrcode from "qrcode-terminal";
import chalk from "chalk";
import { getFreePort } from "../utils/portUtils.js";



export async function startNgrok(projectName: string, port?: number, phoneNumber?: string) {
  try {
    const targetPort = port || await getFreePort(3000);
    
    // Start ngrok directly - let it handle multiple tunnel limitations
    
    const url = await ngrok.connect({ addr: targetPort });
    
    // Generate webhook URL
    const webhookUrl = `${url}/webhook/wasapi`;
    
    console.log("");
    console.log(chalk.bgGreen.black(" ✅ NGROK TUNNEL ACTIVE "));
    console.log("");
    console.log(chalk.green.bold("📍 Webhook URL:"));
    console.log(chalk.cyan(`   ${webhookUrl}`));
    console.log(chalk.gray("   → Use this URL in your Wasapi configuration"));
    console.log("");
    
    // Generate wa.me QR if phone number is provided
    if (phoneNumber) {
      await generateWaMeQR(phoneNumber);
    }
    
    return { url, webhookUrl };
    
  } catch (error: any) {
    // Handle specific ngrok errors
    if (error.message?.includes('ECONNREFUSED')) {
      throw new Error(`🚫 Ngrok limitation: Free accounts allow only 1 tunnel.\n💡 Close other tunnels: pkill ngrok`);
    } else {
      throw new Error(`Ngrok connection failed: ${error.message || error}`);

    }
  }
}



async function generateWaMeQR(phoneNumber: string) {
  try {
    // Clean phone number (remove spaces, dashes, etc.)
    const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
    
    // Generate wa.me link with predefined message
    const waMeLink = `https://wa.me/${cleanPhoneNumber}?text=test`;
    
    console.log(chalk.bgBlue.white(" 📱 TEST YOUR BOT "));
    console.log("");
    qrcode.generate(waMeLink, { small: true });
    
    console.log(chalk.blue.bold("🔗 Or click this link:"));
    console.log(chalk.cyan(`   ${waMeLink}`));
    console.log(chalk.gray("   💡 Ctrl+Click (Cmd+Click on Mac) to open"));
    console.log("");
    
  } catch (error) {
    console.warn(`⚠️ Could not generate wa.me QR: ${error}`);
  }
}
