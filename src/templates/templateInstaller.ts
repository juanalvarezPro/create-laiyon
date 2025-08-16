import { promises as fs } from "fs";
import path from "path";
import { getTemplateInfo} from "./templateConfig.js";

export async function installTemplate(projectName: string, templateType: string) {
  const template = getTemplateInfo(templateType);
  
  if (!template) {
    throw new Error(`Template "${templateType}" not found.`);
  }
  try {
    // Create project directory
    await fs.mkdir(projectName, { recursive: true });
    
    // Template folder path using __dirname to find the correct location
    const currentDir = path.dirname(new URL(import.meta.url).pathname);
    const projectRoot = path.resolve(currentDir, '../..');
    const templateSourcePath = path.join(projectRoot, template.path);
    
    
    // Verify that the template folder exists
    if (!(await fs.access(templateSourcePath).then(() => true).catch(() => false))) {
      throw new Error(`Template folder does not exist at: ${templateSourcePath}`);
    }
    
    // Copy all template folder content to project directory
    await fs.cp(templateSourcePath, projectName, { recursive: true });
    
    // Update package.json with project name
    await updatePackageJson(projectName);
    
  } catch (error) {
    console.error(`❌ Error installing template: ${error}`);
    throw error;
  }
}

async function updatePackageJson(projectName: string) {
  const packageJsonPath = path.join(process.cwd(), projectName, 'package.json');
  
  try {
    // Read existing package.json
    const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(packageJsonContent);
    
    // Update project name
    packageJson.name = projectName;
    
    // Write updated package.json
    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
    
  } catch (error) {
    console.warn(`⚠️ Warning: Could not update package.json name: ${error}`);
  }
}
