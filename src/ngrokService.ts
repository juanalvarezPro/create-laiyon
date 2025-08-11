import ngrok from "ngrok";
import qrcode from "qrcode-terminal";

export async function startNgrok(projectName: string) {
  const port = await getFreePort(3000);
  const url = await ngrok.connect({ addr: port });
  
  console.log(`\n🌐 Servidor en: ${url}`);
  console.log("📱 Escanea el QR para abrir:");
  qrcode.generate(url, { small: true });
}

async function getFreePort(startPort: number): Promise<number> {
  const net = await import("net");
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(startPort, () => {
      server.close(() => resolve(startPort));
    });
    server.on("error", () => {
      resolve(getFreePort(startPort + 1));
    });
  });
}
