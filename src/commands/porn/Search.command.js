
import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, EmbedBuilder } from "discord.js";
import { fetchModel } from "../../utils/PornModelExecute.js";
import Command from "../../structures/Command.js";

export default class extends Command {
    constructor(client) {
        super(client, {
            name: 'pornhub',
            description: "Search for models on pornhub.com",
            nsfw: true,
            integrationTypes: [0, 1],
            contexts: [0, 1, 2],
            options: [
                {
                    type: 3,
                    name: "model",
                    description: "Enter the name of the model you want to search for",
                    required: true
                }
            ],
            ephemeral: false,
        })
    }

    run = async (interaction) => {
        await interaction.deferReply()
        const modelName = interaction.options.getString('model')
        const model = await fetchModel(modelName).catch(() => {})
        if(!model) return interaction.editReply({ content: "Unable to find model, please try again later"})

        const image = new AttachmentBuilder(model.sample, { name: 'image.png'})

        // Result https://discord.gg/WFGTm855He
        //console.log(model)
        /* Embed Init */
        const embed = new EmbedBuilder()
            .setImage('attachment://image.png')
            .setColor('#ffa31a')
            .setThumbnail(model.avatar)
            .setDescription(`**Name:** ${model.name}\n **Page:** ${model.url}\n **Total Videos:** ${Number(model.videosCount).toLocaleString('en-US')}\n**Total Views:** ${Number(model.viewsCount).toLocaleString('en-US')}`)
        const botoes = [];
    
        if(model.videos.length < 1) return interaction.editReply({ content: 'I couldn\'t find any videos of this model'})
    // Iterar sobre o array de objetos
        model.videos.forEach((objeto, index) => {
        // Criar um botão para cada objeto
        if(index < 4) {
            const botao = new ButtonBuilder()
            .setStyle('Link') // Definir estilo do botão como link
            .setLabel(objeto.title.slice(0, 10) + '...')
            .setURL(objeto.href)
            botoes.push(botao); // Adicionar o botão ao array de botões
        }
    });
        
    const row = new ActionRowBuilder().addComponents(botoes)
    const msg = await interaction.editReply({ embeds: [embed],files: [image], components: botoes.length > 0 ? [row] : [], fetchReply: true })

    }
}