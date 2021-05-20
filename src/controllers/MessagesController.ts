import { Message, Whatsapp } from "venom-bot";
import MentionService from "../services/MentionService";
import QuizService from "../services/QuizService";
import { WelcomeService } from "../services/WelcomeService";

export default class MessagesController {
  static checkMessage(client: Whatsapp, message: Message) {
    if (message.body === "@everyone" && message.isGroupMsg) {
      MentionService.mention(client, message)
    }

    if (message.body.startsWith("!quiz")) {
      QuizService.createQuiz(client, message);
    }

    if (message.body.startsWith("!listQuiz")) {
      QuizService.listQuiz(client, message);
    }

    if (message.body.startsWith("!showQuiz")) {
      QuizService.showQuiz(client, message);
    }

    if (message.body.startsWith("!vote")) {
      QuizService.vote(client, message);
    }
    
    if (message.body.startsWith("!stop")) {
      QuizService.stopQuiz(client, message);
    }

    if (message.body.startsWith("!addQuiz")) {
      QuizService.addNewAnswer(client, message);
    }

    if (message.body.startsWith("!removeQuiz")) {
      QuizService.removeAnswer(client, message);
    }
  }
}