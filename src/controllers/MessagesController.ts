import { Message, Whatsapp } from "venom-bot";
import MentionService from "../services/MentionService";
import { WelcomeService } from "../services/WelcomeService";

export default class MessagesController {

  static checkMessage(client: Whatsapp, message: Message) {
    if (message.body === "@everyone" && message.isGroupMsg) {
      MentionService.mention(client, message)
    }

    // if (message.body === "!quiz") {

    // }
  }
}