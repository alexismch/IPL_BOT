import {CommandInteraction} from 'discord.js';

export const execute = async (interaction: CommandInteraction) => {
	const blocks = interaction.options.getString('blocks');
	const series = interaction.options.getString('series');
	await interaction.followUp(`You have set ${series} series for blocks ${blocks}.`);
};