//modulos importados desde el servidor https://npmjs.com/
import { WAConnection, DisconnectReason } from '@adiwajshing/baileys';//Libreria API de WhatsApp Web
import fs from 'fs';//leer y escribir archivos 
import { exec } from 'child_process'//ejecuta comandos automaticamente

//modulos locales
import chatbot from './chatbot.js';


let client = new WAConnection()

/*FUNCION DE AUTENTIFICACION*/
async function auth() { 
    try { // ejecuta el codigo
        client.logger.level = 'warn'//en caso de error muestra mensaje en consola
        let session = './Sesion.json' //DATOS DE LA SESION WEB

        if (fs.existsSync(session)){// EN DADO CASO QUE YA EXISTA UNA SESION, SE CARGA PARA NO VOLVER A ESCANEAR EL CODIGO QR
            client.loadAuthInfo(session)
        }
        client.on('connecting', async () => { // MENSAJE EN CONSOLA CUANDO SE ESTA CONECTANDO UNA SESION
            console.log('Iniciando sesión WhatsApp Web')
        })
        client.on('open', async () => { // MENSAJE EN CONSOLA CUANDO LA SESION SE INICIA CORRECTAMENTE
            console.log('Sesión abierta correctamente.')
            console.log('Servicios iniciados correctamente.')
        })
        client.on('close', async ({reason, isReconnecting}) => { // EN DADO CASO QUE OCURRA UN ERROR MUESTRE POR CONSOLA QUE TIPO DE ERROR ES
            if (isReconnecting == true){
                console.log('Reconectando sesión.')
            }
            if (reason == DisconnectReason.intentional) {
                console.log('·Sesion cerrada intensionalmente·')
            }
            if (reason == DisconnectReason.close) {
                console.log('·Sesion cerrada por el cliente o el servidor·')
            }
            if (reason == DisconnectReason.lost) {
                console.log('·Sesion perdida·')
            }
            if (reason == DisconnectReason.replaced) {
                console.log('·Sesion abierta en otro navegador·')
            }
            if (reason == DisconnectReason.invalidSession) {
                console.log('·Sesion Invalida abriendo nueva sesion·')
                if (fs.existsSync(session)) fs.unlinkSync(session);
                client.clearAuthInfo();
            }
            if (reason == DisconnectReason.badSession) {
                console.log('·Sesion corrupta·')
            }
            if (reason == DisconnectReason.unknown) {
                console.log('·Error desconocido·')
                if (fs.existsSync(session)) fs.unlinkSync(session);
                client.clearAuthInfo();
            }
            if (reason == DisconnectReason.timedOut ) {
                console.log('·Tiempo de espera agotado·')
            }
        })
        client.on('qr', async () => { // SI NO EXISTE NINGUNA SESION ANTERIOR ENVIA UN CODIGO QR POR CONSOLA PARA ESCANEAR POR MEDIO DEL TELEFONO
            console.log('Por favor escanea el codigo QR que se eviara a continuacion para poder iniciar los servicios del asisten virtual.')
        })
        await client.connect({timeoutMs: 30*1000}) // TIEMPO DE ESPERA PARA ENVIAR LOS CODIGOS QR
        fs.writeFileSync(session, JSON.stringify(client.base64EncodedAuthInfo(), null, '\t')) // CUANDO SE ESCANEA EL CODIGO QR SE GUARDA LA SESION
    } catch (error) {
        console.error(`Error inesperado: ${error}`)
        exec('node index.js')
    }
}

/*FUNCION DE RESPUESTA A MENSAJES*/
async function start() {
    client.on('chat-update', async (mensaje)=>{   
        await chatbot (client, mensaje)//carga de funcion externa
    })
}

auth()
start ()