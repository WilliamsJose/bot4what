import { getCustomRepository } from "typeorm";
import { Message, Whatsapp } from "venom-bot";
import { QuizRepository } from "../repository/QuizRepository";
import { VotesRepository } from "../repository/VotesRepository";

class QuizService {
  // !quiz <nome-do-quiz>
  async createQuiz(client: Whatsapp, message: Message) {
    client.getGroupAdmins(message.chatId).then((admins) => {
      client.getContact(message.sender.id).then(async (participante) => {
        //@ts-ignore
        if (admins.some((admin) => admin.user === participante.id.user)) {          
          const bodyTrimmed = message.body.trim();
          const name = bodyTrimmed.substring(6, bodyTrimmed.length).trim();
      
          const repository = getCustomRepository(QuizRepository);
          const quizExists = await repository.findOne({name});
      
          if (quizExists) {
            return client.reply(message.from, `Já existe um questionário com o nome ${name}`, message.id);
          }

          if (name.trim().length < 1) {
            return client.reply(message.from, "Você deve informar um nome para o questionário", message.id);
          }
          
          const quiz = repository.create({
            name, answers: "", group_id: message.chat.id, status: "open"
          })
      
          repository.save(quiz);
          return client.reply(message.from, `Questionário ${quiz.name} criado com sucesso`, message.id);
        } else {
          return client.reply(message.from, "Desculpe, apenas administradores podem usar este comando!", message.id);
        }
      });
    });
  }

  // !addAnswer <nome-do-quiz>: <resposta>, <resposta>, ...
  async addNewAnswer(client: Whatsapp, message: Message) {
    client.getGroupAdmins(message.chatId).then((admins) => {
      client.getContact(message.sender.id).then(async (participante) => {
        //@ts-ignore
        if (admins.some((admin) => admin.user === participante.id.user)) { 
          const repository = getCustomRepository(QuizRepository);
          const removedCommand = message.body.replace(/!addAnswer/g, "").trim();
          
          if (removedCommand.length < 1 || !removedCommand.includes(":")) {
            return client.reply(message.from, "Para adicionar uma nova resposta você deve digitar\nno formato: *!addQuiz <nome-do-quiz>: <resposta>* ", message.id);
          }
          
          const quizName = removedCommand.match(/^([^,]+):/g)[0].trim();
          const newAnswer = removedCommand.replace(quizName, "").trim();

          if (newAnswer.trim().length < 1) {
            return client.reply(message.from, "Para adicionar uma nova resposta você deve digitar\nno formato: *!addQuiz <nome-do-quiz>: <resposta>* ", message.id);
          }

          const quiz = await repository.findOne({ name: quizName.replace(/:/, "") });

          if (!quiz) {
            return client.reply(message.from, `O questionário ${quizName} não existe!`, message.id);
          }
          
          if (quiz.status === "open") {
            const oldAnswers = quiz.answers.trim();
            const newAnswers = oldAnswers.length > 1 ? oldAnswers.concat(",").concat(newAnswer) : newAnswer;
            quiz.answers = newAnswers;
        
            await repository.update(quiz.id, quiz);
        
            return client.reply(message.from, `Resposta ${newAnswer} adicionada com sucesso`, message.id);
          } else {
            return client.reply(message.from, `Este questionário está fechado.`, message.id);
          }
        } else {
          return client.reply(message.from, "Desculpe, apenas administradores podem usar este comando!", message.id);
        }
      });
    });
  }
  // removeAnswer
  // !removeQuiz <nome-do-quiz>: <resposta-a-remover>
  async removeAnswer(client: Whatsapp, message: Message) {
    client.getGroupAdmins(message.chatId).then((admins) => {
      client.getContact(message.sender.id).then(async (participante) => {
        //@ts-ignore
        if (admins.some((admin) => admin.user === participante.id.user)) { 
          const repository = getCustomRepository(QuizRepository);
          const removedCommand = message.body.replace(/!removeAnswer/g, "").trim();
          const quizName = removedCommand.match(/^([^,]+):/g)[0].trim();
          const answerToRemove = removedCommand.replace(quizName, "").trim();
      
          const quiz = await repository.findOne({ name: quizName.replace(/:/g, "") });

          if (!quiz) {
            return client.reply(message.from, `O questionário ${name} não existe!`, message.id);
          }
      
          if (quiz.status === "open") {
            if (quiz.answers.includes(answerToRemove)) {
              const newAnswers = quiz.answers.replace(answerToRemove, "");
              quiz.answers = newAnswers;
              await repository.update(quiz.id, quiz);
              return client.reply(message.from, `Resposta ${answerToRemove} removida com sucesso!`, message.id);
            }
            return client.reply(message.from, `Resposta ${answerToRemove} não existe.`, message.id);
          } else {
            return client.reply(message.from, `Este questionário está fechado.`, message.id);
          }
        } else {
          return client.reply(message.from, "Desculpe, apenas administradores podem usar este comando!", message.id);
        }
      });
    });
  }

  // !stopQuiz <nome-do-quiz>
  async stopQuiz(client: Whatsapp, message: Message) {
    client.getGroupAdmins(message.chatId).then((admins) => {
      client.getContact(message.sender.id).then(async (participante) => {
        //@ts-ignore
        if (admins.some((admin) => admin.user === participante.id.user)) { 
          const quizRepository = getCustomRepository(QuizRepository);
          const name = message.body.trim().replace(/!stopQuiz /, "");
          const quiz = await quizRepository.findOne({ name, group_id: message.chat.id });

          if (!quiz) {
            return client.reply(message.from, `O questionário ${name} não existe!`, message.id);
          }

          if (quiz.status !== "closed") {
            quiz.status = "closed";
            await quizRepository.update(quiz.id, quiz);
            return client.reply(message.from, "Questionário fechado!", message.id);
          }
          return client.reply(message.from, "Este questionário já está fechado.", message.id);
        } else {
          return client.reply(message.from, "Desculpe, apenas administradores podem usar este comando!", message.id);
        }
      });
    });
  }

  // !vote <nome-do-quiz>: <resposta-escolhida>
  async vote(client: Whatsapp, message: Message) {
    const votesRepository = getCustomRepository(VotesRepository);
    const quizRepository = getCustomRepository(QuizRepository);
    const bodyTrimmed = message.body.trim();
    const quizName: string = bodyTrimmed.match(/^([^,]+):/g)[0].toString().replace(/:/g, "").replace(/!vote/, "").trim();
    const userVote: string = message.body.replace(/^([^,]+):/g, "").trim();
    
    let quiz = await quizRepository.findOne({ name: quizName, group_id: message.chat.id });
    let userVoted = await votesRepository.findOne({ user_id: message.sender.id, quiz_id: quiz.id });

    if (!quiz) {
      return client.reply(message.from, `O questionário ${quizName} não existe!`, message.id);
    }
    
    if (quiz.status === "closed") {
      return client.reply(message.from, `O quiz ${quizName} já foi fechado e não é mais possível votar.`, message.id);
    }

    if (!quiz.answers.includes(userVote)) {
      return client.reply(message.from, `A resposta ${userVote} não existe neste questionário!`, message.id);
    }

    if (userVoted) {
      return client.reply(message.from, "Você pode votar apenas uma vez!", message.id);
    } 

    if (userVote.length < 1) {
      return client.reply(message.from, "Você deve digitar o !vote <nome do questionário>: <seguido do voto>", message.id);
    }

    const newVote = votesRepository.create({
      user_id: message.sender.id,
      quiz_id: quiz.id,
      value: userVote,
      quiz
    })

    votesRepository.save(newVote);
    return client.reply(message.from, "Voto registrado com sucesso!", message.id);
  }
  
  // !listQuiz
  async listQuiz(client: Whatsapp, message: Message) {
    const repository = getCustomRepository(QuizRepository);
    const group_id = message.chat.id;
    const allQuiz = await repository.find({ group_id });

    if(allQuiz.length > 0) {
      const names: string[] = allQuiz.map((quiz, index, arr) => {
        return index === arr.length - 1 ? quiz.name : quiz.name.concat("\n");
      })
      const Strnames = names.toString().replace(/,/g, "");
      return client.reply(message.from, "Questionários deste grupo:\n".concat(Strnames), message.id);
    }

    return client.reply(message.from, "Não existe nenhum questionário criado", message.id);
  }

  // !showQuiz <nome-do-quiz>
  async showQuiz(client: Whatsapp, message: Message) {
    const bodyTrimmed = message.body.trim();
    const name = bodyTrimmed.substring(10, bodyTrimmed.length);
    const quizRepository = getCustomRepository(QuizRepository);
    const votesRepository = getCustomRepository(VotesRepository);
    const quiz = await quizRepository.findOne({name, group_id: message.chat.id});

    if (quiz) {
      const answers = quiz.answers.split(",");
      const allVotes = await votesRepository.find({quiz_id: quiz.id});
      const answerVotes = [];

      answers.forEach(answer => {
        let counter = 0;
        allVotes.forEach(vote => {
          if (vote.value.trim() === answer.trim()) {
            counter += 1;
          };
        });
        answerVotes.push(answer.trim() + " " + counter);
      });

      const formattedQuiz: string = `Nome: ${quiz.name} \nStatus: ${quiz.status} \nCriado em: ${quiz.created_at} \nRespostas:\n${answerVotes.join("\n")}`
      return client.reply(message.from, formattedQuiz, message.id);
    } else {
      return client.reply(message.from, `Não existe um questionário com o nome ${name}`, message.id);
    }
  }
}

export default new QuizService();