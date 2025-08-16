# Create Laiyon CLI - Source Structure

This document describes the organized folder structure of the CLI source code.

## 📁 Folder Structure

```
src/
├── index.ts              # Main entry point
├── setupEnv.ts           # Environment setup utilities
├── services/             # Service layer - External integrations
│   ├── devServer.ts      # Development server management
│   ├── ngrokService.ts   # Ngrok tunnel service
│   └── phoneSelector.ts  # Wasapi phone selection service
├── templates/            # Template management
│   ├── templateConfig.ts # Template configuration and validation
│   └── templateInstaller.ts # Template installation logic
├── ui/                   # User interface components
│   ├── instructions.ts   # Manual instructions display
│   └── prompts.ts        # Interactive prompts
└── utils/                # Utility functions
    ├── portUtils.ts      # Port management utilities
    └── systemDetector.ts # System configuration detection
```

## 📋 Module Responsibilities

### **🎯 Main Entry Point**
- **`index.ts`** - Orchestrates the entire CLI flow

### **⚙️ Services** (`services/`)
- **`devServer.ts`** - Handles npm package installation and development server startup
- **`ngrokService.ts`** - Manages ngrok tunnel creation and WhatsApp QR generation
- **`phoneSelector.ts`** - Handles Wasapi API connection and phone number selection

### **📄 Templates** (`templates/`)
- **`templateConfig.ts`** - Defines available templates and validation
- **`templateInstaller.ts`** - Handles template copying and project setup

### **🖥️ User Interface** (`ui/`)
- **`instructions.ts`** - Displays manual setup instructions
- **`prompts.ts`** - Interactive command-line prompts

### **🔧 Utilities** (`utils/`)
- **`portUtils.ts`** - Port availability checking
- **`systemDetector.ts`** - System configuration detection (macOS/ngrok)
