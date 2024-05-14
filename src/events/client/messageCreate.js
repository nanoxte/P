import Command from "../../structures/Command.js";

export default class extends Command {
    constructor(client) {
        super(client, {
            name: 'messageCreate',
        })
    }

    run = async (message) => {

        if(message.content === `<@${message.client.user.id}>` || message.content === `<@!${message.client.user.id}>`) {
            message.reply({ content: `Hello, here's a mini tutorial on how to use my commands! I only have 2 commands which are </pornhub:1239656688865247253> which is used to search for videos of models from [Porn Hub](https://pornhub.com/) and the command </random:1239711621719527465> which when used it returns a random video from the website [Porn Hub](https://pornhub.com/)`}).then(msg => {
                setTimeout(() => {
                    msg?.delete().catch(() => {})
                }, 5000)
            })
        }
        
    }
}