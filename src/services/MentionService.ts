import { Contact, Message, Whatsapp } from "venom-bot";

class MentionService {
  mention(client: Whatsapp, message: Message) {
    client.getGroupAdmins(message.chatId).then((admins) => {
      client.getContact(message.sender.id).then((participante) => {
        if (admins.some(admin => admin.user === participante.id.user)) {
          client.getGroupMembers(message.chatId).then((contact) => {
            let contacts: Array<string> = [];
            let stringContacts: string = "";

            contact.forEach((c) => {
              if (!c.isMe) {
                contacts.push(c.id.user);
                stringContacts += "@" + c.id.user + " ";
              }
            });

            client
              .sendMentioned(message.from, "Yay! " + stringContacts, contacts)
              .then((result) => {
                console.log("result: " + typeof result);
                console.log("Result: ", result); //return object success
              })
              .catch((erro) => {
                console.log(
                  "\n -------------------------------------------------erro: " +
                    typeof erro
                );
                console.error("Error when sending: ", erro); //return object error
              });
          });
        } else {
          client.reply(
            message.from,
            "Desculpe, apenas administradores podem usar este comando!",
            message.id
          );
        }
      });
    });
  }
}

export default new MentionService();
