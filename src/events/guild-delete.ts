import {Guild} from 'discord.js';
import {prisma} from '../';

export const guildDeleteHandler = async (guild: Guild) => {
	try {
		const query = {
			where: {
				guildId: guild.id
			}
		};
		await prisma.settings.deleteMany(query);
		await prisma.user.deleteMany(query);
		await prisma.verification.deleteMany(query);
		await prisma.series.deleteMany(query);
	} catch (e) {
		console.log('---');
		console.log(`guildDeleteHandler error ${guild.id} ${guild.name}`);
		console.log(e);
		console.log('---');
	}
};