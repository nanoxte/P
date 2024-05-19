
import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder } from "discord.js";
import Command from "../../structures/Command.js";
import { generate } from "../../utils/geminiModelExecute.js";

export default class extends Command {
    constructor(client) {
        super(client, {
            name: 'imagine',
            description: "Ask Gemini questions",
            nsfw: true,
            integrationTypes: [0, 1],
            contexts: [0, 1, 2],
            options: [
                {
                    type: 3,
                    name: "prompt",
                    description: "Type in a question and it will answer you",
                    required: true,
                    minLength: 5,
                    maxLength: 80
                }
            ],
            ephemeral: false,
        })
    }

    run = async (interaction) => {
        await interaction.deferReply()
        const prompt = interaction.options.getString('prompt')

        const txt = interaction?.guild?.name || interaction?.user?.username
        const buffer = await generate(prompt).catch(() => {})
        if(!buffer) return interaction.editReply({ content: 'It looks like something went wrong when trying to generate response, please try again later.'})
 
        const btn = new ButtonBuilder()
            .setLabel(txt)
            .setCustomId('genrat')
            .setDisabled(true)
            .setStyle('Primary')
        
        const row = new ActionRowBuilder()
            .addComponents(btn)
        await interaction.editReply({ content: `${buffer}`, components: [row] })

    }
}