const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const moment = require('moment')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Тимчасово заборонити учаснику сервера відправляти повідомлення та заходити в голосові канали')
    .addUserOption((option) => option.setName('member').setDescription('Учасник серверу').setRequired(true))
    .addStringOption((option) => option.setName('time').setDescription('Час блокування (100s/m/h/d)').setRequired(true))
    .addStringOption((option) => option.setName('reason').setDescription('Причина заборони'))
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
  async execute(interaction) {
    const member = interaction.guild.members.cache.get(interaction.options.getUser('member').id)
    if (!member)
      return await interaction.reply({
        embeds: [
          {
            author: { name: 'Цього користувача немає на сервері' },
            color: 0xcc2929,
          },
        ],
        ephemeral: true,
      })

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.MuteMembers)) {
      return await interaction.reply({
        embeds: [
          {
            author: { name: 'У мене недостатньо прав для виконання цієї дії!' },
            color: 0xcc2929,
          },
        ],
        ephemeral: true,
      })
    }
    if (member.permissions.has(PermissionFlagsBits.Administrator) || (member.roles.highest.position >= interaction.member.roles.highest.position && !interaction.member.permissions.has(PermissionFlagsBits.Administrator)))
      return await interaction.reply({
        embeds: [
          {
            author: {
              name: 'Цей користувач знаходиться вище або ви однакові по ролям',
            },
            color: 0xcc2929,
          },
        ],
        ephemeral: true,
      })

    const rawTime = interaction.options.getString('time')
    let time
    if (rawTime.endsWith('s')) time = rawTime.slice(0, rawTime.length - 1) * 1
    else if (rawTime.endsWith('m')) time = rawTime.slice(0, rawTime.length - 1) * 60
    else if (rawTime.endsWith('h')) time = rawTime.slice(0, rawTime.length - 1) * 60 * 60
    else if (rawTime.endsWith('d')) time = rawTime.slice(0, rawTime.length - 1) * 60 * 60 * 24
    else
      return await interaction.reply({
        embeds: [
          {
            author: { name: 'Ви некоректно вказали час' },
            color: 0xcc2929,
          },
        ],
        ephemeral: true,
      })
    if (isNaN(time))
      return await interaction.reply({
        embeds: [
          {
            author: { name: 'Ви некоректно вказали час' },
            color: 0xcc2929,
          },
        ],
        ephemeral: true,
      })
    if (time > 2419200)
      return await interaction.reply({
        embeds: [
          {
            author: {
              name: 'Максимальний час блокування: 28 днів (Обмеження Discord)',
            },
            color: 0xcc2929,
          },
        ],
        ephemeral: true,
      })
    if (time < 1)
      return await interaction.reply({
        embeds: [
          {
            author: {
              name: "Час блокування не може бути від'ємним або дорівнювати 0",
            },
            color: 0xcc2929,
          },
        ],
        ephemeral: true,
      })

    try {
      member.timeout(time * 1000, `${interaction.user.author.discriminator == '0' ? interaction.user.username : interaction.user.tag}: ${interaction.options.getString('reason') || 'Не вказано'}`)

      return await interaction.reply({
        embeds: [
          {
            author: {
              name: `${member.user.author.discriminator == '0' ? member.user.username : member.user.tag} обмежений до ${moment(Date.now() + time * 1000).format('HH:mm:ss DD.MM.YYYY')}`,
            },
            color: 0xcc2929,
          },
        ],
        ephemeral: true,
      })
    } catch (error) {
      console.error(error)
      return await interaction.reply({
        content: 'Щось пішло не так під час виконання. Перевірте усі необхідні права в бота.',
        ephemeral: true,
      })
    }
  },
}
