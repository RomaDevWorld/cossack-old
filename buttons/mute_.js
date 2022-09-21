const { PermissionsBitField } = require('discord.js');

module.exports = {
    id: "mute_",
    permission: [PermissionsBitField.Flags.MuteMembers],
    async execute(interaction){
        const member = await interaction.guild.members.cache.get(interaction.customId.slice(5))
        if(member){
            try{
                member.timeout(60 * 1000 * 5, `${interaction.user.tag}: Заблокувати чат на 5 хвилин`)
                await interaction.reply({ embeds: [{ author: { name: 'Чат учасника був успішно заблокований' }, color: 0x33a64e }], ephemeral: true })
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