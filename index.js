const {
    Client,
    LocalAuth,
    MessageMedia
} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const mime = require('mime-types');

const client = new Client({
    webVersionCache: {
        type: "none"
    },
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});
//Genera el código qr para conectarse a whatsapp-web
client.on('qr', qr => {
    qrcode.generate(qr, {
        small: true
    });
});


const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 3000;

// Define una ruta única
app.post('/send_mensaje', async (req, res) =>  {
    console.log(req.body.phone);        // Para datos enviados en el body

    const number = "51" + req.body.phone + "@c.us";
 

    // Ruta del archivo que quieres enviar
    const filePath = 'document.pdf'; // Cambia esto por la ruta de tu archivo
    const fileMimeType = mime.lookup(filePath);

    // Lee el archivo y crea un objeto MessageMedia
    const fileData = fs.readFileSync(filePath);
    const base64File = fileData.toString('base64');
    //const media = new MessageMedia(fileMimeType, base64File, 'file.pdf'); // Cambia 'file.pdf' por el nombre del archivo

 
  // Enviar imagen
  const media = await MessageMedia.fromFilePath("img.jpg");
  await client.sendMessage(number, media).then(response => {
      console.log(`Imagen enviada a ${number}`);
  }).catch(err => {
      console.error(`No se pudo enviar la imagen a ${number}:`, err);
  });

    // enviando mensaje
    await client.sendMessage(number, 'Este un mensaje publicitario').then(response => {
        console.log(`Archivo enviado a ${number}`);
    }).catch(err => {
        console.error(`No se pudo enviar el archivo a ${number}: `, err);
    });
    //enviando documento
    /*await client.sendMessage(number, media).then(response => {
        console.log(`Archivo enviado a ${number}`);
    }).catch(err => {
        console.error(`No se pudo enviar el archivo a ${number}: `, err);
    });*/

   

    res.json({
        message: req.body.message,
        success: true,
        error: false
    });
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

//Si la conexión es exitosa muestra el mensaje de conexión exitosa


/* client.on('ready', () => {
    console.log('Conexion exitosa nenes');
     // Lista de números a los que quieres enviar el mensaje
    const numbers = [
        '51974187662@c.us',
        // Añade más números aquí
    ];

    // ESTO ES UN COMENTARIO

    // Ruta del archivo que quieres enviar
 const filePath = 'file.pdf'; // Cambia esto por la ruta de tu archivo
 const fileMimeType = mime.lookup(filePath);

 // Lee el archivo y crea un objeto MessageMedia
 const fileData = fs.readFileSync(filePath);
 const base64File = fileData.toString('base64');
 const media = new MessageMedia(fileMimeType, base64File, 'file.pdf'); // Cambia 'file.pdf' por el nombre del archivo

 // Enviar el archivo a cada número
 numbers.forEach(number => {
     client.sendMessage(number, 'mensaje enviando exitosamente').then(response => {
         console.log(`Archivo enviado a ${number}`);
     }).catch(err => {
         console.error(`No se pudo enviar el archivo a ${number}: `, err);
     });
 });
 });
*/

//Aquí sucede la magia, escucha los mensajes y aquí es donde se manipula lo que queremos que haga el bot
// client.on('message', message => {
//     console.log(message.body);
// 	if(message.body === 'hola mundo') {
// 		client.sendMessage(message.from, 'Hola soy un bot, mi creador esta ocupado ayudando a gohan a salvar la tierra');
// 	}
// });

client.initialize();