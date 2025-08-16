import dotenv from "dotenv";
import { createBot, createFlow, createProvider, addKeyword} from '@builderbot/bot'
import { WasapiProvider as  Provider } from "@laiyon/wasapi-provider";
import { MemoryDB as Database } from '@builderbot/bot'

dotenv.config();

// Environment variables configuration
const port = process.env.PORT ?? '4000';
const token = process.env.API_KEY
const deviceId = process.env.PHONE_ID

// Welcome flow - Main entry point
const flowWelcome = addKeyword<Provider, Database>(['hello', 'hi', 'start', 'menu'])
  .addAnswer('🤖 Hello! I am Laiyon Wasapi Bot')
  .addAnswer([
    'Welcome! I can help you with:',
    '',
    '1️⃣ Information about our services',
    '2️⃣ Support and help',
    '3️⃣ Contact information',
    '4️⃣ Frequently asked questions',
    '',
    'Just type the number of your choice or write what you need!'
  ]);

// Services information flow
const flowServices = addKeyword<Provider, Database>(['1', 'services', 'info'])
  .addAnswer([
    '📋 Our Services:',
    '',
    '✅ WhatsApp Bot Development',
    '✅ API Integration',
    '✅ Automated Customer Support',
    '✅ Message Broadcasting',
    '✅ Custom Workflows',
    '',
    'Type "menu" to return to main options'
  ]);

// Support flow
const flowSupport = addKeyword<Provider, Database>(['2', 'support', 'help'])
  .addAnswer([
    '🆘 Support Options:',
    '',
    '📧 Email: support@laiyon.com',
    '💬 Live Chat: Available 24/7',
    '📞 Phone: +1 (555) 123-4567',
    '🕐 Business Hours: Mon-Fri 9AM-6PM',
    '',
    'Type "menu" to return to main options'
  ]);

// Contact information flow
const flowContact = addKeyword<Provider, Database>(['3', 'contact', 'info contact'])
  .addAnswer([
    '📞 Contact Information:',
    '',
    '🏢 Laiyon Technologies',
    '📍 123 Tech Street, Digital City',
    '🌐 Website: www.laiyon.com',
    '📧 General: info@laiyon.com',
    '📧 Sales: sales@laiyon.com',
    '',
    'Type "menu" to return to main options'
  ]);

// FAQ flow
const flowFAQ = addKeyword<Provider, Database>(['4', 'faq', 'questions'])
  .addAnswer([
    '❓ Frequently Asked Questions:',
    '',
    'Q: How long does implementation take?',
    'A: Usually 1-2 weeks depending on complexity',
    '',
    'Q: Do you offer 24/7 support?',
    'A: Yes, our premium plans include 24/7 support',
    '',
    'Q: Can I customize the bot responses?',
    'A: Absolutely! Full customization available',
    '',
    'Type "menu" to return to main options'
  ]);

// Interactive flow with dynamic responses
const flowInteractive = addKeyword<Provider, Database>(['demo', 'test', 'interactive'])
  .addAnswer('🎮 Interactive Demo Mode!')
  .addAction(async (ctx, { flowDynamic, provider }) => {
    const userName = ctx.name || 'Friend';
    await flowDynamic(`Nice to meet you, ${userName}! 👋`);
    await flowDynamic('This is a dynamic response generated in real-time');
    
    // Send an image example (replace with your actual image URL)
    await provider.sendAttachment(
      ctx.from, 
      'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/file-uploads/themes/2154867048/settings_images/6e31fe3-6658-cd-3ef-ab73b68f244_5730e14d-d3d8-42dc-8943-dfbd8b6062a0.png',
      'This is an example of sending media files!',
      'Image'
    );
  })
  .addAnswer('Type "menu" to return to main options');

// Fallback flow for unrecognized messages
const flowFallback = addKeyword<Provider, Database>([''])
  .addAnswer([
    '🤔 I didn\'t understand that.',
    '',
    'Try typing:',
    '• "menu" for main options',
    '• "help" for support',
    '• "demo" for interactive demo',
    '',
    'Or simply describe what you need!'
  ]);



const main = async () => {
    // Create flow with all conversation flows
    const adapterFlow = createFlow([
        flowWelcome,      // Main welcome and menu
        flowServices,     // Services information
        flowSupport,      // Support options
        flowContact,      // Contact information
        flowFAQ,          // Frequently asked questions
        flowInteractive,  // Interactive demo with dynamic responses
        flowFallback      // Handles unrecognized messages
    ])
    
    // Ensure token and deviceId are defined
    if (!token || !deviceId) {
        throw new Error("The environment variables API_KEY and PHONE_ID must be defined.")
    }
    
    // Create provider and database adapters
    const adapterProvider = createProvider(Provider, { token, deviceId })
    const adapterDB = new Database()

    // Create and start the bot
    const { httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    // Start HTTP server
    httpServer(Number(port))
    console.log(`🤖 Laiyon Wasapi Bot started`)
}

main()