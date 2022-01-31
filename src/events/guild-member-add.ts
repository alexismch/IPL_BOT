import {DMChannel, GuildMember, MessageActionRow, MessageButton, MessageEmbed} from 'discord.js';
import {prisma} from '../';

export const guildMemberAddHandler = async (guildMember: GuildMember) => {
	try {
		const verification = await prisma.verification.findFirst({
			where: {
				guildId: guildMember.guild?.id as string,
				userId: guildMember.user.id
			}
		}) || await prisma.verification.create({
			data: {
				guildId: guildMember.guild?.id as string,
				userId: guildMember.user.id
			}
		});

		const settings = await prisma.settings.findFirst({
			where: {
				guildId: guildMember.guild.id
			}
		});

		const embed = new MessageEmbed()
			.setColor('#3ba55c')
			.setTitle('Welcome!')
			.setURL(`${process.env.FRONT_URL}/confirm/${verification.id}`)
			.setDescription(`You just joined **[${guildMember.guild?.name}](https://discord.com/channels/${guildMember.guild?.id})** server, welcome!`)
			.addField('Verify your account', 'Please follow to link below in order to verify your account.')
			.addField('Need help?', 'If you need any help, click on the **Help!** button or contact an administrator.');

		const components = [
			new MessageButton()
				.setStyle('LINK')
				.setLabel('Verify')
				.setURL(`${process.env.FRONT_URL}/confirm/${verification.id}`)
		];

		if (settings && settings.helpTicketsChannel) {
			components.push(new MessageButton()
				.setCustomId('help_button')
				.setStyle('DANGER')
				.setLabel('Help!'));
		}

		const row = new MessageActionRow().addComponents(components);

		const dmChannel: DMChannel = await guildMember.createDM();
		const dmMessage = await dmChannel.send({
			embeds: [embed],
			components: [row]
		});

		if (settings && settings.helpTicketsChannel) {
			const collector = dmMessage.createMessageComponentCollector({
				componentType: 'BUTTON'
			});

			collector.on('collect', async interaction => {
				const helpTicketsChannel = guildMember.guild.channels.resolve(settings.helpTicketsChannel as string);
				const messageActionRow = (interaction.message.components as MessageActionRow[])[0];
				const button = (interaction.component as MessageButton);
				button.setDisabled(true);

				try {
					if (!helpTicketsChannel || !helpTicketsChannel.isText()) {
						throw new Error();
					}
					await helpTicketsChannel.send({
						embeds: [
							new MessageEmbed()
								.setColor('#ed4245')
								.setTitle('Help requested!')
								.setDescription(`<@${guildMember.user.id}> requested help for verification!`)
						]
					});
					button.setStyle('SUCCESS');
					button.setLabel('Help has been requested');
				} catch (e) {
					await dmChannel.send('An error occured, please contact an admin by yourself.');
				}

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
		}
	} catch (e) {
		console.log('---');
		console.log(`guildMemberAddHandler error ${guildMember.id} ${guildMember.nickname}`);
		console.log(e);
		console.log('---');
	}
};
