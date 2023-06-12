const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))

module.exports = {
  data: new SlashCommandBuilder().setName('dog').setDescription('Випадкові фотографії собак!'),
  async execute(interaction) {
    await interaction.deferReply()

    const response = await fetch('https://dog.ceo/api/breeds/image/random')
    if (!response.ok) {
      console.error(`Couldn't fetch image`)
      console.error(response)
      return await interaction.editReply('Не вдалося отримати зображення від API')
    }
    let json = await response.json()
    let embed = new EmbedBuilder().setAuthor({ name: 'Випадкова собачка!' }).setColor('Grey').setImage(json.message).setFooter({
      text: 'Зображення взято з сайту "dog.ceo". Ми не відповідаємо за зміст.',
    })
    await interaction.editReply({ embeds: [embed] })
  },
}
