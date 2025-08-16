// Helper function to find free port
export async function getFreePort(startPort: number): Promise<number> {
  const net = await import("net");
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(startPort, () => {
      const port = (server.address() as any)?.port || startPort;
      server.close(() => resolve(port));
    });
    server.on("error", () => {
      resolve(getFreePort(startPort + 1));
    });
  });
}
