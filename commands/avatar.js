const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js')

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('avatar')
        .setType(ApplicationCommandType.User),
    async execute(interaction) {
        await interaction.reply({ content: interaction.targetUser.displayAvatarURL({ dynamic: true }), ephemeral: true })
    }
}