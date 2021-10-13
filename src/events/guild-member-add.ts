import {GuildMember} from 'discord.js';
import {DMChannel} from 'discord.js';
import {prisma} from '../index';
import crypto from 'crypto';
import {transporter, VERIFIED_ROLE_ID} from '../utils/config';

type NewMemberStates = 'JUST_JOINED' | 'WAIT_FOR_EMAIL' | 'WAIT_FOR_CODE'
const NewMemberStates = {
	JUST_JOINED: 'JUST_JOINED' as NewMemberStates,
	WAIT_FOR_EMAIL: 'WAIT_FOR_EMAIL' as NewMemberStates,
	WAIT_FOR_CODE: 'WAIT_FOR_CODE' as NewMemberStates
};

const vinciEmailRegex = /[a-z]+\.[a-z]+@student\.vinci\.be/g;
const verificationCodeRegex = /[0-9]/g;

export const guildMemberAddHandler = async (guildMember: GuildMember) => {
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
						userId: guildMember.user.id,
						email
					}
				});

				m.reply('GG, t\'es un bon toutou');
				collector.stop();
			}
		}
	});

	collector.on('end', () => {
		console.log('Process finished');
	});
};
