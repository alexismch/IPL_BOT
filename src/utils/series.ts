import {Series} from '@prisma/client';
import {Guild} from 'discord.js';
import {CategoryChannel} from 'discord.js';
import {prisma} from '../index';
import {Permissions} from 'discord.js';
import {Role} from 'discord.js';

type CategoriesTypes = 'TEXT' | 'VOICE';
const CategoriesNames = {
	TEXT: 'Salons des séries',
	VOICE: 'Salons vocaux'
};

export const getGuildCategory = async (guild: Guild, categoryType: CategoriesTypes): Promise<CategoryChannel> => {
	const channels = guild.channels;
	let category: CategoryChannel = (channels?.cache.find(channel =>
		channel.name === CategoriesNames[categoryType]
		&& channel.type === 'GUILD_CATEGORY')) as CategoryChannel;
	if (!category) {
		category = await channels?.create(CategoriesNames[categoryType], {
			type: 'GUILD_CATEGORY'
		});
	}
	return category;
};

export const getGuildTextCategory = (guild: Guild) => getGuildCategory(guild, 'TEXT');
export const getGuildVoiceCategory = (guild: Guild) => getGuildCategory(guild, 'VOICE');

type BlocksSeries = {
	[bock: number]: {
		[series: number]: Series
	}
}

export const getGuildSeries = async (guild: Guild): Promise<Series[]> => {
	return await prisma.series.findMany({
		where: {
			guildId: guild.id
		}
	});
};

export const getRawGuildBlockSeries = async (guild: Guild, blocks: number[]): Promise<Series[]> => {
	return await prisma.series.findMany({
		where: {
			guildId: guild.id,
			block: {
				in: blocks
			}
		},
		orderBy: {
			seriesNumber: 'asc'
		}
	});
};

export const getGuildBlocksSeries = async (guild: Guild, blocks: number[]): Promise<BlocksSeries> => {
	const rawSeries = await getRawGuildBlockSeries(guild, blocks);

	const blocksSeries: BlocksSeries = {};
	for (let series of rawSeries) {
		const blockSeries = blocksSeries[series.block] || {};
		blockSeries[series.seriesNumber] = series;
		blocksSeries[series.block] = blockSeries;
	}
	return blocksSeries;
};

type SeriesCreate = Omit<Series, 'id'> & Partial<Pick<Series, 'id'>>

export const createGuildBlockSeries = async (guild: Guild, block: number, series: number,
																						 categoryChannels: {
																							 text: CategoryChannel,
																							 voice: CategoryChannel
																						 }): Promise<SeriesCreate> => {
	const name = block + 'i' + series;
	const role = await guild.roles.create({
		name
	}) as Role;
	const permissions = [
		{
			id: guild.id,
			deny: [Permissions.FLAGS.VIEW_CHANNEL]
		},
		{
			id: role.id,
			allow: [Permissions.FLAGS.VIEW_CHANNEL]
		}
	];
	const textChannel = await guild.channels.create(name, {
		type: 'GUILD_TEXT',
		parent: categoryChannels.text,
		permissionOverwrites: permissions
	});
	const voiceChannel = await guild.channels.create(name, {
		type: 'GUILD_VOICE',
		parent: categoryChannels.voice,
		permissionOverwrites: permissions
	});

	return {
		guildId: guild.id,
		block,
		seriesNumber: series,
		roleId: role.id,
		textChannelId: textChannel.id,
		voiceChannelId: voiceChannel.id
	};
};

export const deleteGuildSeries = async (guild: Guild, series: Series): Promise<string> => {
	await (await guild.channels.fetch(series.textChannelId))?.delete();
	await (await guild.channels.fetch(series.voiceChannelId))?.delete();
	await (await guild.roles.fetch(series.roleId))?.delete();
	return series.id;
};

export const createSeries = async (series: SeriesCreate[]) => {
	if (series.length > 0) {
		await prisma.series.createMany({
			data: series
		});
	}
};

export const deleteSeries = async (seriesIds: string[]) => {
	if (seriesIds.length > 0) {
		await prisma.series.deleteMany({
			where: {
				id: {
					in: seriesIds
				}
			}
		});
	}
};

export const deleteGuildSeriesList = async (guild: Guild, seriesList: Series[]) => {
	const toDeleteSeries: string[] = [];

	for (let series of seriesList) {
		const id = await deleteGuildSeries(guild, series);
		toDeleteSeries.push(id);
	}

	await deleteSeries(toDeleteSeries);
};

export const cleanUp = async (guild: Guild) => {
	const textCat: CategoryChannel = await getGuildTextCategory(guild as Guild);
	const voiceCat: CategoryChannel = await getGuildVoiceCategory(guild as Guild);

	if (textCat.children.size === 0) {
		await textCat.delete();
	}

	if (voiceCat.children.size === 0) {
		await voiceCat.delete();
	}
};