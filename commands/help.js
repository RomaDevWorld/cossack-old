const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, PermissionsBitField, EmbedBuilder, ButtonStyle } = require('discord.js')
const { QuickDB } = require('quick.db')
const db = new QuickDB()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Інформація про бота'),
    async execute(interaction) {
        const lobbies = await db.table('lobbies');
        const log = await db.table('logs');
        const counters = await db.table('counters');

        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setLabel('Сервер підтримки')
                .setURL(`https://discord.gg/R5MQQ4UJ`)
                .setStyle(ButtonStyle.Link),
            new ButtonBuilder()
                .setLabel('Додати бота на сервер')
                .setURL(`https://tinyurl.com/cossac-invite`)
                .setStyle(ButtonStyle.Link)
        );

        if(interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)){
            let embed = new EmbedBuilder()
            .setAuthor({ name: `Слава Україні!`, iconURL: `https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Flag_of_Ukraine.svg/800px-Flag_of_Ukraine.svg.png?20100406171642` })
            .setDescription(`**Це - Козак, перший повністю безкоштовний, україномовний бот з відкритим кодом.**\nМи помітили що Ви є адміністратором, тому відображаємо інформацію яка буде корисна для Вас.`)
            .addFields(
                { name: 'Приватні голосові кімнати', value: 'Ви можете добавити можливість для своїх учасників створювати свої закриті голосові кімнати у себе на сервері.\nДля цього створіть новий голосовий канал, та добавте його в якості "Лоббі" через команду `/prefs vclobby #канал`' },
                { name: 'Сповіщення про події', value: 'Ми можемо відправляти сповіщення про окремі типи подій в спеціалізований для цього канал.\nВстановіть його через `/prefs log channel #канал`\nНе забудьте увімкнути окремі типи через `/prefs log switch`' },
                { name: 'Лічильник учасників онлайн', value: 'Ми будемо автоматично оновлювати назву Категорії або Голосового каналу в залежності від онлайну на сервері\nВстановіть це через `/prefs counter set #канал`' },
                { name: 'Більше інформації на нашому GitHub', value: '**[Посилання на GitHub](https://github.com/RomaDevWorld/cossac/blob/master/README.md)**'}
            )
            .setFooter({ text: `${interaction.client.user.tag} | Дякуємо за Вашу підтримку!`, iconURL: `${interaction.client.user.avatarURL()}` })
            .setColor(`Green`)
            await interaction.reply({ embeds: [embed], components: [row] })
        }else{
            let embed = new EmbedBuilder()
            .setAuthor({ name: `Слава Україні!`, iconURL: `https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Flag_of_Ukraine.svg/800px-Flag_of_Ukraine.svg.png?20100406171642` })
            .setDescription(`**Це - Козак, перший повністю безкоштовний, україномовний бот з відкритим кодом.**`)
            .addFields({ name: 'Більше інформації на нашому GitHub', value: '**[Посилання на GitHub](https://github.com/RomaDevWorld/cossac/blob/master/README.md)**'})
            .setFooter({ text: `${interaction.client.user.tag} | Дякуємо за Вашу підтримку!`, iconURL: `${interaction.client.user.avatarURL()}` })
            .setColor(`Green`)

            let lobby = interaction.guild.channels.cache.get(await lobbies.get(interaction.guild.id))
            if(lobby) embed.addFields({ name: `Ви можете створити свій особистий голосовий канал на цьому сервері`, value: `Для цього просто під'єднайтесь до **${lobby}**\nВи також можете контролювати ним через команду\`/privates\`` })

            await interaction.reply({ embeds: [embed], components: [row] })

        }
    }
}