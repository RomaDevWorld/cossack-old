const { PermissionsBitField } = require('discord.js');

module.exports = {
    id: "kick_",
    permission: [PermissionsBitField.Flags.KickMembers],
    async execute(interaction){
        const member = await interaction.guild.members.fetch(interaction.customId.slice(5))
        if(member){
            try{
                member.kick(`${interaction.user.tag}: Вигнати учасника з серверу`)
                await interaction.reply({ content: `Учасник був успішно вигнаний.`, ephemeral: true })
            }catch(err){
                console.log(err)
                await interaction.reply({ content: `Щось пішло не так. Спробуйте ще-раз піздніше або зверніться до адміністратора.`, ephemeral: true })
            }   
        }
    }
}