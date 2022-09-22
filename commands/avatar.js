const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Отримати аватар учасника')
        .setType(ApplicationCommandType.User),
    async execute(interaction) {
        try{
            let target = await interaction.targetUser
            const embed = new EmbedBuilder()
            .setAuthor({ name: `Аватар ${target.username}`, url: require(`../functions/memes.js`)(1) })
            .setImage(target.displayAvatarURL({ dynamic: true, size: 2048 }))
            .setColor('Green')
            await interaction.reply({ embeds: [embed], ephemeral: true })
        }catch(err){
            console.log(err)
            await interaction.reply({ embeds: [{ author: { name: 'Отакої! Виникла помилка, скоріше за все в учасника не встановлений аватар' }, color: 0xcc2929 }], ephemeral: true })
        }
    }
}