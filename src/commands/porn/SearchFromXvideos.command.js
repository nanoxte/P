
import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, EmbedBuilder } from "discord.js";
import { stringParaNumeroVisualizacoes } from "../../utils/PornModelExecute.js";
import Command from "../../structures/Command.js";
import { fetchVideosFromXvideox, getVideoInformationFromXvideox } from "../../utils/XvideosModelExecute.js";

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
        const views =  String(videoInformation.views).match(/\d{1,3}\.\d+k Views/)
        const embed = new EmbedBuilder()
            .setTitle(String(video.title).slice(0, 80))
            .setImage(videoInformation.image)
            .setDescription(`**Id:** ${video.id}\n**Views:** ${Number(stringParaNumeroVisualizacoes(views)).toLocaleString('en-US')}\\n**Quality:** ${video.quality}\n`)
            .setColor('#ff0000')

          
        const btn = new ButtonBuilder()
            .setLabel('View')
            .setStyle('Link')
            .setURL(String(video.url).replace('xvideos3', 'xvideos'))

        const row = new ActionRowBuilder().addComponents(btn)

        await interaction.editReply({ embeds: [embed], components: [row]})
    }
}