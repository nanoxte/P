
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from "discord.js";
import { getRandomVideo } from "../../utils/PornModelExecute.js";
import Command from "../../structures/Command.js";
import { fetchFeetModel } from "../../utils/WikiFeetModelExecute.js";

export default class extends Command {
    constructor(client) {
        super(client, {
            name: 'feet',
            description: "search for celebrity feet",
            nsfw: true,
            integrationTypes: [0, 1],
            contexts: [0, 1, 2],
            ephemeral: false,
            options: [
                {
                    type: 3,
                    name: "celebrity",
                    description: "Enter the celebrity's name",
                    required: true
                }
            ],
        })
    }

    run = async (interaction) => {
        await interaction.deferReply()
        const model = interaction.options.getString('celebrity')
        const response = await fetchFeetModel(model).catch(() => {})
        if(!response) return interaction.editReply({ content: "Unable to find model, please try again later"})

        const embed = new EmbedBuilder()
            .setTitle(response.name?.slice(0, 80) + ` (${response.counter})`)
            .setDescription(`The website that the button redirects to is a website where people post photos of famous people's feet, the website is entirely powered by the community.`) //Onlyfans
            .setColor('#0577F8')

       const btn2 = new ButtonBuilder().setLabel('View').setURL(response.url).setStyle('Link')

        const row = new ActionRowBuilder().addComponents(btn2)
        interaction.editReply({ embeds: [embed], components: [row]})
            
    }
}