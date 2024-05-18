
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from "discord.js";

import Command from "../../structures/Command.js";

export default class extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            description: "Learn more about my commands",
            nsfw: false,
            ephemeral: false,
        })
    }

    run = async (interaction) => {
        await interaction.deferReply()
        const embed = new EmbedBuilder()
            .setTitle('How to use my commands?')
            .setDescription(`Hello, here's a mini tutorial on how to use my commands! I only have 2 commands which are </pornhub:1239656688865247253> which is used to search for videos of models from [Porn Hub](https://pornhub.com/) and the command </random:1239711621719527465> which when used it returns a random video from the website [Porn Hub](https://pornhub.com/)\n\n**Additional**\n\n</random-xvideos:1240057615715926036> - receive a random video from xvideos.com\n</xvideos:1240072647086309456> - search for videos on xvideos.com`) //Onlyfans
            .setImage('https://di.phncdn.com/videos/202002/07/282615582/original/(m=eaAaGwObaaaa)(mh=-0g5xaCaQILuCmvo)1.jpg')
            .setColor('#ffa31a')

        const btn = new ButtonBuilder().setLabel('Source Code').setStyle('Link').setURL('https://github.com/tysaiwofc/pornhub-bot')
        const row = new ActionRowBuilder().addComponents(btn)
        interaction.editReply({ embeds: [embed], components: [row]})
            
    }
}