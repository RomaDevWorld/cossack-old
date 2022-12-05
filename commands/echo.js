const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('echo')
        .setDescription('Констуктор повідомлень.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option => option.setName('text').setDescription('Текст повідомлення'))
        .addStringOption(option =>
            option.setName('author')
                .setDescription('Вибрати автора повідомлення')
                .addChoices(
                    { name: 'Бот', value: 'bot' },
                    { name: 'Сервер (Webhook)', value: 'server' },
                ))
        .addChannelOption(option => option.setName('channel').setDescription('Канал відправки').addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement))
        .addAttachmentOption(option => option.setName('attachment').setDescription('Файл повідомлення'))
        .addStringOption(option => option.setName('embed_author').setDescription('Заголовок ембеду')) //Embeds
        .addAttachmentOption(option => option.setName('embed_authoricon').setDescription('Картинка біля заголовку'))
        .addStringOption(option => option.setName('embed_desc').setDescription('Опис ембеду'))
        .addStringOption(option => 
            option.setName('embed_color')
            .setDescription('Колір ембеду')
            .addChoices(
                { name: 'Червоний', value: 'Red' },
                { name: 'Синій', value: 'Blue' },
                { name: 'Зелений', value: 'Green' },
                { name: 'Жовтий', value: "Yellow" },
                { name: 'Фіолетовий', value: "Purple" },
                { name: 'Білий', value: 'White' },
                { name: 'Золотий', value: 'Gold' },
            )
        )
        .addStringOption(option => option.setName('embed_footer').setDescription('Нижня секція ембеду'))
        .addAttachmentOption(option => option.setName('embed_footericon').setDescription('Картинка нижньої секції'))
        .addAttachmentOption(option => option.setName('embed_image').setDescription('Зображення ембеду'))
        .addAttachmentOption(option => option.setName('embed_thumbnail').setDescription('Маленьке зображення ембеду'))
        ,
    async execute(interaction) {

        let options = interaction.options

        if(options._hoistedOptions.length === 0) return await interaction.reply({ content: 'Вам необхідно вказати одну з опцій!', ephemeral: true })

        var message = {}

        let channel
        if(options.getChannel('channel')) channel = options.getChannel('channel')
        else channel = interaction.channel

        await interaction.reply({ embeds: [{ description: '**Формуємо предперегляд.. Це може зайняти трохи часу** \n\nЦікавий факт, на випадок якщо це триває достатньо довго:\n' + require('../functions/memes.js')(3) }], ephemeral: true })

        let attachment = options.getAttachment('attachment')
        let embedAuthor = options.getString('embed_author')
        let embedAuthorIcon = options.getAttachment('embed_authoricon')
        let embedDesc = options.getString('embed_desc')
        let embedColor = options.getString('embed_color')
        let embedFooter = options.getString('embed_footer')
        let embedFooterIcon = options.getAttachment('embed_footericon')
        let embedImage = options.getAttachment('embed_image')
        let embedThumbnail = options.getAttachment('embed_thumbnail')
        let text = options.getString('text')
    
        if(text) message.content = text.replaceAll(`!n`, `\n`)
    
        if(attachment && attachment.contentType.startsWith('image')) message.files = [attachment.url]
        
        let embed = new EmbedBuilder()
        if(embedAuthor && embedAuthorIcon && embedAuthorIcon.contentType.startsWith('image')){
            embed.setAuthor({ name: embedAuthor, iconURL: embedAuthorIcon.url })
        }else{
            if(embedAuthor) embed.setAuthor({ name: embedAuthor })
        }
        if(embedDesc) embed.setDescription(embedDesc.replaceAll(`!n`, `\n`))
        if(embedColor) embed.setColor(embedColor)
        
        if(embedFooter && embedFooterIcon && embedFooterIcon.contentType.startsWith('image')){
                embed.setFooter({ text: embedFooter, iconURL: embedAuthorIcon.url })
        }else{
            if(embedFooter) embed.setFooter({ text: embedFooter })
        }
        if(embedImage && embedImage.contentType.startsWith('image')) embed.setImage(embedImage.url)
        if(embedThumbnail && embedThumbnail.contentType.startsWith('image')) embed.setThumbnail(embedThumbnail.url)
            
        if(embed.data[0]) message.embeds = [embed]
        else message.embeds = []

        let uni = Math.floor(Date.now() / 1000)

        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setLabel('Натисніть щоб відправити повідомлення')
            .setStyle(ButtonStyle.Success)
            .setCustomId('echo_' + uni)
        )
        
        message.components = [row]
        await interaction.editReply(message)
        .catch(async err => { return await interaction.editReply({ embeds: [{ author: { name: 'Виникла помилка при формуванні повідомлення. Перевірте правильність данних.' }, color: 0xeb4c34 }], ephemeral: true, components: []}) })
        message.components = []

        const filter = i => i.customId === `echo_${uni}` && i.user.id === interaction.user.id; 
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30000, max: 1 });

        collector.on('collect', async (c) => {
            if(options.getString('author') === 'server'){
                const webhooks = await channel.fetchWebhooks();
                let webhook = webhooks.find(wh => wh.name === `Kazak echo`);
                if(!webhook) webhook = await channel.createWebhook({
                    name: 'Kazak echo',
                    avatar: interaction.client.user.avatarURL(),
                })
    
                message.username = interaction.guild.name
                message.avatarURL = await interaction.guild.iconURL({ dynamic: true })
    
                await webhook.send(message)
                .then(async() => {
                    await interaction.editReply({ embeds: [{ author: { name: 'Повідомлення відправлено' }, color: 0x344feb, description: `Повідомлення було відправлено в канал ${channel} від імені Серверу.` }], ephemeral: true, components: [] })
                })
                .catch(async err => {
                    console.error(err)
                    return await interaction.editReply({ embeds: [{ author: { name: 'Виникла помилка' }, color: 0xeb4c34 }], ephemeral: true, components: []})
                })
        }else{
                await channel.send(message)
                .then(async() => {
                    await interaction.editReply({ embeds: [{ author: { name: 'Повідомлення відправлено' }, color: 0x9f34eb, description: `Повідомлення було відправлено в канал ${channel} від імені Бота.` }], ephemeral: true, components: [] })
                })
                .catch(async err => {
                    console.error(err)
                    return await interaction.editReply({ embeds: [{ author: { name: 'Виникла помилка' }, color: 0xeb4c34 }], ephemeral: true, components: []})
                })
        }
        })

        collector.on('end', async (collected) => {
            if(!collected.first()) return await interaction.editReply({ embeds: [{ author: { name: 'Дія відмінена від неактивності' }, ephemeral: true }], components: [] })
        })

    }
}