import {CommandInteraction} from 'discord.js';
import {parseRawStringToNumberArray} from '../../../utils';
import {getRawGuildBlockSeries} from '../../../utils';
import {Guild} from 'discord.js';
import {deleteGuildSeriesList} from '../../../utils';

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