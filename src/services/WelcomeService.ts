import { Message, Whatsapp } from "venom-bot";

export class WelcomeService {
  static sendWelcome(client: Whatsapp, message: Message) {
    client
      .sendText(message.from, "Welcome Venom 🕷")
      .then((result) => {
        console.log("result: " + typeof result);
        console.log("Result: ", result); 
      })
      .catch((erro) => {
        console.log("erro: " + typeof erro);
        console.error("Error when sending: ", erro); 
      });
  }
}

