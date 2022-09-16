const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Відображає затримку між хостингом і серверами Discord'),
    async execute(interaction) {
        console.log(interaction.member)

        let resDate = new Date().getTime()
        await interaction.reply({content: `Рахуємо..`, ephemeral: true}).then(async(msg) => {
            await interaction.editReply(`**Затримка Discord:** ${interaction.client.ws.ping}мс.\n**Затримака програми:** ${new Date().getTime() - resDate}мс.`)
        })
    }
}