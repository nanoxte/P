
import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, EmbedBuilder } from "discord.js";
import { fetchModel } from "../../utils/PornModelExecute.js";
import Command from "../../structures/Command.js";

export default class extends Command {
    constructor(client) {
        super(client, {
            name: 'pornhub',
            description: "Search for models on pornhub.com",
            nsfw: true,
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
            .setStyle('Primary') // Definir estilo do botão como link
            .setLabel(objeto.title.slice(0, 10) + '...')
            .setCustomId(`videos${index}`)
            botoes.push(botao); // Adicionar o botão ao array de botões
        }
    });
        
    const row = new ActionRowBuilder().addComponents(botoes)
    const msg = await interaction.editReply({ embeds: [embed],files: [image], components: botoes.length > 0 ? [row] : [], fetchReply: true })
    const col = msg.createMessageComponentCollector({ filter: i => i, time: 200000})
    col.on('collect', async i => {
        const party = interaction.client.partys.get(interaction.user.id)
        if(party && party.users.includes(i.user.id)) return i.reply({ content: "You are already participating in this party", ephemeral: true})
        if(i.customId.includes('join') && i.user.id === interaction.user.id) return i.reply({ content: 'You cannot rejoin your own party', ephemeral: true})
        if(!i.customId.includes('join') && i.user.id !== interaction.user.id) return i.reply({ content: "This button is not for you, try using the same command.", ephemeral: true})
        const option = i.customId.slice(i.customId.length - 1)

        const btnc = new ButtonBuilder().setStyle('Primary').setLabel('Join the Party').setCustomId('join' + option)
        const rown = new ActionRowBuilder().addComponents(btnc)

        i.update({ components: [rown]})
        const exist = interaction.channel.threads.cache.find(x => x.name === `${model.videos[option].title}`)
        if(exist) {
            exist.send(`${i.user} joined.`)
            if(party) {
                party.users = [...party.users, i.user.id]
            }
        } else {
            if(!party) {
                interaction.client.partys.set(interaction.user.id, { users: [interaction.user.id]})
            }

            const thread = await interaction.channel.threads.create({
                name: `${model.videos[option].title}`,
                reason: 'Search PornHub Videos'
            })

            const embed2 = new EmbedBuilder().setTitle(String(model.videos[option].title).slice(0, 100)).setColor('#ffa31a')
            .setDescription(`**__Views:__** ${Number(model.videos[option].views).toLocaleString('en-US')}`)
            .setImage(model.videos[option].src)

            const btn2 = new ButtonBuilder().setStyle('Link').setLabel('View Page').setURL(model.videos[option].href)
            const row2 = new ActionRowBuilder().addComponents(btn2)
            thread.send({
                content: `${interaction.user}`,
                embeds: [embed2],
                components: [row2]
            })
        }
    })
    }
}