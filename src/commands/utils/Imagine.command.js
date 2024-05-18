
import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder } from "discord.js";
import Command from "../../structures/Command.js";
import generateImage from "../../utils/generateModelExecute.js";

export default class extends Command {
    constructor(client) {
        super(client, {
            name: 'imagine',
            description: "make AI create pornographic images for you",
            nsfw: true,
            integrationTypes: [0, 1],
            contexts: [0, 1, 2],
            options: [
                {
                    type: 3,
                    name: "prompt",
                    description: "describe what you want your image to look like",
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
        const buffer = await generateImage(prompt, txt).catch((er) => { console.log(er)})
        if(!buffer) return interaction.editReply({ content: 'It looks like something went wrong when trying to generate this image, please try again later.'})
        const image = new AttachmentBuilder(buffer, { name: 'porn.png'})

        const btn = new ButtonBuilder()
            .setLabel('Generate by Private AI')
            .setCustomId('genrat')
            .setDisabled(true)
            .setStyle('Primary')
        
        const row = new ActionRowBuilder()
            .addComponents(btn)
        await interaction.editReply({ files: [image], components: [row] })

    }
}