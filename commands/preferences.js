const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { QuickDB } = require(`quick.db`)
let memes = require(`../functions/memes.js`)
const db = new QuickDB()
const exist = require('../functions/multValue.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('preferences')
        .setDescription('Змінює налаштування бота щодо сервера.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand => 
            subcommand
            .setName("vclobby")
            .setDescription(`Встановити канал для автоматичного створення приватних голосових каналів. (Не вказано - видалити.)`)
            .addChannelOption(option => option.setName(`lobby`).setDescription(`Голосовий канал`))  
        )
        .addSubcommandGroup(group => 
            group
            .setName(`log`)
            .setDescription(`Відправка ботом повідомлень про події в спеціалізований канал`)
            .addSubcommand(subcommand => 
                subcommand
                .setName(`channel`)
                .setDescription(`Встановити спеціалізований канал для сповіщень`)    
                .addChannelOption(option => option.setName(`channel`).setDescription(`Текстовий канал`).setRequired(true))
            )
            .addSubcommand(subcommand => 
                subcommand
                .setName(`switch`)
                .setDescription(`Перемикачі типів подій`)    
            )
            )
        .addSubcommandGroup(group => 
            group
            .setName(`counter`)
            .setDescription(`Лічильник учасників`)
            .addSubcommand(subcommand => 
                subcommand
                .setName(`set`)
                .setDescription(`Встановити лічильник`)    
                .addChannelOption(option => option.setName(`channel`).setDescription(`Голосовий канал / Категорія`).setRequired(true))
                .addStringOption(option => option.setName(`name`).setDescription(`Назва лічильнику (Опціонально)`))
            )
            .addSubcommand(subcommand => 
                subcommand
                .setName(`remove`)
                .setDescription(`Видалити лічильник`)    
            )
        ),
    async execute(interaction) {
        if(!interaction.options.getSubcommandGroup()){
            if(interaction.options.getSubcommand() === `vclobby`){
                let lobbies = db.table("lobbies")
                let channel = interaction.options.getChannel("lobby")
                if(!channel){
                    await lobbies.delete(interaction.guild.id)
                    let embed = new EmbedBuilder()
                    .setAuthor({ name: `Лоббі видалено!`, url: require(`../functions/memes.js`)(1) })
                    .setColor('Orange')
                    .setDescription(`Учасники більше не зможуть створити нові приватні голосові канали.`)
                    .setFooter({ text: 'Добавити: /preferences vclobby [lobby]' })
                    return await interaction.reply({embeds: [embed], ephemeral: true})
                }else{
                    if(channel.type !== 2) return await interaction.reply({ embeds: [{ author: { name: 'Лоббі можна встановити тільки в якості голосового каналу.' }, color: 0xcc2929 }], ephemeral: true })

                    await lobbies.set(interaction.guild.id, channel.id)
                    let embed = new EmbedBuilder()
                    .setAuthor({ name: `Лоббі добавлено/змінено!`, url: require(`../functions/memes.js`)(1) })
                    .setColor('Green')
                    .setDescription('Тепер учасники можуть створювати приватні голосові канали, заходячи в канал або прописуючи відповідну команду.')
                    .setFooter({ text: `Канал: ${channel.name}` })
                    return await interaction.reply({embeds: [embed], ephemeral: true})
                }
            }
        }

        if(interaction.options.getSubcommandGroup() === `counter`){
            const counters = db.table("counters")

            if(interaction.options.getSubcommand() === `remove`){
                let channel = await interaction.guild.channels.fetch(await counters.get(interaction.guild.id)).name
                await counters.delete(interaction.guild.id)
                let embed = new EmbedBuilder()
                .setColor(`Orange`)
                .setAuthor({ name: `Лічильник видалено.`, url: memes(1) })
                .setFooter({ text: `Ви можете встановити його в будь який момент!` })
                await interaction.reply({ embeds: [embed], ephemeral: true })
            }else{
                let channel = interaction.options.getChannel('channel');
                if(![2,4].includes(channel.type)) return await interaction.reply(`Лічильник можна встановити тільки на голосовий канал або категорію`)
                if(await counters.get(interaction.guild.id)) await counters.delete(interaction.guild.id)
                await counters.set(`${interaction.guild.id}`, { id: channel.id, name: interaction.options.getString(`name`) || `Учасники: ON/ALL` })

                let embed = new EmbedBuilder()
                .setColor(`Green`)
                .setAuthor({ name: `Лічильник встановлено!`, url: memes(1) })
                .addFields(
                    {
                        name: `Канал`,
                        value: `${channel}`
                    },
                    {
                        name: `Назва`,
                        value: `\`${interaction.options.getString(`name`) || `Учасники: ON/ALL`}\``
                    }
                )
                .setFooter({ text: `Лічильник оновлюється кожні 5 хвилин (Обмеження API)` })
                await interaction.reply({ embeds: [embed], ephemeral: true })
            }
        }
        
        if(interaction.options.getSubcommandGroup() === `log`){
            const logs = db.table(`logs`);
            if(interaction.options.getSubcommand() === `channel`){
                let channel = interaction.options.getChannel('channel');
                await logs.set(interaction.guild.id + `.channel`, channel.id)
                let embed = new EmbedBuilder()
                .setColor(`Green`)
                .setAuthor({ name: `Канал встановлено!`, url: memes(1) })
                .setDescription(`**${channel}** був встановлений як канал для сповіщень про події!`)
                await interaction.reply({ embeds: [embed], ephemeral: true })
            }
            if(interaction.options.getSubcommand() === 'switch'){

                const types = {
                    'sw_bans': ['banAdd', 'banRemove'],
                    'sw_msgs': ['msgEdit', 'msgDelete'],
                    'sw_members': ['memAdd', 'memRemove', 'memUpdate']
                }
                
                const sws = await logs.get(`${interaction.guild.id}.types`)

                const msg = new ButtonBuilder()
                .setCustomId('sw_msgs')
                .setLabel('Повідомлення видалено/змінено')
                if(exist(sws, types['sw_msgs'])) msg.setStyle(ButtonStyle.Success)
                else msg.setStyle(ButtonStyle.Danger)

                const ban = new ButtonBuilder()
                .setCustomId('sw_bans')
                .setLabel('Блокування/Розблукування')
                if(exist(sws, types['sw_bans'])) ban.setStyle(ButtonStyle.Success)
                else ban.setStyle(ButtonStyle.Danger)

                const mem = new ButtonBuilder()
                .setCustomId('sw_members')
                .setLabel('Зміна учасника (Нікнейм/Роль)')
                if(exist(sws, types['sw_members'])) mem.setStyle(ButtonStyle.Success)
                else mem.setStyle(ButtonStyle.Danger)

                const row = new ActionRowBuilder().addComponents([msg, ban, mem])
                const log = await logs.get(`${interaction.guild.id}.channel`)
                
                const embed = new EmbedBuilder()
                .setAuthor({ name: `Перемикачі типів подій!`, iconURL: interaction.guild.iconURL() })
                .setDescription(`Зелений колір кнопки [🟩] - подія **увімкнена**.\nЧервоний колір кнопки [🟥] - подія **вимкнена**.\n`)
                .addFields([
                    { name: `Канал для подій`, value: `${interaction.guild.channels.cache.get(log) || `Встановіть його через **/preferences logs channel**`}` }
                ])
                .setFooter({ text: `Натискання на кнопку увімкне або вимкне тип події` })
                .setColor(`White`)
                await interaction.reply({ embeds: [embed], components: [row], ephemeral: true })
            }
        }
    }
}