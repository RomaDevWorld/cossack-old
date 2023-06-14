const { PermissionsBitField } = require('discord.js')

module.exports = {
  //BUTTON'S INFORMATION
  id: 'mute_',
  permission: [PermissionsBitField.Flags.MuteMembers], //EXPORTS A PERMISSION THAT WILL BE CHECKED WHEN BUTTON IS CLICKED
  async execute(interaction) {
    const member = await interaction.guild.members.cache.get(interaction.customId.slice(5)) //Removes first 5 characters from customId to get member id
    if (member) {
      try {
        //Trying to mute a member
        member.timeout(60 * 1000 * 5, `${interaction.user.author.discriminator == '0' ? interaction.user.username : interaction.user.tag}: Заблокувати чат на 5 хвилин`)
        await interaction.reply({
          embeds: [
            {
              author: {
                name: 'Чат учасника був успішно заблокований',
              },
              color: 0x33a64e,
            },
          ],
          ephemeral: true,
        })
      } catch (err) {
        //Return error if error
        console.error(err)
        await interaction.reply({
          content: `Щось пішло не так. Спробуйте ще-раз пізніше або зверніться до адміністратора.`,
          ephemeral: true,
        })
      }
    } else {
      //No member - return message and delete the buttons
      await interaction.update({
        embeds: interaction.message.embeds,
        components: [],
      })
      await interaction.followUp({
        embeds: [
          {
            author: {
              name: 'Цей учасник більше не знаходиться на сервері.',
            },
            color: 0xcc7229,
          },
        ],
        ephemeral: true,
      })
    }
  },
}
