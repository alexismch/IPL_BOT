import {GuildMember} from 'discord.js';
import {DMChannel} from 'discord.js';
import {prisma} from '../index';
import crypto from 'crypto';
import {transporter, VERIFIED_ROLE_ID} from '../utils/config';
import {MessageEmbed} from 'discord.js';
import {MessageActionRow} from 'discord.js';
import {MessageButton} from 'discord.js';

type NewMemberStates = 'JUST_JOINED' | 'WAIT_FOR_EMAIL' | 'WAIT_FOR_CODE'
const NewMemberStates = {
	JUST_JOINED: 'JUST_JOINED' as NewMemberStates,
	WAIT_FOR_EMAIL: 'WAIT_FOR_EMAIL' as NewMemberStates,
	WAIT_FOR_CODE: 'WAIT_FOR_CODE' as NewMemberStates
};

const vinciEmailRegex = /[a-z]+\.[a-z]+@student\.vinci\.be/g;
const verificationCodeRegex = /[0-9]/g;

/*export const guildMemberAddHandler = async (guildMember: GuildMember) => {
	let state: NewMemberStates = NewMemberStates.JUST_JOINED;
	let email: string;

	const dmChannel: DMChannel = await guildMember.createDM();
	await dmChannel.send('Donne ton adresse email étudiante vinci...');
	state = NewMemberStates.WAIT_FOR_EMAIL;

	const collector = dmChannel.createMessageCollector();
	let code: string;

	collector.on('collect', async m => {
		if (m.author.bot) {
			return;
		}

		const content = m.content.replace(/\s/g, '');
		if (state === NewMemberStates.WAIT_FOR_EMAIL) {
			if (!content.match(vinciEmailRegex)) {
				m.reply('C\'est pas ton email vinci retard');
			} else {
				email = content;
				if (await prisma.user.findFirst({
					where: {
						email
					}
				})) {
					m.reply('Email déjà utilisée, contacte un admin sombre merde.');
					collector.stop();
					return;
				}
				code = crypto.randomInt(0, 1000000).toString().padStart(6, '0');
				await transporter.sendMail({
					from: '"Serveur Discord IPL - BIN" <noreply@alexismch.com>', // sender address
					to: email, // list of receivers
					subject: 'Vérification de compte', // Subject line
					text: code
				});
				await dmChannel.send('Merci d\'entrer le code de vérification envoyé par email...');
				state = 'WAIT_FOR_CODE';
			}
		} else if (state === NewMemberStates.WAIT_FOR_CODE) {
			if (!content.match(verificationCodeRegex) || content !== code) {
				m.reply('C\'est pas le bon code fdp');
			} else {
				await guildMember.roles.add(VERIFIED_ROLE_ID);
				await prisma.user.create({
					data: {
						guildId: guildMember.guild.id,
						userId: guildMember.user.id,
						email
					}
				});

				m.reply('GG, t\'es un bon toutou');
				collector.stop();
			}
		}
	});
};*/

export const guildMemberAddHandler = async (guildMember: GuildMember) => {
	const embed = new MessageEmbed()
		.setColor('#3ba55c')
		.setTitle('Welcome!')
		.setURL('https://twitch.tv/alexismch')
		.setDescription(`You just joined **[${guildMember.guild?.name}](https://discord.com/channels/${guildMember.guild?.id})** server, welcome!`)
		.addField('Verify your account', 'Please follow to link below in order to verify your account.')
		.addField('Need help?', 'If you need any help, click on the **Help!** button or contact an administrator.');

	const row = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setStyle('LINK')
				.setLabel('Verify')
				.setURL('https://twitch.tv/alexismch'),
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
					.setComponents(messageActionRow
						.components
						.filter(v => v.customId !== button.customId))
					.addComponents(button)
			]
		});

		collector.stop();
	});
};
