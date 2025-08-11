import { promises as fs } from "fs";
import path from "path";
import { getTemplateInfo} from "./templateConfig.js";

export async function installTemplate(projectName: string, templateType: string) {
  const template = getTemplateInfo(templateType);
  
  if (!template) {
    throw new Error(`Template "${templateType}" not found.`);
  }
  try {
    // Crear directorio del proyecto
    await fs.mkdir(projectName, { recursive: true });
    
    // Ruta de la carpeta del template usando __dirname para encontrar la ubicación correcta
    const currentDir = path.dirname(new URL(import.meta.url).pathname);
    const projectRoot = path.resolve(currentDir, '..');
    const templateSourcePath = path.join(projectRoot, template.path);
    
    
    // Verificar que la carpeta del template existe
    if (!(await fs.access(templateSourcePath).then(() => true).catch(() => false))) {
      throw new Error(`Template folder does not exist at: ${templateSourcePath}`);
    }
    
    // Copiar todo el contenido de la carpeta del template al directorio del proyecto
    await fs.cp(templateSourcePath, projectName, { recursive: true });
    
  } catch (error) {
    console.error(`❌ Error installing template: ${error}`);
    throw error;
  }
}

