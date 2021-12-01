import {CategoryChannel, CommandInteraction, Guild} from 'discord.js';
import {
	createGuildBlockSeries,
	createSeries,
	deleteGuildSeries,
	deleteSeries,
	getGuildBlocksSeries,
	getGuildTextCategory,
	getGuildVoiceCategory,
	parseRawStringToNumberArray
} from '../../utils';

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

	const textCat: CategoryChannel = await getGuildTextCategory(interaction.guild as Guild);
	const voiceCat: CategoryChannel = await getGuildVoiceCategory(interaction.guild as Guild);

	const blocksSeries = await getGuildBlocksSeries(interaction.guild as Guild, blocks);

	const newSeries = [];
	const toDeleteSeries: string[] = [];

	for (let i = 0; i < blocks.length; i++) {
		const askedBlock = blocks[i];
		const askedSeriesAmount = series[i];
		const currentSeries = blocksSeries[askedBlock] || {};
		const currentSeriesAmount = Object.keys(currentSeries).length;
		const min = askedSeriesAmount > currentSeriesAmount ? currentSeriesAmount + 1 : 1;
		const max = askedSeriesAmount > currentSeriesAmount ? askedSeriesAmount : currentSeriesAmount;

		for (let seriesNumber = min; seriesNumber <= max; seriesNumber++) {
			if (!currentSeries[seriesNumber]) {
				const series = await createGuildBlockSeries(interaction.guild as Guild,
					askedBlock,
					seriesNumber,
					{
						voice: voiceCat,
						text: textCat
					});
				newSeries.push(series);
			} else if (seriesNumber > askedSeriesAmount) {
				const id = await deleteGuildSeries(interaction.guild as Guild, currentSeries[seriesNumber]);
				toDeleteSeries.push(id);
			}
		}
	}

	await createSeries(newSeries);
	await deleteSeries(toDeleteSeries);

	await interaction.followUp(`<@${interaction.user.id}> has set ${rawSeries} series for blocks ${rawBlocks}.`);
};