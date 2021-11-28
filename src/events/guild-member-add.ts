import {DMChannel, GuildMember, MessageActionRow, MessageButton, MessageEmbed} from 'discord.js';
import {prisma} from '../';

export const guildMemberAddHandler = async (guildMember: GuildMember) => {
	const verification = await prisma.verification.create({
		data: {
			guildId: guildMember.guild?.id as string,
			userId: guildMember.user.id
		}
	});

	const embed = new MessageEmbed()
		.setColor('#3ba55c')
		.setTitle('Welcome!')
		.setURL(`http://localhost:3000/confirm/${verification.id}`)
		.setDescription(`You just joined **[${guildMember.guild?.name}](https://discord.com/channels/${guildMember.guild?.id})** server, welcome!`)
		.addField('Verify your account', 'Please follow to link below in order to verify your account.')
		.addField('Need help?', 'If you need any help, click on the **Help!** button or contact an administrator.');

	const row = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setStyle('LINK')
				.setLabel('Verify')
				.setURL(`http://localhost:3000/confirm/${verification.id}`),
			new MessageButton()
				.setCustomId('help_button')
				.setStyle('DANGER')
				.setLabel('Help!')
		);

	const dmChannel: DMChannel = await guildMember.createDM();
	const dmMessage = await dmChannel.send({
		embeds: [embed],
		components: [row]
	});

	const collector = dmMessage.createMessageComponentCollector({
		componentType: 'BUTTON'
	});

	collector.on('collect', async interaction => {
		const messageActionRow = (interaction.message.components as MessageActionRow[])[0];
		const button = (interaction.component as MessageButton);
		button.setDisabled(true);
		button.setStyle('SUCCESS');
		button.setLabel('Help has been asked');

		await interaction.update({
			components: [
				messageActionRow
					.setComponents(
						messageActionRow
							.components
							.filter(v => v.customId !== button.customId))
					.addComponents(button)
			]
		});

		collector.stop();
	});
};
