import {CommandInteraction, Guild} from 'discord.js';
import {deleteGuildSeriesList, getRawGuildBlockSeries, parseRawStringToNumberArray} from '../../../utils';

export const execute = async (interaction: CommandInteraction) => {
	const {
		rawString: rawBlocks,
		numbers: blocks
	} = parseRawStringToNumberArray(interaction.options.getString('blocks', true));
	if (blocks === null) {
		return await interaction.followUp('Every block has to be a number.');
	}

	const series = await getRawGuildBlockSeries(interaction.guild as Guild, blocks);
	await deleteGuildSeriesList(interaction.guild as Guild, series);

	await interaction.followUp(`<@${interaction.user.id}> has deleted all series for blocks ${rawBlocks}.`);
};