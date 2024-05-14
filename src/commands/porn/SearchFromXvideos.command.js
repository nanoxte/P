
import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, EmbedBuilder } from "discord.js";
import { fetchModel } from "../../utils/PornModelExecute.js";
import Command from "../../structures/Command.js";
import { fetchVideosFromXvideox, getVideoInformationFromXvideox } from "../../utils/XvideosModelExecute.js";
import { maxResolution } from "../../utils/ImageOptimizer.js";

export default class extends Command {
    constructor(client) {
        super(client, {
            name: 'xvideos',
            description: "Search for videos on xvideos.com",
            nsfw: true,
            integrationTypes: [0, 1],
            contexts: [0, 1, 2],
            options: [
                {
                    type: 3,
                    name: "video",
                    description: "Enter your param",
                    required: true
                }
            ],
            ephemeral: false,
        })
    }

    run = async (interaction) => {
        console.log('Test')
        await interaction.deferReply()
        const param = interaction.options.getString('video')
        const video = await fetchVideosFromXvideox(param).catch(() => {})
        if(!video) return interaction.editReply({ content: "Unable to load page."})
        const videoInformation = await getVideoInformationFromXvideox(video.path).catch(() => {})

        const embed = new EmbedBuilder()
            .setTitle(String(video.title).slice(0, 80))
            .setImage(videoInformation.image)
            .setDescription(`**Duration:** ${video.quality}\n**Id:** ${video.id}`)
            .setColor('#ff0000')

          
        const btn = new ButtonBuilder()
            .setLabel('View')
            .setStyle('Link')
            .setURL(video.url)

        const row = new ActionRowBuilder().addComponents(btn)

        await interaction.editReply({ embeds: [embed], components: [row]})
    }
}