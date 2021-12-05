import {Guild} from 'discord.js';
import {prisma} from '../';

export const guildDeleteHandler = async (guild: Guild) => {
	const query = {
		where: {
			guildId: guild.id
		}
	};
	await prisma.settings.deleteMany(query);
	await prisma.user.deleteMany(query);
	await prisma.verification.deleteMany(query);
	await prisma.series.deleteMany(query);
};