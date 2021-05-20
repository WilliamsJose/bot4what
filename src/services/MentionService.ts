import { Message, Whatsapp } from "venom-bot";

class MentionService {
  async mention(client: Whatsapp, message: Message) {
    client.getGroupAdmins(message.chatId).then((admins) => {
      client.getContact(message.sender.id).then((participante) => {
        //@ts-ignore
        if (admins.some((admin) => admin.user === participante.id.user)) {
          client.getGroupMembers(message.chatId).then((members) => {
            let contacts: Array<string> = [];
            let stringContacts: string = "";

            members.forEach((c) => {
              if (!c.isMe && c.id.user !== participante.id.user) {
                contacts.push(c.id.user);
                stringContacts += "@" + c.id.user + " ";
              }
            });

            client
              .sendMentioned(message.from, "Yay! " + stringContacts, contacts)
              .then((result) => {
                console.log("result: " + typeof result);
                console.log("Result: ", result);
              })
              .catch((erro) => {
                console.log(
                  "\n -------------------------------------------------erro: " +
                    typeof erro
                );
                console.error("Error when sending: ", erro);
              });
          });
        } else {
          client.reply(message.from, "Desculpe, apenas administradores podem usar este comando!", message.id);
        }
      });
    });
  }
}

export default new MentionService();
