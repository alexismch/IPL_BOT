import {CommandInteraction} from 'discord.js';
import {parseRawStringToNumberArray} from '../../../utils';
import {getRawGuildBlockSeries} from '../../../utils';
import {Guild} from 'discord.js';
import {deleteGuildSeries} from '../../../utils';
import {deleteSeries} from '../../../utils';

export const execute = async (interaction: CommandInteraction) => {
	const {
		rawString: rawBlocks,
		numbers: blocks
	} = parseRawStringToNumberArray(interaction.options.getString('blocks', true));
	if (blocks === null) {
		return await interaction.followUp('Every block has to be a number.');
	}

	const allSeries = await getRawGuildBlockSeries(interaction.guild as Guild, blocks);

	const toDeleteSeries: string[] = [];

	for (let series of allSeries) {
		const id = await deleteGuildSeries(interaction.guild as Guild, series);
		toDeleteSeries.push(id);
	}

	await deleteSeries(toDeleteSeries);

	await interaction.followUp(`<@${interaction.user.id}> has deleted all series for blocks ${rawBlocks}.`);
};