// Function to show manual instructions
export async function showManualInstructions(projectName: string, isMac: boolean, hasNgrok: boolean) {
  console.log("\n🎉 Project created successfully!");
  console.log(`   1. cd ${projectName}`);
  console.log(`   2. npm install`);
  console.log(`   3. npm run dev`);
  
  if (!hasNgrok) {
    console.log(`   4. Install ngrok: https://ngrok.com/download`);
    console.log(`   5. Run: ngrok http <port> (where <port> is the port your app runs on)`);
  } else if (isMac && hasNgrok) {
    console.log(`   4. In another terminal: ngrok http <port>`);
  }
}
