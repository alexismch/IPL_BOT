import {CommandInteraction} from 'discord.js';
import {SlashCommandUserOption} from '@discordjs/builders';
import {Message} from 'discord.js';
import {SlashCommandBuilder} from '@discordjs/builders';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fart')
		.setDescription('Replies with PROUUUT...')
		.addUserOption(
			(option: SlashCommandUserOption) =>
				option
					.setName('target')
					.setDescription('The user to fart on')
		),
	async execute(interaction: CommandInteraction) {
		let replyTo: CommandInteraction | Message = interaction;
		const target = interaction.options.get('target');
		if (target) {
			replyTo = await interaction.reply({
				content: `<@${interaction.user.id}> farted on <@${target.value}>`,
				fetchReply: true
			}) as Message;
		}
		return replyTo.reply('PROUUUT...');
	}
};