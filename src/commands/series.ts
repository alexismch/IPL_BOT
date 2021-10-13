import {CommandInteraction} from 'discord.js';
import {SlashCommandBuilder} from '@discordjs/builders';
import {SlashCommandSubcommandBuilder} from '@discordjs/builders';
import {SlashCommandSubcommandGroupBuilder} from '@discordjs/builders';
import {SlashCommandStringOption} from '@discordjs/builders';
import {execute} from './subcommands/series-delete';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('series')
		.setDescription('Manage series')
		.addSubcommandGroup(
			(subcommandGroup: SlashCommandSubcommandGroupBuilder) =>
				subcommandGroup
					.setName('delete')
					.setDescription('Delete series and series channels')
					.addSubcommand(
						(subCommand: SlashCommandSubcommandBuilder) =>
							subCommand
								.setName('all')
								.setDescription('Delete all series of all blocks')
					)
					.addSubcommand(
						(subcommand: SlashCommandSubcommandBuilder) =>
							subcommand
								.setName('blocks')
								.setDescription('Delete all series of some specific blocks')
								.addStringOption(
									(option: SlashCommandStringOption) =>
										option
											.setName('blocks')
											.setDescription('The blocks separated by a semicolon (e.g. 1;3)')
											.setRequired(true)
								)
					)
		),
	async execute(interaction: CommandInteraction) {
		console.log(interaction.options);
		if (interaction.options.getSubcommandGroup() === 'delete') {
			return await execute(interaction);
		}
		return await interaction.reply('Bonsoir, non - Amir Coach');
	}
};