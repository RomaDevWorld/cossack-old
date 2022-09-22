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
        .setName('Поскаржитись')
        .setType(ApplicationCommandType.Message),
    async execute(interaction) {
        let message = await interaction.channel.messages.fetch(interaction.targetId)
        if(message.author.bot) return await interaction.reply({ embeds: [{ author: { name: 'Не можна скаржитись на ботів!' }, color: 0xcc2929 }], ephemeral: true })
        if(message.author.id === interaction.user.id) return await interaction.reply({ embeds: [{ author: { name: 'Не можна скаржитись на себе!' }, color: 0xcc2929 }], ephemeral: true })

        if(!count[message.author.id]){
            count[message.author.id] = {
                members: [interaction.user.id]
            }
            setTimeout(() => { delete count[message.author.id] }, 60000)
        }else{
            if(count[message.author.id].members.includes(interaction.user.id)) return await interaction.reply({ embeds: [{ author: { name: 'Ви вже поскаржились на цього учасника!' }, color: 0xcc2929 }], ephemeral: true })
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
    
                if((count[message.author.id].members.length / repstomute * 100) === 100){
                    embed
                    .setColor(`Red`)
                    .setDescription("Контекст повідомлення\n```" + message.content + "```")
                    .setFooter({ text: `Ми видалили повідомлення та заблокували чат на 60 секунд` })
                    message.delete()
                    message.member.timeout(60 * 1000, `Велика кількість скарг на хвилину (${count[message.author.id].members.length})`)
                    message.member.send({
                        "author": {
                            "name": "Чат заблоковано!"
                        },
                        "description": "Ми тимчасово заблокували тобі можливість писати та розмовляти в чаті через велику кількість скарг. ",
                        "footer": {
                            "text": "Блокування завершиться через 60 секунд"
                        },
                        "color": 15879747
                    })
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
                    message.member.send({
                        "author": {
                            "name": "Чат заблоковано!"
                        },
                        "description": "Ми тимчасово заблокували тобі можливість писати та розмовляти в чаті через велику кількість скарг. ",
                        "footer": {
                            "text": "Блокування завершиться через 60 секунд"
                        },
                        "color": 15879747
                    })
                    .catch(O_o=>{})
                }
            }
            }



        await interaction.reply({ embeds: [{ author: { name: 'Скарга успішно відправлена!' }, color: 0x33a64e }], ephemeral: true })
    }
}