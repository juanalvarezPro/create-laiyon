import { writeFileSync } from "fs";
import { join } from "path";

export async function setupEnv(projectName: string, envVars: Record<string, string>) {
  const envPath = join(process.cwd(), projectName, ".env");
  const content = Object.entries(envVars)
    .map(([key, value]) => `${key}="${value}"`)
    .join("\n");
  writeFileSync(envPath, content);
}
