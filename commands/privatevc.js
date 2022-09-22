const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('privatevc')
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
                .addBooleanOption(option => option.setName('bool').setDescription('True or False?'))
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
            if(channels[`${interaction.guild.id}_${interaction.member.id}`]){
                let channel = interaction.guild.channels.cache.get(channels[`${interaction.guild.id}_${interaction.member.id}`])
                if(channel){
                    channel.delete()
                    require(`../functions/vc_create.js`)(interaction.member, interaction.guild, interaction.client).then(async channel => {
                    })
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
    }
}