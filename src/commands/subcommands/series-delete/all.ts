import {CommandInteraction} from 'discord.js';
import {getGuildSeries} from '../../../utils/series';
import {Guild} from 'discord.js';
import {deleteGuildSeries} from '../../../utils/series';
import {deleteSeries} from '../../../utils/series';

export const execute = async (interaction: CommandInteraction) => {
	const allSeries = await getGuildSeries(interaction.guild as Guild);

	const toDeleteSeries: string[] = [];

	for (let series of allSeries) {
		const id = await deleteGuildSeries(interaction.guild as Guild, series);
		toDeleteSeries.push(id);
	}

	await deleteSeries(toDeleteSeries);

	await interaction.followUp(`<@${interaction.user.id}> has deleted all series for all blocks.`);
};