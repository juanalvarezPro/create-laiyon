import dotenv from "dotenv";
import { createBot, createFlow, createProvider, addKeyword} from '@builderbot/bot'
import { WasapiProvider as  Provider } from "@laiyon/wasapi-provider";
import { MemoryDB as Database } from '@builderbot/bot'
//Exportamos libreria wasapi-sdk

dotenv.config();

// Configuracion de variables de entorno
const port = process.env.PORT ?? '4000';
const token = process.env.API_KEY
const deviceId = process.env.PHONE_ID

//Creacion del flujo
const flowPrincipal = addKeyword<Provider, Database>(['Hola', 'Buenos dias'])
  .addAnswer('Hola Bienvenido! desde addAnswer ')
  .addAction(async (ctx, { provider }) => {
    await provider.sendAttachment(ctx.from, 'https://wasapi-assets.s3.us-east-2.amazonaws.com/media/6617529600737-1754405177.jpeg', "esto viene con un caption", 'Video')
  })



const main = async () => {
    const adapterFlow = createFlow([flowPrincipal])
    // Aseguramos que token y deviceId sean strings, no undefined
    if (!token || !deviceId) {
        throw new Error("The environment variables API_KEY and PHONE_ID must be defined.")
    }
    const adapterProvider = createProvider(Provider, { token, deviceId })
    const adapterDB = new Database()

    const { httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    httpServer(Number(port))
}

main()