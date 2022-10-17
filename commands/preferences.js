const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require('discord.js')
const { QuickDB } = require(`quick.db`)
let memes = require(`../functions/memes.js`)
const db = new QuickDB()
const exist = require('../functions/multValue.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('prefs')
        .setDescription('Змінює налаштування бота щодо сервера.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand => 
            subcommand
            .setName("vclobby")
            .setDescription(`Встановити канал для автоматичного створення приватних голосових каналів. (Не вказано - видалити.)`)
            .addChannelOption(option => option.setName(`lobby`).setDescription(`Голосовий канал`).addChannelTypes(ChannelType.GuildVoice))  
        )
        .addSubcommand(subcommand => 
            subcommand
            .setName("colors")
            .setDescription(`Префікс для створення "Ролей кольору"`)
            .addStringOption(option => option.setName(`prefix`).setDescription(`Префікс (Макс 3 символи, якщо не вказано - видалити)`))
            .addIntegerOption(option => option.setName('max').setDescription('Максимальна кількість ролей в одного участника'))
        )
        .addSubcommandGroup(group => 
            group
            .setName(`log`)
            .setDescription(`Відправка ботом повідомлень про події в спеціалізований канал`)
            .addSubcommand(subcommand => 
                subcommand
                .setName(`channel`)
                .setDescription(`Встановити спеціалізований канал для сповіщень`)    
                .addChannelOption(option => option.setName(`channel`).setDescription(`Текстовий канал`).setRequired(true).addChannelTypes(ChannelType.GuildText))
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
            .setDescription(`Лічильник участників`)
            .addSubcommand(subcommand => 
                subcommand
                .setName(`set`)
                .setDescription(`Встановити лічильник`)    
                .addChannelOption(option => option.setName(`channel`).setDescription(`Голосовий канал / Категорія`).setRequired(true).addChannelTypes(ChannelType.GuildCategory, ChannelType.GuildVoice))
                .addStringOption(option => option.setName(`name`).setDescription(`Назва лічильнику (Опціонально)`))
            )
            .addSubcommand(subcommand => 
                subcommand
                .setName(`remove`)
                .setDescription(`Видалити лічильник`)    
            )
        ),
    async execute(interaction) {
        if(!interaction.options.getSubcommandGroup()){ //If interaction has no command group
            if(interaction.options.getSubcommand() === `vclobby`){ //If subcommand's name is 'vclobby'
                let lobbies = db.table("lobbies") //Require a table called 'lobbies' from the db
                let channel = interaction.options.getChannel("lobby") //Get channel from interaction
                if(!channel){ //If channel was not specified
                    await lobbies.delete(interaction.guild.id) //Delete lobby channel from db
                    let embed = new EmbedBuilder()
                    .setAuthor({ name: `Лоббі видалено!`, url: require(`../functions/memes.js`)(1) })
                    .setColor('Orange')
                    .setDescription(`Участники більше не зможуть створити нові приватні голосові канали.`)
                    .setFooter({ text: 'Добавити: /prefs vclobby [lobby]' })
                    return await interaction.reply({embeds: [embed], ephemeral: true}) //Create an embed and send it 
                }else{

                    await lobbies.set(interaction.guild.id, channel.id) //Set lobby channel to the db
                    let embed = new EmbedBuilder()
                    .setAuthor({ name: `Лоббі добавлено/змінено!`, url: require(`../functions/memes.js`)(1) })
                    .setColor('Green')
                    .setDescription('Тепер участники можуть створювати приватні голосові канали, заходячи в канал або прописуючи відповідну команду.')
                    .setFooter({ text: `Канал: ${channel.name}` })
                    return await interaction.reply({embeds: [embed], ephemeral: true}) //Create an embed and send it 
                }
            }
            if(interaction.options.getSubcommand() === `colors`){
                let misc = db.table("misc")
                let prefix = interaction.options.getString('prefix')
                var text = ``

                if(!prefix){
                    await misc.delete(`${interaction.guild.id}.prefix`)
                    text += 'Префікс ролей видалено.'
                }else{
                    if(prefix.length > 3) prefix = prefix.slice(0, 3)
                    await misc.set(`${interaction.guild.id}.prefix`, prefix)
                    text += `Префікс ролей \`${prefix}\``
                }

                let max = interaction.options.getInteger('max')
                if(max){
                    if(max > 25) max = 25
                    if(max < 1) max = 1
                    await misc.set(`${interaction.guild.id}.maximum`, max)
                    text += `\nМаксимальна кількість ролей: ${max}`
                }

                let embed = new EmbedBuilder()
                .setAuthor({ name: 'Налаштування оновлено!', url: memes(1) })
                .setDescription(text)
                .setColor('Green')
                .setFooter({ text: 'Створіть ролі, назва яких починається з встановленого префіксу' })
                await interaction.reply({ embeds: [embed], ephemeral: true })
            }
        }

        if(interaction.options.getSubcommandGroup() === `counter`){ //If subcommand group's name is 'counter'
            const counters = db.table("counters") //Require a table called 'counters' from db

            if(interaction.options.getSubcommand() === `remove`){ //If subcommand's name is 'remove'
                await counters.delete(interaction.guild.id) //Removes the value from the db
                let embed = new EmbedBuilder()
                .setColor(`Orange`)
                .setAuthor({ name: `Лічильник видалено.`, url: memes(1) })
                .setFooter({ text: `Ви можете встановити його в будь який момент!` })
                await interaction.reply({ embeds: [embed], ephemeral: true })  //Create an embed and send it
            }else{
                let channel = interaction.options.getChannel('channel'); //Gets a channel from interaction
                await counters.set(`${interaction.guild.id}`, { id: channel.id, name: interaction.options.getString(`name`) || `Участники: ON/ALL` }) //Sets a value at the db

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
                        value: `\`${interaction.options.getString(`name`) || `Участники: ON/ALL`}\``
                    }
                )
                .setFooter({ text: `Лічильник оновлюється кожні 5 хвилин (Обмеження API)` })
                await interaction.reply({ embeds: [embed], ephemeral: true }) //Creates an embed and sends it
            }
        }
        
        if(interaction.options.getSubcommandGroup() === `log`){ //if command group's name is 'log'
            const logs = db.table(`logs`); //Requires a table from db called 'logs'
            if(interaction.options.getSubcommand() === `channel`){ //If subcommand name is 'channel'
                let channel = interaction.options.getChannel('channel'); //Gets channel from interaction
                await logs.set(interaction.guild.id + `.channel`, channel.id) //Sets a value
                let embed = new EmbedBuilder()
                .setColor(`Green`)
                .setAuthor({ name: `Канал встановлено!`, url: memes(1) })
                .setDescription(`**${channel}** був встановлений як канал для сповіщень про події!`)
                await interaction.reply({ embeds: [embed], ephemeral: true }) //Creates an embed then sends it
            }
            if(interaction.options.getSubcommand() === 'switch'){ //If subcommand name is 'swithc'

                const types = {
                    'sw_bans': ['banAdd', 'banRemove'],
                    'sw_msgs': ['msgUpdate', 'msgDelete'],
                    'sw_members': ['memAdd', 'memRemove', 'memUpdate'],
                    'sw_voices': ['voiceL', 'voiceJ', 'voiceM']
                } //Types handler
                
                let sws = await logs.get(`${interaction.guild.id}.types`) //It's easier 
                if(!sws) sws = []

                const msg = new ButtonBuilder() //First button
                .setCustomId('sw_msgs')
                .setLabel('Повідомлення видалено/змінено')
                if(exist(sws, types['sw_msgs'])) msg.setStyle(ButtonStyle.Success) //Defines if type is on or off, sets a 'Success' style if on
                else msg.setStyle(ButtonStyle.Danger) //Sets a 'Danger' style if off

                const ban = new ButtonBuilder()
                .setCustomId('sw_bans')
                .setLabel('Блокування/Розблукування')
                if(exist(sws, types['sw_bans'])) ban.setStyle(ButtonStyle.Success) //Defines if type is on or off, sets a 'Success' style if on
                else ban.setStyle(ButtonStyle.Danger) //Sets a 'Danger' style if off

                const mem = new ButtonBuilder()
                .setCustomId('sw_members')
                .setLabel('Зміна участника (Нікнейм/Роль)')
                if(exist(sws, types['sw_members'])) mem.setStyle(ButtonStyle.Success) //Does the same thing
                else mem.setStyle(ButtonStyle.Danger)

                const voi = new ButtonBuilder()
                .setCustomId('sw_voices')
                .setLabel('Голосові (Зайшов/Вийшов/Змінив)')
                if(exist(sws, types['sw_voices'])) voi.setStyle(ButtonStyle.Success) //Does the same thing
                else voi.setStyle(ButtonStyle.Danger)

                const row = new ActionRowBuilder().addComponents([msg, ban, mem, voi]) //Creates an action row with all the buttons
                const log = await logs.get(`${interaction.guild.id}.channel`) //Gets a logs channel id from db
                
                const embed = new EmbedBuilder()
                .setAuthor({ name: `Перемикачі типів подій!`, iconURL: interaction.guild.iconURL() })
                .setDescription(`Зелений колір кнопки [🟩] - подія **увімкнена**.\nЧервоний колір кнопки [🟥] - подія **вимкнена**.\n`)
                .addFields([
                    { name: `Канал для подій`, value: `${interaction.guild.channels.cache.get(log) || `Встановіть його через **/prefs logs channel**`}` } //Adds a field if channel was found, if not - hint how to set it
                ])
                .setFooter({ text: `Натискання на кнопку увімкне або вимкне тип події` })
                .setColor(`White`)
                await interaction.reply({ embeds: [embed], components: [row], ephemeral: true }) //Sends an embed with all the buttons
            }
        }

    }
}