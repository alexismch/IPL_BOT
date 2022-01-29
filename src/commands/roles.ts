import {
	SlashCommandBuilder, SlashCommandRoleOption,
	SlashCommandSubcommandBuilder
} from '@discordjs/builders';
import {CommandInteraction, Guild, GuildMember} from 'discord.js';

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
		const role = interaction.options.get('role')?.value as string;
		const membersCollection = (await interaction.guild.members.fetch({force: true}))
			?.filter(member => member.roles.cache.has(role));
		const members = membersCollection.values();

		let member: GuildMember = members.next().value;
		while (member) {
			await member.roles.remove(role);
			member = members.next().value;
		}
		await interaction.followUp({content: `<@&${role}> role has been removed from ${membersCollection.size} members.`});
	}
};