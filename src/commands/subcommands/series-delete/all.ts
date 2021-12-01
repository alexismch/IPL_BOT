import {CommandInteraction, Guild} from 'discord.js';
import {deleteGuildSeriesList, getGuildSeries} from '../../../utils/series';

export const execute = async (interaction: CommandInteraction) => {
	const series = await getGuildSeries(interaction.guild as Guild);
	await deleteGuildSeriesList(interaction.guild as Guild, series);

	await interaction.followUp(`<@${interaction.user.id}> has deleted all series for all blocks.`);
};