const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js')

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
        .addChannelOption(option => option.setName('channel').setDescription('Канал відправки'))
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
            )
        )
        .addStringOption(option => option.setName('embed_footer').setDescription('Нижня секція ембеду'))
        .addAttachmentOption(option => option.setName('embed_footericon').setDescription('Картинка нижньої секції'))
        .addAttachmentOption(option => option.setName('embed_image').setDescription('Зображення ембеду'))
        .addAttachmentOption(option => option.setName('embed_thumbnail').setDescription('Маленьке зображення ембеду'))
        ,
    async execute(interaction) {

        await interaction.deferReply({ ephemeral: true })

        let options = interaction.options

        if(options._hoistedOptions.length === 0) return await interaction.reply({ content: 'Вам необхідно вказати одну з опцій!', ephemeral: true })

        var message = {}

        let channel
        if(options.getChannel('channel') && [0, 5, 10, 11, 12, 15].includes(options.getChannel('channel').type)) channel = options.getChannel('channel')
        else channel = interaction.channel

        let attachment = options.getAttachment('attachment')
        let embedAuthor = options.getString('embed_author')
        let embedAuthorIcon = options.getAttachment('embed_authoricon')
        let embedDesc = options.getString('embed_desc')
        let embedColor = options.getString('embed_color')
        let embedFooter = options.getString('embed_footer')
        let embedFooterIcon = options.getAttachment('embed_footericon')
        let embedImage = options.getAttachment('embed_image')
        let embedThumbnail = options.getAttachment('embed_thumbnail')
    
        message.content = options.getString('text')
    
        if(attachment && attachment.contentType.startsWith('image')) message.files = [attachment.url]
        
        let embed = new EmbedBuilder()
        if(embedAuthor && embedAuthorIcon && embedAuthorIcon.contentType.startsWith('image')){
            embed.setAuthor({ name: embedAuthor, iconURL: embedAuthorIcon.url })
        }else{
            if(embedAuthor) embed.setAuthor({ name: embedAuthor })
        }
        if(embedDesc) embed.setDescription(embedDesc)
        if(embedColor) embed.setColor(embedColor)
        
        if(embedFooter && embedFooterIcon && embedFooterIcon.contentType.startsWith('image')){
                embed.setFooter({ text: embedFooter, iconURL: embedAuthorIcon.url })
        }else{
            if(embedFooter) embed.setFooter({ text: embedFooter })
        }
        if(embedImage && embedImage.contentType.startsWith('image')) embed.setImage(embedImage.url)
        if(embedThumbnail && embedThumbnail.contentType.startsWith('image')) embed.setThumbnail(embedThumbnail.url)
            
        if(Object.keys(embed.data).length !== 0) message.embeds = [embed] || []
    
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
                    await interaction.editReply({ content: `Повідомлення відправлено в ${channel}. Від імені серверу`, ephemeral: true })
                })
                .catch(async err => {
                    console.log(err)
                    return await interaction.editReply({ content: `Виникла помилка`, ephemeral: true }) 
                })
        }else{
                await channel.send(message)
                .then(async() => {
                    await interaction.editReply({ content: `Повідомлення відправлено в ${channel}. Від імені бота.`, ephemeral: true })
                })
                .catch(async err => {
                    console.log(err)
                    return await interaction.editReply({ content: `Виникла помилка`, ephemeral: true })
                })
        }

    }
}