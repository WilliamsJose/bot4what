import { Message, Whatsapp } from "venom-bot";
import HelpService from "../services/HelpService";
import MentionService from "../services/MentionService";
import QuizService from "../services/QuizService";

export default class MessagesController {
  static checkMessage(client: Whatsapp, message: Message) {
    if (message.body.startsWith("@everyone") && message.isGroupMsg) {
      MentionService.mention(client, message)
    }

    if (message.body.startsWith("!help") && message.isGroupMsg) {
      HelpService.help(client, message)
    }

    if (message.body.startsWith("!quiz") && message.isGroupMsg) {
      QuizService.createQuiz(client, message);
    }

    if (message.body.startsWith("!listQuiz") && message.isGroupMsg) {
      QuizService.listQuiz(client, message);
    }

    if (message.body.startsWith("!showQuiz") && message.isGroupMsg) {
      QuizService.showQuiz(client, message);
    }

    if (message.body.startsWith("!vote") && message.isGroupMsg) {
      QuizService.vote(client, message);
    }
    
    if (message.body.startsWith("!stop") && message.isGroupMsg) {
      QuizService.stopQuiz(client, message);
    }

    if (message.body.startsWith("!addAnswer") && message.isGroupMsg) {
      QuizService.addNewAnswer(client, message);
    }

    if (message.body.startsWith("!removeAnswer") && message.isGroupMsg) {
      QuizService.removeAnswer(client, message);
    }
  }
}