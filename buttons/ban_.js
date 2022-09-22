const { PermissionsBitField } = require('discord.js');

module.exports = {
    id: "ban_",
    permission: [PermissionsBitField.Flags.BanMembers],
    async execute(interaction){
        const member = await interaction.guild.members.cache.get(interaction.customId.slice(4))
        if(member){
            try{
                member.ban({ deleteMessageSeconds: 60 * 60, reason: `${interaction.user.tag}: Заблокувати учасника та очитити повідомлення за 1 год.` })
                await interaction.reply({ embeds: [{ author: { name: 'Учасник був успішно заблокований а повідомлення за останню годину - видалені' }, color: 0x33a64e }], ephemeral: true })
            }catch(err){
                console.log(err)
                await interaction.reply({ content: `Щось пішло не так. Спробуйте ще-раз піздніше або зверніться до адміністратора.`, ephemeral: true })
            }   
        }else{
            await interaction.update({embeds: interaction.message.embeds, components: []})
            await interaction.followUp({ embeds: [{ author: { name: 'Цей учасник більше не знаходиться на сервері.' }, color: 0xcc7229 }], ephemeral: true })
        }
    }
}