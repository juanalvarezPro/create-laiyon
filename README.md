# 🚀 Create Laiyon - WhatsApp Bot Generator

Create professional WhatsApp bots with ease using the power of BuilderBot and Wasapi.

![Laiyon Banner](https://img.shields.io/badge/Laiyon-WhatsApp%20Bot%20Generator-brightgreen?style=for-the-badge)
![Platform Support](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-blue?style=for-the-badge)
![Node Version](https://img.shields.io/badge/Node-%3E%3D16.0.0-green?style=for-the-badge)

## ✨ Features

- 🤖 **Instant Bot Creation** - Generate WhatsApp bots in seconds
- 🔧 **Automatic Setup** - Cross-platform ngrok integration
- 🎨 **Beautiful CLI** - Professional terminal interface
- 🔒 **Secure Configuration** - Protected API keys and tokens
- 📱 **QR Code Testing** - Instant bot testing with generated QR codes
- 🌍 **Cross-Platform** - Works on Windows, macOS, and Linux
- 🚀 **Built with BuilderBot** - Modern conversation flow architecture

## 🚀 Quick Start

```bash
# With project name (recommended)
npm create @laiyon/wasapi@latest my-bot

# Interactive mode
npm create @laiyon/wasapi@latest

# Alternative with npx
npx @laiyon/create-wasapi@latest my-bot
```

That's it! The CLI will guide you through the entire setup process.

## 📋 CLI Flow

The create-laiyon CLI follows a smart, step-by-step process:

### 1. **Project Setup**
```
🚀 Welcome Banner
├── Project name input
├── Database selection (Memory available, others coming soon)
└── Template installation
```

### 2. **Wasapi Configuration** 
```
🔧 Environment Setup
├── Secure API key input (hidden with *)
├── Phone number selection
└── Environment variables creation
```

### 3. **System Detection**
```
🔍 Smart Platform Detection
├── Operating System (Windows/macOS/Linux)
├── Ngrok installation check
├── Ngrok token verification
└── Auto-setup capability assessment
```

### 4. **Automatic Setup** (if available)
```
🚀 Intelligent Automation
├── npm package installation
├── Development server startup
├── Ngrok tunnel creation
├── Webhook URL generation
└── WhatsApp QR code for testing
```

### 5. **Manual Instructions** (fallback)
```
📋 Clear Step-by-Step Guide
├── Installation commands
├── Configuration instructions
├── Ngrok setup guidance
└── Testing procedures
```

## 🛠️ System Requirements

- **Node.js** >= 16.0.0
- **npm** >= 8.0.0
- **Ngrok account** (free) for tunneling
- **Wasapi API key** for WhatsApp integration

## 🔧 Manual Setup (Alternative)

If automatic setup isn't available:

1. **Install your project:**
   ```bash
   cd your-project-name
   npm install
   ```

2. **Configure ngrok:**
   ```bash
   # Install ngrok: https://ngrok.com/download
   ngrok config add-authtoken <your-token>
   ```

3. **Start development:**
   ```bash
   npm run dev
   # In another terminal:
   ngrok http <port>
   ```

## 🏗️ Project Structure

```
your-bot/
├── src/
│   └── app.ts          # Main bot logic with conversation flows
├── .env                # Environment variables (API keys, phone ID, port)
├── package.json        # Dependencies and scripts
└── README.md           # Project documentation
```

## 🤖 Bot Features (Included Templates)

- **Welcome Flow** - Interactive menu system
- **Services Information** - Automated service descriptions
- **Support System** - Help and contact information
- **FAQ Handling** - Frequently asked questions
- **Dynamic Responses** - Personalized user interactions
- **Media Support** - Image and file sharing capabilities
- **Fallback Handling** - Smart unrecognized message responses

## 🔒 Security

- API keys are masked during input (password type)
- Ngrok tokens are securely handled
- Environment variables are properly configured
- No sensitive data is logged or displayed

## 🌍 Cross-Platform Support

| Platform | Ngrok Detection | Auto Setup | Manual Setup |
|----------|----------------|------------|--------------|
| Windows  | ✅ Yes         | ✅ Yes     | ✅ Yes       |
| macOS    | ✅ Yes         | ✅ Yes     | ✅ Yes       |
| Linux    | ✅ Yes         | ✅ Yes     | ✅ Yes       |

## 📚 Documentation

- [🌐 Laiyon Website](https://laiyon.pro) - Official website and documentation
- [BuilderBot Documentation](https://builderbot.vercel.app/)
- [Ngrok Documentation](https://ngrok.com/docs)

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for your own bots!

## 🌟 Support

If this project helped you create amazing WhatsApp bots, consider giving it a ⭐ on GitHub!

---

Made with ❤️ by the Laiyon team @juanalvarez.pro
