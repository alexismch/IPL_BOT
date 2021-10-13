import {CommandInteraction} from 'discord.js';
import {parseRawStringToNumberArray} from '../../utils';

export const execute = async (interaction: CommandInteraction) => {
	const {
		rawString: rawBlocks,
		numbers: blocks
	} = parseRawStringToNumberArray(interaction.options.getString('blocks', true));
	if (blocks === null) {
		return await interaction.followUp('Every block has to be a number.');
	}

	const {
		rawString: rawSeries,
		numbers: series
	} = parseRawStringToNumberArray(interaction.options.getString('series', true));
	if (series === null) {
		return await interaction.followUp('Every series has to be a number.');
	}

	await interaction.followUp(`<@${interaction.user.id}> has set ${rawSeries} series for blocks ${rawBlocks}.`);
};