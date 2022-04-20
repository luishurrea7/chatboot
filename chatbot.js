//modulos importados desde el servidor npmjs.com
import { MessageType ,Mimetype} from '@adiwajshing/baileys';//importar funciones desde libreria WhatsApp Web API
import fs from 'fs'
import moment from 'moment-timezone'//zonas horarias
moment.tz.setDefault('America/Bogota').locale('es')

//funcion chatbot exportada para usarla dentro de index.js
export default async function chatbot (client, mensaje){
    try {
        if (!mensaje.hasNewMessage) return
        mensaje = (mensaje.messages.all()[0])
        if (!mensaje.message) return
        if (mensaje.key && mensaje.key.remoteJid == 'status@broadcast') return

        const destinatario = mensaje.key.remoteJid
        let { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product, listMessage } = MessageType
        const type = Object.keys(mensaje.message)[0]
        const isGroup = destinatario.endsWith('@g.us')
        const sender = mensaje.key.fromMe ? client.user.jid : isGroup ? mensaje.participant : mensaje.key.remoteJid
        const conts = mensaje.key.fromMe ? client.user.jid : client.contacts[sender] || { notify: jid.replace(/@.+/, '') }
        const pushname = mensaje.key.fromMe ? client.user.name : conts.notify || conts.vname || conts.name || "Usuario Desconocido"
        const chats = (type === 'conversation') ? mensaje.message.conversation: (type === 'extendedTextMessage') ? mensaje.message.extendedTextMessage.text: (type == 'buttonsResponseMessage') ? mensaje.message.buttonsResponseMessage.selectedButtonId : (type == 'listResponseMessage') ? mensaje.message.listResponseMessage.singleSelectReply.selectedRowId : ''
        console.log(chats)

        const hora_ahora = moment().format('HH')
        var tiempo = 'Feliz Media Noche 🌃' 
        if (hora_ahora >= '01' && hora_ahora <= '04') { var tiempo = 'feliz madrugada 🌃'}
        if (hora_ahora >= '05' && hora_ahora <= '07') { var tiempo = 'feliz inicio de dia 🌥️'}
        if (hora_ahora >= '08' && hora_ahora <= '11') { var tiempo = 'buenos dias 🌤️'}
        if (hora_ahora >= '12' && hora_ahora <= '17') { var tiempo = 'buenas tardes🌇'}
        if (hora_ahora >= '18' && hora_ahora <= '23') { var tiempo = 'buenas noches 🌃'}

        if ((chats || "").toLowerCase().startsWith('hola')||(chats || "").toLowerCase().startsWith('menu')){
            try {
                const texto = `Hola 👋 *${pushname}* _*${tiempo},*_ te doy la bienvenida al *Chat Bot* de *soporte técnico.*\n\nEstoy diseñado para ayudarte con algunas configuraciones de tus dispositivos principales de *Internet* y *Televisión*`
                const imagen = fs.readFileSync('./recursos/imagenes/saludo.jpg')
                const messageLocation = await client.prepareMessage(destinatario, imagen, MessageType.image, {mimetype: Mimetype.jpeg})
                const botones = [{ buttonId: `fibra`, buttonText:{ displayText:'Fibra Óptica' }, type:1 }]
                const mensajeBoton  = { imageMessage: messageLocation.message.imageMessage, contentText: texto,  footerText: `\n\n_Por favor elige una de las siguientes opciones para continuar con el proceso._`,  buttons: botones,  headerType: 4 }
                client.sendMessage(destinatario, mensajeBoton , MessageType.buttonsMessage, {quoted:mensaje})
            } catch (e) {
                console.error(e)
            }
        }
        if ((chats || "").toLowerCase().startsWith('fibra')){
            try {
                const texto = `${pushname} con cual de estos servicios necesitas recibir asesoria?.\n\n`
                const opcion1 = { title: '🌐 Internet y redes WiFi', description: 'Opcion para Routers', rowId:  `opc1` }
                //const opcion2 = { title: '🌐 Internet y redes WiFi', description: 'Opcion para Repetidores', rowId:  `opc2` }
                //const opcion3 = { title: '📺 Television (TV)', description: '', rowId:  `opc3` }
                const opcion4 = { title: '🧾 Donde consultar tu factura', description: '', rowId:  `opc4` }
                const opcion5 = { title: '☎️ Como consultar tu numero de linea telefonica', description: '', rowId:  `opc5` }
                const opcion6 = { title: '👨🏻‍🔧 Canales para reporte de daños y fallas en tu servicio', description: '', rowId:  `opc6` }
                const opciones = [opcion1, /*opcion2, opcion3,*/ opcion4, opcion5, opcion6]
                const media = client.prepareMessageFromContent(destinatario, { 
                    listMessage: {
                         title: ``, 
                         description: texto, 
                         footerText : '_Para continuar con el proceso da click en *Lista de opciones* luego escoges una de las opciones y para finalizar oprimes el boton enviar para finalizar._', 
                         buttonText: 'Lista de Opciones', 
                         listType: 1, 
                         sections: [{ 
                             rows: opciones
                            }] } }, 
                            {quoted:mensaje}
                            )
                client.relayWAMessage(media)
            } catch (e) {
                console.error(e)
            }
        }
        if ((chats || "").toLowerCase().startsWith('opc1')){
            try {
                const texto = `*Lista de opciones disponibles:*\n\n1. Como cambiar el nombre y contraseña de mi wifi.\n2. Como puedo medir la velocidad de mi internet.\n3. Como ver y bloquear dispositivos extraños de mi red.`
                const imagen = fs.readFileSync('./recursos/imagenes/hola.jpg')
                const messageLocation = await client.prepareMessage(destinatario, imagen, MessageType.image, {mimetype: Mimetype.jpeg})
                const botones = [{ buttonId: `fib0`, buttonText:{ displayText:'opcion 1' }, type:1 }, { buttonId: `fibb0`, buttonText:{ displayText:'opcion 2' }, type:1 }, { buttonId: `fibc1`, buttonText:{ displayText:'opcion 3' }, type:1 }]
                const mensajeBoton  = { imageMessage: messageLocation.message.imageMessage, contentText: texto,  footerText: 'Por favor presiona el boton correspondiente a la opcion que quieres consultar',  buttons: botones,  headerType: 4 }
                client.sendMessage(destinatario, mensajeBoton , MessageType.buttonsMessage, {quoted:mensaje})
            } catch (e) {
                console.error(e)
            }
        }
        
        if ((chats || "").toLowerCase().startsWith('opc5')){
            try {
                const texto = `_Para consultar tu número de línea fija ☎️ por favor dirígete al modem si tú servicio es vozip y conecta en la parte trasera de el, en el puerto marcado como Voip o tel tu teléfono físico o acércate  directamente a tu teléfono si es una línea convencional y digita en el teclado de este el siguiente número:_\n*018000910218*\n_Al marcar este número se generará una llamada la cual mediante una grabación te notificará tu número de línea fija y el respectivo indicativo._`
                const imagen = fs.readFileSync('./recursos/imagenes/señalando.jpg')
                const messageLocation = await client.prepareMessage(destinatario, imagen, MessageType.image, {mimetype: Mimetype.jpeg})
                const botones = [{ buttonId: `menu`, buttonText:{ displayText:'Menu Principal' }, type:1 }]
                const mensajeBoton  = { imageMessage: messageLocation.message.imageMessage, contentText: texto,  footerText: '',  buttons: botones,  headerType: 4 }
                client.sendMessage(destinatario, mensajeBoton , MessageType.buttonsMessage, {quoted:mensaje})
            } catch (e) {
                console.error(e)
            }
        }
        if ((chats || "").toLowerCase().startsWith('opc6')){
            try {
                const texto = `_*Si desea reportar algún daño en tu servicio te ofrecemos 3 opciones*_\n\n_1️⃣ Mediante la línea telefónica *018000930930* podrás llamar desde una SIM de Movistar o desde tu propia línea y reportar daños._\n_2️⃣ Podrás agregar en tus contactos el número *3152333333* el cual pertenece al WhatsApp oficial de servicio al cliente de *Movistar* y reportar daños,  contratar planes, pedir asesoría y muchas opciones más._\n_3️⃣ Mediante la línea *6015885204* podrás reportar daños y generar solicitudes, esta línea te brinda la oportunidad de llamar desde cualquier operador a diferencia de la *018000930930*_`
                const imagen = fs.readFileSync('./recursos/imagenes/musica.jpg')
                const messageLocation = await client.prepareMessage(destinatario, imagen, MessageType.image, {mimetype: Mimetype.jpeg})
                const botones = [{ buttonId: `menu`, buttonText:{ displayText:'Menu Principal' }, type:1 }]
                const mensajeBoton  = { imageMessage: messageLocation.message.imageMessage, contentText: texto,  footerText: '',  buttons: botones,  headerType: 4 }
                client.sendMessage(destinatario, mensajeBoton , MessageType.buttonsMessage, {quoted:mensaje})
            } catch (e) {
                console.error(e)
            }
        }
        if ((chats || "").toLowerCase().startsWith('fib0')){
            try {
                const texto = `_*💡NOTA IMPORTANTE*_ \n\n_Ten presente que la aplicación que vas a utilizar a continuación para cambiar el nombre y contraseña de tus redes solo funciona en dispositivos móviles como tu teléfono y no en computadoras a menos de que éstas cuenten con un emulador de Android o iOS._`
                const imagen = fs.readFileSync('./recursos/imagenes/señalando2.jpg')
                const messageLocation = await client.prepareMessage(destinatario, imagen, MessageType.image, {mimetype: Mimetype.jpeg})
                const botones = [{ buttonId: `fib1`, buttonText:{ displayText:'Siguiente -❯' }, type:1 }]
                const mensajeBoton  = { imageMessage: messageLocation.message.imageMessage, contentText: texto,  footerText: 'Soporte Tecnico Fibra Optica',  buttons: botones,  headerType: 4 }
                client.sendMessage(destinatario, mensajeBoton , MessageType.buttonsMessage, {quoted:mensaje})
            }catch(e){
                console.error(e)
            }
        }
        if ((chats || "").toLowerCase().startsWith('fib1')){
            try {
                const texto = `_Chequea en tu dispositivo móvil o computadora que te encuentres conectado a alguna de tus 2 redes WiFi emitidas por el router de fibra._`
                const imagen = fs.readFileSync('./recursos/imagenes/señalando.jpg')
                const messageLocation = await client.prepareMessage(destinatario, imagen, MessageType.image, {mimetype: Mimetype.jpeg})
                const botones = [{ buttonId: `fib2`, buttonText:{ displayText:'Siguiente -❯' }, type:1 }]
                const mensajeBoton  = { imageMessage: messageLocation.message.imageMessage, contentText: texto,  footerText: 'Soporte Tecnico Fibra Optica',  buttons: botones,  headerType: 4 }
                client.sendMessage(destinatario, mensajeBoton , MessageType.buttonsMessage, {quoted:mensaje})
            }catch(e){
                console.error(e)
            }
        }
        if ((chats || "").toLowerCase().startsWith('fib2')){
            try {
                const texto = `Dirígete a la tienda de aplicaciones de tu dispositivo como Play Store, App Store, etc e ingresa en la barra de búsqueda *“Movistar Smart Wifi”* y selecciona el botón instalar y espera a que se instale`
                const imagen = fs.readFileSync('./recursos/imagenes/app.jpg')
                const messageLocation = await client.prepareMessage(destinatario, imagen, MessageType.image, {mimetype: Mimetype.jpeg})
                const botones = [{ buttonId: `fib3`, buttonText:{ displayText:'Siguiente -❯' }, type:1 }]
                const mensajeBoton  = { imageMessage: messageLocation.message.imageMessage, contentText: texto,  footerText: '_Tambien puedes descargar la aplicacion ingresando a uno de los siguientes enlaces dependiendo del sistema operativo de tu dispositivo movil_\n\nandroid: https://play.google.com/store/apps/details?id=com.movistar.co.base\n\niOS: https://apps.apple.com/co/app/movistar-smart-wifi/id1229740209',  buttons: botones,  headerType: 4 }
                client.sendMessage(destinatario, mensajeBoton , MessageType.buttonsMessage, {quoted:mensaje})
            }catch(e){
                console.error(e)
            }
        }
        if ((chats || "").toLowerCase().startsWith('fib3')){
            try {
                const texto = `Al terminar la instalación selecciona *“Abrir”*`
                const imagen = fs.readFileSync('./recursos/imagenes/appAbrir.jpg')
                const messageLocation = await client.prepareMessage(destinatario, imagen, MessageType.image, {mimetype: Mimetype.jpeg})
                const botones = [{ buttonId: `fib4`, buttonText:{ displayText:'Siguiente -❯' }, type:1 }]
                const mensajeBoton  = { imageMessage: messageLocation.message.imageMessage, contentText: texto,  footerText: 'Soporte Tecnico Fibra Optica',  buttons: botones,  headerType: 4 }
                client.sendMessage(destinatario, mensajeBoton , MessageType.buttonsMessage, {quoted:mensaje})
            }catch(e){
                console.error(e)
            }
        }
        if ((chats || "").toLowerCase().startsWith('fib4')){
            try {
                const texto = `Al abrir la aplicación esta te pedirá que le otorgues algunos permisos respecto a la ubicación los cuales deberás otorgar de la siguiente manera.`
                const imagen = fs.readFileSync('./recursos/imagenes/appPermisos.jpg')
                const messageLocation = await client.prepareMessage(destinatario, imagen, MessageType.image, {mimetype: Mimetype.jpeg})
                const botones = [{ buttonId: `fib5`, buttonText:{ displayText:'Siguiente -❯' }, type:1 }]
                const mensajeBoton  = { imageMessage: messageLocation.message.imageMessage, contentText: texto,  footerText: 'Soporte Tecnico Fibra Optica',  buttons: botones,  headerType: 4 }
                client.sendMessage(destinatario, mensajeBoton , MessageType.buttonsMessage, {quoted:mensaje})
            }catch(e){
                console.error(e)
            }
        }
        if ((chats || "").toLowerCase().startsWith('fib5')){
            try {
                const texto = `Aquí la aplicación tomará unos segundos en cargar todos sus recursos y permisos por lo que te pedimos tener un poco de paciencia, una vez que esta abra podrás explorar en su contenido, ver la información que te introduce a la App o investigar por tu cuenta y omitir dicha introducción.`
                const imagen = fs.readFileSync('./recursos/imagenes/img1.jpg')
                const messageLocation = await client.prepareMessage(destinatario, imagen, MessageType.image, {mimetype: Mimetype.jpeg})
                const botones = [{ buttonId: `fib6`, buttonText:{ displayText:'Siguiente -❯' }, type:1 }]
                const mensajeBoton  = { imageMessage: messageLocation.message.imageMessage, contentText: texto,  footerText: 'Soporte Tecnico Fibra Optica',  buttons: botones,  headerType: 4 }
                client.sendMessage(destinatario, mensajeBoton , MessageType.buttonsMessage, {quoted:mensaje})
            }catch(e){
                console.error(e)
            }
        }
        if ((chats || "").toLowerCase().startsWith('fib6')){
            try {
                const texto = `Al seleccionar *“Sincroniza tu router”* este te pedirá la contraseña de acceso al equipo que estará disponible en la parte inferior del mismo, como se mostrará a continuación y la cual deberás digitar.`
                const imagen = fs.readFileSync('./recursos/imagenes/img2.jpg')
                const messageLocation = await client.prepareMessage(destinatario, imagen, MessageType.image, {mimetype: Mimetype.jpeg})
                const botones = [{ buttonId: `fib7`, buttonText:{ displayText:'Siguiente -❯' }, type:1 }, { buttonId: `fibu`, buttonText:{ displayText:'Ver Ubicacion' }, type:1 }]
                const mensajeBoton  = { imageMessage: messageLocation.message.imageMessage, contentText: texto,  footerText: 'La ubicación de la contraseña se encuentra en la parte inferior del modem:',  buttons: botones,  headerType: 4 }
                client.sendMessage(destinatario, mensajeBoton , MessageType.buttonsMessage, {quoted:mensaje})
            }catch(e){
                console.error(e)
            }
        }
        if ((chats || "").toLowerCase().startsWith('fib7')){
            try {
                const texto = `Ingresa la contraseña en la App y selecciona ¡HECHO!`
                const imagen = fs.readFileSync('./recursos/imagenes/img3.jpg')
                const messageLocation = await client.prepareMessage(destinatario, imagen, MessageType.image, {mimetype: Mimetype.jpeg})
                const botones = [{ buttonId: `fib8`, buttonText:{ displayText:'Siguiente -❯' }, type:1 }]
                const mensajeBoton  = { imageMessage: messageLocation.message.imageMessage, contentText: texto,  footerText: 'Soporte Tecnico Fibra Optica',  buttons: botones,  headerType: 4 }
                client.sendMessage(destinatario, mensajeBoton , MessageType.buttonsMessage, {quoted:mensaje})
            }catch(e){
                console.error(e)
            }
        }
        if ((chats || "").toLowerCase().startsWith('fibu')){
            try {
                const texto = `La flecha indica la ubicacion de la contraseña que deberás ingresar en el siguiente paso`
                const imagen = fs.readFileSync('./recursos/imagenes/img4.jpg')
                const messageLocation = await client.prepareMessage(destinatario, imagen, MessageType.image, {mimetype: Mimetype.jpeg})
                const botones = [{ buttonId: `fib7`, buttonText:{ displayText:'Siguiente -❯' }, type:1 }]
                const mensajeBoton  = { imageMessage: messageLocation.message.imageMessage, contentText: texto,  footerText: '',  buttons: botones,  headerType: 4 }
                client.sendMessage(destinatario, mensajeBoton , MessageType.buttonsMessage, {quoted:mensaje})
            }catch(e){
                console.error(e)
            }
        }
        if ((chats || "").toLowerCase().startsWith('fib8')){
            try {
                const texto = `Después de esto habrás iniciado sesión en la App\n\n_💡Te aconsejamos que revises toda la información inicial que esta te brinda seleccionando la opción *“Empezamos”* y luego *“sigamos adelante”* leyendo toda la información que ofrece la App en lugar de seleccionar *“investigaré por mi cuenta, gracias”*_`
                const imagen = fs.readFileSync('./recursos/imagenes/img5.jpg')
                const messageLocation = await client.prepareMessage(destinatario, imagen, MessageType.image, {mimetype: Mimetype.jpeg})
                const botones = [{ buttonId: `fib9`, buttonText:{ displayText:'Siguiente -❯' }, type:1 }]
                const mensajeBoton  = { imageMessage: messageLocation.message.imageMessage, contentText: texto,  footerText: '',  buttons: botones,  headerType: 4 }
                client.sendMessage(destinatario, mensajeBoton , MessageType.buttonsMessage, {quoted:mensaje})
            }catch(e){
                console.error(e)
            }
        }
        if ((chats || "").toLowerCase().startsWith('fib9')){
            try {
                const texto = `Ya estás dentro de la App ahora podrás configurar tus redes wifi`
                const imagen = fs.readFileSync('./recursos/imagenes/img6.jpg')
                const messageLocation = await client.prepareMessage(destinatario, imagen, MessageType.image, {mimetype: Mimetype.jpeg})
                const botones = [{ buttonId: `fiba10`, buttonText:{ displayText:'Siguiente -❯' }, type:1 }]
                const mensajeBoton  = { imageMessage: messageLocation.message.imageMessage, contentText: texto,  footerText: '',  buttons: botones,  headerType: 4 }
                client.sendMessage(destinatario, mensajeBoton , MessageType.buttonsMessage, {quoted:mensaje})
            }catch(e){
                console.error(e)
            }
        }
        if ((chats || "").toLowerCase().startsWith('fiba10')){
            try {
                const texto = `El icono del centro de la siguiente imagen representa tu router y las esferas que salgan a su alrededor son equipos que están conectados a tus redes, así que oprime en las 3 líneas que se encuentran en la parte superior izquierda`
                const imagen = fs.readFileSync('./recursos/imagenes/img7.jpg')
                const messageLocation = await client.prepareMessage(destinatario, imagen, MessageType.image, {mimetype: Mimetype.jpeg})
                const botones = [{ buttonId: `menu`, buttonText:{ displayText:'Menu Principal' }, type:1 }]
                const mensajeBoton  = { imageMessage: messageLocation.message.imageMessage, contentText: texto,  footerText: '',  buttons: botones,  headerType: 4 }
                client.sendMessage(destinatario, mensajeBoton , MessageType.buttonsMessage, {quoted:mensaje})
            }catch(e){
                console.error(e)
            }
        }
        if ((chats || "").toLowerCase().startsWith('fibb0')){
            try {
                const texto = `_*💡NOTA IMPORTANTE*_\n\n_Ten presente que para realizar el test de velocidad debes contar con un dispositivo capaz de identificar las redes inalámbricas 5G, así como equipos de cómputo que cuenten con una tarjeta de red de al menos 1Gb._`
                const imagen = fs.readFileSync('./recursos/imagenes/señalando2.jpg')
                const messageLocation = await client.prepareMessage(destinatario, imagen, MessageType.image, {mimetype: Mimetype.jpeg})
                const botones = [{ buttonId: `fibb1`, buttonText:{ displayText:'Siguiente -❯' }, type:1 }]
                const mensajeBoton  = { imageMessage: messageLocation.message.imageMessage, contentText: texto,  footerText: 'Soporte Tecnico Fibra Optica',  buttons: botones,  headerType: 4 }
                client.sendMessage(destinatario, mensajeBoton , MessageType.buttonsMessage, {quoted:mensaje})
            }catch(e){
                console.error(e)
            }
        }
        if ((chats || "").toLowerCase().startsWith('fibb1')){
            try {
                const texto = `Ingresa al navegador de tu celular o computadora estando conectado a tu red wifi, e introduce en la barra de búsqueda www.speedtest.net/es`
                const imagen = fs.readFileSync('./recursos/imagenes/stest.jpg')
                const messageLocation = await client.prepareMessage(destinatario, imagen, MessageType.image, {mimetype: Mimetype.jpeg})
                const botones = [{ buttonId: `fibb2`, buttonText:{ displayText:'Siguiente -❯' }, type:1 }]
                const mensajeBoton  = { imageMessage: messageLocation.message.imageMessage, contentText: texto,  footerText: '',  buttons: botones,  headerType: 4 }
                client.sendMessage(destinatario, mensajeBoton , MessageType.buttonsMessage, {quoted:mensaje})
            }catch(e){
                console.error(e)
            }
        }
        if ((chats || "").toLowerCase().startsWith('fibb2')){
            try {
                const texto = `Al abrir la pagina te aconsejamos que pongas el navegador en modo ordenador o escritorio, dando clic en los 3 puntos en la parte superior derecha de la página web y seleccionando la casilla *“sitio de escritorio”*`
                const imagen = fs.readFileSync('./recursos/imagenes/stest1.jpg')
                const messageLocation = await client.prepareMessage(destinatario, imagen, MessageType.image, {mimetype: Mimetype.jpeg})
                const botones = [{ buttonId: `fibb3`, buttonText:{ displayText:'Siguiente -❯' }, type:1 }]
                const mensajeBoton  = { imageMessage: messageLocation.message.imageMessage, contentText: texto,  footerText: '',  buttons: botones,  headerType: 4 }
                client.sendMessage(destinatario, mensajeBoton , MessageType.buttonsMessage, {quoted:mensaje})
            }catch(e){
                console.error(e)
            }
        }
        if ((chats || "").toLowerCase().startsWith('fibb3')){
            try {
                const texto = `Al seleccionar el modo escritorio podrás cambiar el servidor por defecto de la página web de speedtest al cual hacer el test , al servidor de Movistar con el que se debe hacer el test de velocidad`
                const imagen = fs.readFileSync('./recursos/imagenes/stest2.jpg')
                const messageLocation = await client.prepareMessage(destinatario, imagen, MessageType.image, {mimetype: Mimetype.jpeg})
                const botones = [{ buttonId: `fibb4`, buttonText:{ displayText:'Siguiente -❯' }, type:1 }]
                const mensajeBoton  = { imageMessage: messageLocation.message.imageMessage, contentText: texto,  footerText: '',  buttons: botones,  headerType: 4 }
                client.sendMessage(destinatario, mensajeBoton , MessageType.buttonsMessage, {quoted:mensaje})
            }catch(e){
                console.error(e)
            }
        }
        if ((chats || "").toLowerCase().startsWith('fibb4')){
            try {
                const texto = `Finalmente obtendras un resultado como el de la imagen.`
                const imagen = fs.readFileSync('./recursos/imagenes/stest3.jpg')
                const messageLocation = await client.prepareMessage(destinatario, imagen, MessageType.image, {mimetype: Mimetype.jpeg})
                const botones = [{ buttonId: `menu`, buttonText:{ displayText:'Menu principal' }, type:1 }]
                const mensajeBoton  = { imageMessage: messageLocation.message.imageMessage, contentText: texto,  footerText: '\n\nSi presenta variaciones o no es lo que usted contrato por favor contaca con soporte tenico.',  buttons: botones,  headerType: 4 }
                client.sendMessage(destinatario, mensajeBoton , MessageType.buttonsMessage, {quoted:mensaje})
            }catch(e){
                console.error(e)
            }
        }
    } catch (e){
        console.error(e)
    }
}