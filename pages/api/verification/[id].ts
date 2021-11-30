import {MessageEmbed} from 'discord.js';
import {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../utils/prisma';

const {REST} = require('@discordjs/rest');
const {Routes} = require('discord-api-types/v9');

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'PATCH') {
		return res.redirect('/');
	}

	let {query: {id}, body} = req as any;
	body = JSON.parse(body);

	const verification = await prisma.verification.findUnique({
		where: {
			id
		}
	});
	if (!verification) {
		return res.status(404).send('No verification found');
	}

	const user = await prisma.user.findFirst({
		where: {
			OR: [
				{
					name: body.name
				},
				{
					email: body.email
				}
			],
			AND: {
				guildId: verification.guildId
			}
		},
		select: {
			id: true
		}
	});
	if (user) {
		return res.status(409).send({message: 'Your user is already in use for this server'});
	}

	const settings = await prisma.settings.findFirst({
		where: {
			guildId: verification.guildId
		},
		select: {
			verifiedRole: true,
			helpTicketsChannel: true
		}
	});

	if (settings && settings.verifiedRole) {
		const rest = new REST({version: '9'}).setToken(process.env.DISCORD_TOKEN);
		await rest.put(Routes.guildMemberRole(verification.guildId, verification.userId, settings.verifiedRole));

		await prisma.verification.delete({
			where: {
				id
			}
		});

		await prisma.user.create({
			data: {
				guildId: verification.guildId,
				userId: verification.userId,
				name: body.name,
				email: body.email
			}
		});

		if (settings.helpTicketsChannel) {
			await rest.post(Routes.channelMessages(settings.helpTicketsChannel), {
				body: {
					embeds: [
						new MessageEmbed()
							.setColor('#3ba55c')
							.setTitle('User verified!')
							.setDescription(`<@${verification.userId}> has been verified!`)
							.addField('Name', body.name)
							.addField('E-mail', body.email)
					]
				}
			});
		}
	} else {
		res.status(449).send({message: 'No verified role specified yet for this server, please contact an admin'});
	}

	res.status(200).send(null);
};

export default handler;