const { 
    ContextMenuCommandBuilder, 
    ApplicationCommandType, 
    EmbedBuilder, 
    ActionRowBuilder,
    ButtonBuilder
    } = require('discord.js')
const { QuickDB } = require(`quick.db`)
const db = new QuickDB().table(`logs`)

const count = {}
const repstomute = 1

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('report')
        .setType(ApplicationCommandType.Message),
    async execute(interaction) {
        let message = await interaction.channel.messages.fetch(interaction.targetId)
        if(message.author.bot) return await interaction.reply({ content: `Не можна кидати скаргу на ботів!`, ephemeral: true })
        if(message.author.id === interaction.user.id) return await interaction.reply({ content: `Не можна кидати скаргу на себе!`, ephemeral: true })

        if(!count[message.author.id]){
            count[message.author.id] = {
                members: [interaction.user.id]
            }
            setTimeout(() => { delete count[message.author.id] }, 60000)
        }else{
            //if(count[message.author.id].members.includes(interaction.user.id)) return await interaction.reply({ content: `Ви вже кинули скаргу на цього учасника!`, ephemeral: true })
            count[message.author.id].members.push(interaction.user.id)

            let dbc = await db.get(`${interaction.guild.id}.channel`)
            let log = await interaction.guild.channels.cache.get(dbc)
            if(log){
                const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`mute_${message.author.id}`)
                        .setLabel('Заблокувати чат (5 хв)')
                        .setStyle(`Danger`),
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`kick_${message.author.id}`)
                        .setLabel('Вигнати')
                        .setStyle(`Danger`),
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`ban_${message.author.id}`)
                        .setLabel('Заблокувати (Очистити повідомлення)')
                        .setStyle(`Danger`),
                );
                let embed = new EmbedBuilder()
                .setAuthor({ name: `Нова скарга! (${count[message.author.id].members.length}/${repstomute})`, url: require(`../functions/memes.js`)(1) })
                .addFields({ name: `Учасник`, value: `${message.author}` })
    
                if((count[message.author.id].members.length / repstomute * 100) > 99){
                    embed
                    .setColor(`Red`)
                    .setDescription("Контекст повідомлення\n```" + message.content + "```")
                    .setFooter({ text: `Ми видалили повідомлення та заблокували чат на 60 секунд` })
                    message.delete()
                    message.member.timeout(60 * 1000, `Велика кількість скарг на хвилину (${count[message.author.id].members.length})`)
                    message.member.send(`Ми тимчасово заблокували тобі можливість писати та розмовляти в чаті через велику кількість скарг. Блокування пройде через 60 секунд`)
                    .catch(O_o=>{})
    
                    log.send({ embeds: [embed], components: [row] })
                }else if((count[message.author.id].members.length / repstomute * 100) > 50){
                    embed
                    .setTitle(`ПЕРЕЙТИ ДО ПОВІДОМЛЕННЯ`)
                    .setURL(message.url)
                    .setColor(`Orange`)
                    .setDescription("Контекст повідомлення\n```" + message.content + "```")
                    .setFooter({ text: 'Ми не вжили ніяких заходів, поки-що..' })
    
                    log.send({ embeds: [embed], components: [row] })
                }else{
                    embed
                    .setTitle(`ПЕРЕЙТИ ДО ПОВІДОМЛЕННЯ`)
                    .setURL(message.url)
                    .setColor(`Aqua`)
                    .setDescription("Контекст повідомлення\n```" + message.content + "```")
                    .setFooter({ text: 'Ми не вжили ніяких заходів, поки-що..' })
    
                    log.send({ embeds: [embed], components: [row] })
                }
            }else{
                if((count[message.author.id].members.length / repstomute * 100) === 100){
                    message.delete()
                    message.member.timeout(60 * 1000, `Велика кількість скарг на хвилину (${count[message.author.id].members.length})`)
                    message.member.send(`Ми тимчасово заблокували тобі можливість писати та розмовляти в чаті через велику кількість скарг. Блокування пройде через 60 секунд`)
                    .catch(O_o=>{})
                }
            }
            }



        await interaction.reply({ content: `Скарга була відправлена!`, ephemeral: true })
    }
}