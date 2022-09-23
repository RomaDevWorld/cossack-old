const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js')
const { QuickDB } = require('quick.db')
const db = new QuickDB().table('lobbies')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('private')
        .setDescription('Створення та управління Вашим особистим голосовим каналом')
        .addSubcommandGroup(group => 
            group
            .setName(`manage`)
            .setDescription(`Керування особистим голосовим каналом.`)
            .addSubcommand(subcommand => 
                subcommand
                .setName(`limit`)
                .setDescription(`Встановити ліміт на кількість приєднаних до Вашого каналу (Корисно якщо канал публічний).`)    
                .addIntegerOption(option => option.setName(`limit`).setDescription(`Число від 2 до 99`).setRequired(true))
            )
            .addSubcommand(subcommand => 
                subcommand
                .setName(`public`)
                .setDescription(`Відкрити доступ до цього каналу усім учасникам серверу`)  
                .addBooleanOption(option => option.setName('bool').setDescription('True - відкритий / False - закритий'))
            )
            .addSubcommand(subcommand => 
                subcommand
                .setName(`delete`)
                .setDescription(`Видалити Ваш особистий канал.`)    
            )
        )
        .addSubcommand(subcommand => 
            subcommand
            .setName(`invite`)
            .setDescription(`Надати право учаснику цього серверу заходити та розмовляти у Вашому каналі.`)    
            .addUserOption(option => option.setName(`member`).setDescription(`Учасник цього серверу`).setRequired(true))
        )
        .addSubcommand(subcommand => 
            subcommand
            .setName(`kick`)
            .setDescription(`Відключити та заборонити запрошеному учаснику приєднуватись до Вашого каналу.`)    
            .addUserOption(option => option.setName(`member`).setDescription(`Учасник цього серверу`).setRequired(true))
        )
        .addSubcommand(subcommand => 
            subcommand
            .setName(`create`)
            .setDescription(`Створити/Перестворити Ваш особистий канал.`)
        ),
    async execute(interaction) {
        let channels = interaction.client.privates

        if(interaction.options.getSubcommand() === `create`){
            if(!await db.get(interaction.guild.id) || !interaction.guild.channels.cache.get(await db.get(interaction.guild.id))){
                await db.delete(interaction.guild.id)
                let embed = new EmbedBuilder()
                .setAuthor({ name: `Відсутній канал лоббі!` })
                .setColor('Orange')
                .setDescription('На цьому сервері відсутній канал лоббі.\nЗверніться до адміністратора.')
                .setFooter({ text: `Встановити: /preferences vclobby [lobby]` })
                return await interaction.reply({ embeds: [embed] })
            }

            if(channels[`${interaction.guild.id}_${interaction.member.id}`]){
                let channel = interaction.guild.channels.cache.get(channels[`${interaction.guild.id}_${interaction.member.id}`])
                if(channel){
                    await require(`../functions/vc_create.js`)(interaction.member, interaction.guild, interaction.client).then(async channel => {
                    })
                    channel.delete()
                    return await interaction.reply(`Channel re-created: ` + channel)
                }
            }
            require(`../functions/vc_create.js`)(interaction.member, interaction.guild, interaction.client).then(async channel => {
                await interaction.reply(`Channel created: ` + channel)
            })
        }
        if(interaction.options.getSubcommand() === `invite`){
            if(!channels[`${interaction.guild.id}_${interaction.member.id}`]) return await interaction.reply({ embeds: [{ author: { name: `У вас немає створеного каналу!` }, color: 0xcc7229 }], ephemeral: true })
            let channel = await interaction.guild.channels.cache.get(channels[`${interaction.guild.id}_${interaction.member.id}`])
            if(!channel) return await interaction.reply({ embeds: [{ author: { name: `У вас немає створеного каналу!` }, color: 0xF54C2C }], ephemeral: true })

            let member = interaction.options.getMember('member')
            channel.permissionOverwrites.edit(member.id, { ViewChannel: true })
            await interaction.reply({ embeds: [{ author: { name: `${member.user.username} був добавлений до Вашого каналу!` }, color: 0x2CF5AA }], ephemeral: true })
        }
        if(interaction.options.getSubcommandGroup() === 'manage'){
            let channel = interaction.guild.channels.cache.get(channels[`${interaction.guild.id}_${interaction.member.id}`])
            if(!channels[`${interaction.guild.id}_${interaction.member.id}`] || !channel) return await interaction.reply({ embeds: [{ author: { name: `У вас немає створеного каналу!` }, color: 0xcc7229 }], ephemeral: true })

            if(interaction.options.getSubcommand() === `public`){
                let bool = interaction.options.getBoolean('bool')
                if(bool){
                    channel.permissionOverwrites.edit(interaction.guild.id, { ViewChannel: true });
                    return await interaction.reply({ embeds: [{ author: { name: `Ваш канал тепер доступний усім!` }, color: 0x2CF5AA }], ephemeral: true });
                }else{
                    channel.permissionOverwrites.edit(interaction.guild.id, { ViewChannel: false });
                    return await interaction.reply({ embeds: [{ author: { name: `Ваш канал тепер доступний тільки Вам, та усім кого Ви запросили.` }, color: 0x2CF5AA }], ephemeral: true });
                }
            }else if(interaction.options.getSubcommand() === `limit`){
                let num = await interaction.options.getInteger('limit')
                console.log(num)
                var limi
                if(num > 99) limi = 99
                else if(num < 2) limi = 2
                else limi = num
                console.log(limi)
                channel.setUserLimit(limi)
                return await interaction.reply({ embeds: [{ author: { name: `Ліміт учасників - ${limi}` }, color: 0x2CF5AA }], ephemeral: true });
            }else if(interaction.options.getSubcommand() === `delete`){
                require('../functions/vc_delete.js')(interaction.member, channel, interaction.client)
                return await interaction.reply({ embeds: [{ author: { name: `Канал видалений.` }, color: 0x2CF5AA }], ephemeral: true });
            }
        }
    }
}