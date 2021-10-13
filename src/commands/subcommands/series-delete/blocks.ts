import {CommandInteraction} from 'discord.js';

export const execute = async (interaction: CommandInteraction) => {
	console.log(interaction.options.get('blocks'));
	const blocks = interaction.options.getString('blocks');
	console.log(blocks);
	await interaction.followUp(`You have deleted all series for blocks ${blocks}`);
};