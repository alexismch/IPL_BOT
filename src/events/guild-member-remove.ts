import {GuildMember, PartialGuildMember} from 'discord.js';
import {prisma} from '../index';

export const guildMemberRemoveHandler = async (guildMember: GuildMember | PartialGuildMember) => {
	try {
		try {
			await guildMember.deleteDM();
		} catch {
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
	} catch (e) {
		console.log('---');
		console.log(`guildMemberRemoveHandler error ${guildMember.id} ${guildMember.nickname}`);
		console.log(e);
		console.log('---');
	}
};