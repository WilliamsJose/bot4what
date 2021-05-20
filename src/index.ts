const venom = require('venom-bot');
import { Message, Whatsapp } from 'venom-bot';
import MessagesController from './controllers/MessagesController';
import { startServer } from './server';
import 'reflect-metadata';
import './database';
import createConnection from './database/index';

// conecta ao SQLite
createConnection()
// Inicia o servidor 
startServer();
// configura e inicia o venom 
venom
  .create(
    'venombot',
    (base64Qr: any) => {
      var matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
      var response: any = {};

      if (matches.length !== 3) {
        return new Error('Invalid input string');
      }

      response.type = matches[1];
      //@ts-ignore
      response.data = new Buffer.from(matches[2], 'base64');
      var imageBuffer = response;

      require('fs').writeFile(
        './src/public/qrcode.png',
        imageBuffer['data'],
        'binary',
        function (err: any) {
          if (err != null) {
            console.log(err);
          }
        }
      );
    },
    undefined,
    { logQR: true, devtools: true }
  )
  .then((client: Whatsapp) => {
    start(client)
  })
  .catch((erro: JSON) => {
    console.log('There was an error in the bot: ', erro);
  });

async function start(client: Whatsapp) {
  console.log("started")
  client.onAddedToGroup((chat) => {
    console.log(chat)
  })
  
  client.onMessage((message: Message) => {
    MessagesController.checkMessage(client, message);
  });
}