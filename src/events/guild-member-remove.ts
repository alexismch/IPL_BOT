import {GuildMember} from 'discord.js';
import {prisma} from '../index';
import {PartialGuildMember} from 'discord.js';

export const handleGuildMemberRemove = async (guildMember: GuildMember | PartialGuildMember) => {
	try {
		await guildMember.deleteDM();
	} catch (e) {
		console.log(e);
	}
	await prisma.user.deleteMany({
		where: {
			userId: guildMember.user?.id
		}
	});
};