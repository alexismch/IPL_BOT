import {CommandInteraction} from 'discord.js';

export const execute = async (interaction: CommandInteraction) => {
	await interaction.followUp(`<@${interaction.user.id}> has deleted all series for all blocks.`);
};