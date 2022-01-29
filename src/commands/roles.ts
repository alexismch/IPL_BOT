import {
	SlashCommandBuilder, SlashCommandRoleOption,
	SlashCommandSubcommandBuilder
} from '@discordjs/builders';
import {CommandInteraction, Guild, GuildMember} from 'discord.js';
import {delay} from '../utils';

module.exports = {
	isAdmin: true,
	data: new SlashCommandBuilder()
		.setName('roles')
		.setDescription('Manage roles')
		.addSubcommand(
			(subCommand: SlashCommandSubcommandBuilder) =>
				subCommand
					.setName('clear')
					.setDescription('Remove the role to all members')
					.addRoleOption(
						(option: SlashCommandRoleOption) =>
							option
								.setName('role')
								.setDescription('The role')
								.setRequired(true)
					)
		),
	async execute(interaction: CommandInteraction & { guild: Guild; }) {
		await interaction.deferReply();

		const roleId = interaction.options.get('role')?.value as string;
		const role = interaction.guild.roles.cache.get(roleId);
		const membersCollection = role?.members;
		let fails = 0;

		const members = membersCollection?.values();
		let member: GuildMember = members?.next().value;
		while (member) {
			await delay(1000);
			try {
				await member.roles.remove(roleId);
			} catch {
				fails++;
			}
			member = members?.next().value;
		}
		await interaction.followUp({content: `<@&${role}> role has been removed from ${membersCollection?.size || 0} members (${fails} possible fails).`});
	}
};