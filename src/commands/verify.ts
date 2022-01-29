import {SlashCommandBuilder} from '@discordjs/builders';
import {CommandInteraction, Guild, GuildMember} from 'discord.js';
import {delay} from '../utils';
import {guildMemberAddHandler} from '../events';
import {prisma} from '../index';

module.exports = {
	isAdmin: true,
	data: new SlashCommandBuilder()
		.setName('verify')
		.setDescription('Send a verification message to all unverified users'),
	async execute(interaction: CommandInteraction & { guild: Guild; }) {
		const settings = await prisma.settings.findFirst({
			where: {
				guildId: interaction.guild.id
			}
		});
		if (!settings || !settings.verifiedRole) {
			return await interaction.reply({ephemeral: true, content: 'No verified role has been set.'});
		}
		await interaction.deferReply();
		const membersCollection = (await interaction.guild.members.fetch({force: true}))
			?.filter(member => !member.roles.cache.has(settings.verifiedRole as string) && !member.user.bot);
		const members = membersCollection.values();

		let fails = 0;

		let member: GuildMember = members.next().value;
		while (member) {
			await delay(1000);
			try {
				await guildMemberAddHandler(member);
			} catch {
				fails++;
			}
			member = members.next().value;
		}
		await interaction.followUp({content: `A message has been sent to ${membersCollection.size} members (${fails} possible fails).`});
	}
};