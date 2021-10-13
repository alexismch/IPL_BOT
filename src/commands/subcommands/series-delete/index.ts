import {CommandInteraction} from 'discord.js';
import {execute as executeAll} from './all';
import {execute as executeBlocks} from './blocks';

export const execute = async (interaction: CommandInteraction) => {
	switch (interaction.options.getSubcommand()) {
		case 'all':
			await executeAll(interaction);
			break;
		case 'blocks':
			await executeBlocks(interaction);
	}
};