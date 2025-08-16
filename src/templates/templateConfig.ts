export interface TemplateConfig {
  name: string;
  path: string;
}

export const AVAILABLE_TEMPLATES: Record<string, TemplateConfig> = {
  "base-ts-wasapi-memory": {
    name: "Wasapi + Memory",
    path: "starters/apps/base-ts-wasapi-memory"
  },
  "base-ts-wasapi-json": {
    name: "Wasapi + Json",
    path: "starters/apps/base-ts-wasapi-json"
  },
  "base-ts-wasapi-mongo": {
    name: "Wasapi + MongoDB",
    path: "starters/apps/base-ts-wasapi-mongo"
  },
  "base-ts-wasapi-mysql": {
    name: "Wasapi + MySQL",
    path: "starters/apps/base-ts-wasapi-mysql"
  },
  "base-ts-wasapi-postgresql": {
    name: "Wasapi + PostgreSQL",
    path: "starters/apps/base-ts-wasapi-postgresql"
  }
};

export function getTemplateInfo(templateType: string): TemplateConfig | undefined {
  return AVAILABLE_TEMPLATES[templateType];
}

export function listTemplates() {
  console.log("\n📚 Available templates:\n");
  
  Object.entries(AVAILABLE_TEMPLATES).forEach(([key, template]) => {
    console.log(`🧩 ${template.name} (${key})`);
    console.log("");
  });
}


export function validateTemplate(templateType: string): boolean {
  return templateType in AVAILABLE_TEMPLATES;
}
