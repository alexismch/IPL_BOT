import {CommandInteraction} from 'discord.js';
import {SlashCommandBuilder} from '@discordjs/builders';
import {SlashCommandSubcommandBuilder} from '@discordjs/builders';
import {SlashCommandSubcommandGroupBuilder} from '@discordjs/builders';
import {SlashCommandStringOption} from '@discordjs/builders';
import {execute as executeDelete} from './subcommands/series-delete';
import {execute as executeSet} from './subcommands/series-set';
import {cleanUp} from '../utils';
import {Guild} from 'discord.js';

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
								.setDescription('Delete all series of some specified blocks')
								.addStringOption(
									(option: SlashCommandStringOption) =>
										option
											.setName('blocks')
											.setDescription('The blocks separated by a semicolon (e.g. 1;3)')
											.setRequired(true)
								)
					)
		)
		.addSubcommand(
			(subCommand: SlashCommandSubcommandBuilder) =>
				subCommand
					.setName('set')
					.setDescription('Set a specified amount of series to each specified block')
					.addStringOption(
						(option: SlashCommandStringOption) =>
							option
								.setName('blocks')
								.setDescription('The blocks separated by a semicolon (e.g. 1;3)')
								.setRequired(true)
					)
					.addStringOption(
						(option: SlashCommandStringOption) =>
							option
								.setName('series')
								.setDescription('The amount of series for each block separated by a semicolon (e.g. 6;4)')
								.setRequired(true)
					)
		),
	async execute(interaction: CommandInteraction) {
		if (!interaction.guild) {
			return interaction.reply('Command should be used within a server.');
		}
		
		await interaction.deferReply();

		if (interaction.options.getSubcommandGroup(false) === 'delete') {
			await executeDelete(interaction);
		} else if (interaction.options.getSubcommand(false) === 'set') {
			await executeSet(interaction);
		} else {
			await interaction.reply('Bonsoir, non - Amir Coach');
		}

		await cleanUp(interaction.guild as Guild);
	}
};