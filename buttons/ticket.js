const { QuickDB } = require('quick.db')
const db = new QuickDB().table('misc')
const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

const cd = new Set()

module.exports = { //BUTTON'S INFORMATION
    id: "ticket",
    async execute(interaction){
        if(!await db.get(`${interaction.guild.id}.ticket`)){
            interaction.message.delete()
            await interaction.reply({ content: 'На цьому сервері більше не можна створювати тікети', ephemeral: true })
        }
        if(cd.has(interaction.user.id)) return await interaction.reply({ content: 'Тікети можна створювати раз в 10 хвилин', ephemeral: true })

        try{
            let channel = await interaction.guild.channels.create({ //Creates a new channel
                name: Math.round(Date.now() / 5000).toString(),
                parent: interaction.guild.channels.cache.get(await db.get(`${interaction.guild.id}.ticket.category`)) || undefined, //If has perent set perent
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionsBitField.Flags.ViewChannel], //Deny all the members
                    },
                    {
                        id: interaction.member.id,
                        allow: [PermissionsBitField.Flags.ViewChannel], //Allow ticket creator
                    },
                    {
                        id: await db.get(`${interaction.guild.id}.ticket.role`) || interaction.member.id,
                        allow: [PermissionsBitField.Flags.ViewChannel], //Allow mod role
                    },
                ],
              })

            const embed = new EmbedBuilder()
            .setAuthor({ name: 'Тікет створено!' })
            .setDescription('**Незабаром уповноважені люди зможуть відповісти на ваше запитання.**\nВи можете почати описувати свою проблему поки очікуєте.')
            .setColor('Green')

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId(`tick_0`)
                    .setLabel('Закрити обговорення')
                    .setStyle(ButtonStyle.Danger)
            )

            channel.send({ content: '@here', embeds: [embed], components: [row] }).then(msg => msg.pin())

            await interaction.reply({ content: `Тікет створено! Продовжуйте в ${channel}`, ephemeral: true })

            cd.add(interaction.user.id)
            setTimeout(() => {
                cd.delete(interaction.user.id)
            }, 10 * 60000)
        }catch(err){
            console.error(err)
            await interaction.reply({ content: 'Щось пішло не так!', ephemeral: true })
        }
}}