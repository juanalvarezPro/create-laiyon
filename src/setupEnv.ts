import { writeFileSync } from "fs";
import { join } from "path";
import { IDatabaseConfig } from "./services/database/Interfaces/IDatabase.js";

export async function setupEnv(projectName: string, envVars: Record<string, string>, dbType?: string, dbConfig?: IDatabaseConfig) {
  const envPath = join(process.cwd(), projectName, ".env");
  
  let content = Object.entries(envVars)
    .map(([key, value]) => `${key}="${value}"`)
    .join("\n");

  // Si se especifica un tipo de base de datos, agregar las variables específicas
  if (dbType && dbType !== "base-ts-wasapi-memory" && dbType !== "base-ts-wasapi-json" && dbConfig) {
    try {
      // Usar la configuración ya obtenida en lugar de pedirla nuevamente
      if (dbType === "base-ts-wasapi-mysql") {
        content += `\n\n# MySQL Database Configuration\n`;
        content += `MYSQL_DB_HOST="${dbConfig.host}"\n`;
        content += `MYSQL_DB_USER="${dbConfig.user}"\n`;
        content += `MYSQL_DB_PASSWORD="${dbConfig.password}"\n`;
        content += `MYSQL_DB_NAME="${dbConfig.database}"\n`;
        content += `MYSQL_DB_PORT="${dbConfig.port}"\n`;
      } else if (dbType === "base-ts-wasapi-postgresql") {
        content += `\n\n# PostgreSQL Database Configuration\n`;
        content += `POSTGRES_DB_HOST="${dbConfig.host}"\n`;
        content += `POSTGRES_DB_USER="${dbConfig.user}"\n`;
        content += `POSTGRES_DB_PASSWORD="${dbConfig.password}"\n`;
        content += `POSTGRES_DB_NAME="${dbConfig.database}"\n`;
        content += `POSTGRES_DB_PORT="${dbConfig.port}"\n`;
      } else if (dbType === "base-ts-wasapi-mongo") {
        content += `\n\n# MongoDB Configuration\n`;
        content += `MONGODB_URL="${dbConfig.url}"\n`;
      } else if (dbType === "base-ts-wasapi-sqlite") {
        content += `\n\n# SQLite Configuration\n`;
        content += `SQLITE_FILENAME="${dbConfig.filename}"\n`;
      } else if (dbType === "base-ts-wasapi-turso") {
        content += `\n\n# Turso Configuration\n`;
        content += `TURSO_URL="${dbConfig.url}"\n`;
        content += `TURSO_AUTH_TOKEN="${dbConfig.password}"\n`;
      }
    } catch (error) {
      console.error(`⚠️ Error configuring database: ${error}`);
      console.log("📝 A .env file with basic configuration will be created");
    }
  }

  writeFileSync(envPath, content);
  console.log(`✅ file .env created in ${projectName}/.env`); 
}
