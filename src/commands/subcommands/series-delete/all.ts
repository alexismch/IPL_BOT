import {CommandInteraction} from 'discord.js';

export const execute = async (interaction: CommandInteraction) => {
	await interaction.followUp('You have deleted all series for all blocks.');
};