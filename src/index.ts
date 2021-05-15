const venom = require('venom-bot');
import { Message, Whatsapp } from 'venom-bot';
import MessagesController from './controllers/MessagesController';
import { startServer } from './server';

startServer();

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
    console.log("started ")
    client.onAddedToGroup((chat) => {
      console.log(chat)
    })
    
    client.onMessage((message: Message) => {
      MessagesController.checkMessage(client, message);
      // if (message.body === 'Hi' && message.isGroupMsg === false) {
      //   client
      //     .sendText(message.from, 'Welcome Venom 🕷')
      //     .then((result) => {
      //       console.log('result: ' + typeof result);
      //       console.log('Result: ', result); //return object success
      //     })
      //     .catch((erro) => {
      //       console.log('erro: ' + typeof erro)
      //       console.error('Error when sending: ', erro); //return object error
      //     });
      // }

      // if (message.body === "@everyone" && message.isGroupMsg) {
      //   client.getGroupAdmins(message.chatId).then(admins => {
      //     client.getContact(message.id).then(participante => {
      //       if (admins.includes(participante)) {
      //         mention(client, message);
      //       } else {
      //         client.reply(message.from, "Desculpe, apenas administradores podem usar este comando!", message.id);
      //       }
      //     })
      //   })
      // }

      
    });
}

// function mention(client: Whatsapp, message: Message) {
//   client.getGroupMembers(message.chatId).then(contact => {
//     let contacts: Array<string> = [];
//     let stringContacts: string = "";

//     contact.forEach(c => {
//       if (!c.isMe) {
//         contacts.push(c.id.user)
//         stringContacts += "@" + c.id.user + " "
//       }
//     })

//     client.sendMentioned(message.from, "Yay! " + stringContacts, contacts)
//       .then((result) => {
//         console.log('result: ' + typeof result);
//         console.log('Result: ', result); //return object success
//       })
//       .catch((erro) => {
//         console.log('\n -------------------------------------------------erro: ' + typeof erro)
//         console.error('Error when sending: ', erro); //return object error
//       });
//   })
// }