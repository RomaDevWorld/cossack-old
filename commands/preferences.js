const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js')
const { QuickDB } = require(`quick.db`)
let memes = require(`../functions/memes.js`)
const db = new QuickDB()

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
                    .setColor('Green')
                    .setDescription(`Учасники більше не зможуть створити нові приватні голосові канали.`)
                    .setFooter({ text: 'Добавити: /preferences vclobby [lobby]' })
                    return await interaction.reply({embeds: [embed]})
                }else{
                    if(channel.type !== 2) return await interaction.reply({ embeds: [{ author: { name: 'Лоббі можна встановити тільки в якості голосового каналу.' }, color: 0xcc2929 }], ephemeral: true })

                    await lobbies.set(interaction.guild.id, channel.id)
                    let embed = new EmbedBuilder()
                    .setAuthor({ name: `Лоббі добавлено/змінено!`, url: require(`../functions/memes.js`)(1) })
                    .setColor('Green')
                    .setDescription('Тепер учасники можуть створювати приватні голосові канали, заходячи в канал або прописуючи відповідну команду.')
                    .setFooter({ text: `Канал: ${channel.name}` })
                    return await interaction.reply({embeds: [embed]})
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
                await interaction.reply({ embeds: [embed] })
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
                await interaction.reply({ embeds: [embed] })
            }
        } else if(interaction.options.getSubcommandGroup() === `log`){
            if(interaction.options.getSubcommand() === `channel`){
                const logs = db.table(`logs`);
                let channel = interaction.options.getChannel('channel');
                await logs.set(interaction.guild.id + `.channel`, channel.id)
                await interaction.reply(`${channel} був встановлений як "Канал для сповіщень про події"`, { ephemeral: true })
            }
        }
    }
}