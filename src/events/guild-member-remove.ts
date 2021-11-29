import {GuildMember, PartialGuildMember} from 'discord.js';
import {prisma} from '../index';

export const guildMemberRemoveHandler = async (guildMember: GuildMember | PartialGuildMember) => {
	try {
		await guildMember.deleteDM();
	} catch (e) {
		console.log(e);
	}

	await prisma.user.deleteMany({
		where: {
			guildId: guildMember.guild.id,
			userId: guildMember.user?.id
		}
	});

	await prisma.verification.deleteMany({
		where: {
			guildId: guildMember.guild.id,
			userId: guildMember.user?.id
		}
	});
};