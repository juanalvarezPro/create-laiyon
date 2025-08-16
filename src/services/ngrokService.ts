import ngrok from "ngrok";
import qrcode from "qrcode-terminal";
import { getFreePort } from "../utils/portUtils.js";



export async function startNgrok(projectName: string, port?: number, phoneNumber?: string) {
  try {
    const targetPort = port || await getFreePort(3000);
    
    // Start ngrok directly - let it handle multiple tunnel limitations
    
    console.log(`🔌 Connecting ngrok to port ${targetPort}...`);
    const url = await ngrok.connect({ addr: targetPort });
    
    // Generate webhook URL
    const webhookUrl = `${url}/webhook/wasapi`;
    
    console.log(`🔗 Webhook URL: ${webhookUrl}`);
    console.log(`   Use this URL in your Wasapi configuration`);
    
    // Generate wa.me QR if phone number is provided
    if (phoneNumber) {
      await generateWaMeQR(phoneNumber);
    }
    
    return { url, webhookUrl };
    
  } catch (error: any) {
    // Handle specific ngrok errors
    if (error.message?.includes('ECONNREFUSED')) {
      throw new Error(`🚫 Ngrok free account limitation detected!\n\n💡 Free accounts allow only 1 tunnel at a time.\n\n📋 Solutions:\n   • Close other ngrok tunnels: pkill ngrok\n   • Or upgrade to Ngrok Pro for multiple tunnels\n   • Or use manual setup instead`);
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
    
    console.log(`\n📱 Test your bot by scanning this QR:`);
    qrcode.generate(waMeLink, { small: true });
    
    console.log(`\n🔗 Or click this link directly:`);
    console.log(`   ${waMeLink}`);
    console.log(`\n💡 Tip: Ctrl+Click (Cmd+Click on Mac) to open in your browser`);
    
  } catch (error) {
    console.warn(`⚠️ Could not generate wa.me QR: ${error}`);
  }
}
