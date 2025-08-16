// Function to show manual instructions
export async function showManualInstructions(projectName: string, systemConfig: any) {
  console.log("\n🎉 Project created successfully!");
  console.log(`\n📋 Manual setup instructions:`);
  console.log(`   1. cd ${projectName}`);
  console.log(`   2. npm install`);
  console.log(`   3. npm run dev`);
  
  if (!systemConfig.ngrokInstalled) {
    console.log(`   4. Install ngrok: https://ngrok.com/download`);
    console.log(`   5. Configure ngrok token: ngrok config add-authtoken <your-token>`);
    console.log(`   6. Run: ngrok http <port> (where <port> is the port your app runs on)`);
  } else if (!systemConfig.ngrokHasToken) {
    console.log(`   4. Configure ngrok token: ngrok config add-authtoken <your-token>`);
    console.log(`   5. Run: ngrok http <port>`);
  } else {
    console.log(`   4. In another terminal: ngrok http <port>`);
  }
}
