import { Message, Whatsapp } from "venom-bot";

class HelpService {
  async help(client: Whatsapp, message: Message) {
    const helpMessage = `Comandos existentes no bot:
*@everyone*: Marca todos os participantes do grupo.
*!help*: Exibe esta mensagem.
*!quiz <Nome-do-quiz>*: Cria um novo quiz.
*!listQuiz*: Lista todos os quizzes existentes no grupo.
*!addAnswer <Nome-do-quiz>: <Resposta>*: Cria uma nova resposta para o quiz.
*!removeAnswer <Nome-do-quiz>: <Resposta>*: Remove uma nova resposta do quiz.
*!vote <Nome-do-quiz>: <Resposta>*: Vota em uma resposta do quiz.
*!showQuiz <Nome-do-quiz>*: Mostra os detalhes de um determinado quiz.
*!stopQuiz <Nome-do-quiz>*: Adiciona o status _Fechado_ ao o quiz, tornandoo impossível de editar e votar.
`
    return client.reply(message.from, helpMessage, message.id);
  }
}

export default new HelpService();