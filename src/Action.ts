import {Message} from 'discord.js';
import {prisma} from './index';
import {CategoryChannel} from 'discord.js';

const Categories = {
	TEXT: 'Salons des séries',
	VOICE: 'Salons vocaux'
};

type Actions = 'SERIES' | 'FART';
const Actions = {
	SERIES: 'SERIES' as Actions,
	FART: 'FART' as Actions
};

abstract class Action {
	constructor(parameters: { [paramName: string]: string }) {
		this._parameters = parameters;
	}

	private _actionName: Actions = Actions.SERIES;

	get actionName(): Actions {
		return this._actionName;
	}

	private _parameters: { [paramName: string]: string };

	get parameters(): { [paramName: string]: string } {
		return this._parameters;
	}

	static getAction(command: string): Action {
		const splitCommand: string[] = command.split(' ');
		const commandName = splitCommand[1].toUpperCase();
		const rawParameters = splitCommand.slice(2);
		const parameters: { [paramName: string]: string } = {};

		for (let i = 0; i < rawParameters.length; i++) {
			if (rawParameters[i].startsWith('-')) {
				const paramName = rawParameters[i].slice(1);
				parameters[paramName] = rawParameters[i + 1];
			}
		}

		if (commandName === Actions.SERIES) {
			return new SeriesAction(parameters);
		}

		if (commandName === Actions.FART) {
			return new FartAction(parameters);
		}

		throw new Error();
	}

	abstract execute(message: Message): void;
}

class SeriesAction extends Action {
	async execute(message: Message) {
		const askedBlocs: number[] = Object.keys(this.parameters).map((item) => parseInt(item));
		const currentSeries = await prisma.series.findMany({
			where: {
				bloc: {
					in: askedBlocs
				}
			},
			orderBy: {
				seriesNumber: 'asc'
			}
		});

		const channels = message.guild?.channels;
		const textCat: CategoryChannel = (channels?.cache.find(channel => channel.name === Categories.TEXT && channel.type === 'GUILD_CATEGORY') || await channels?.create(Categories.TEXT, {
			type: 'GUILD_CATEGORY'
		})) as CategoryChannel;
		const voiceCat: CategoryChannel = (channels?.cache.find(channel => channel.name === Categories.VOICE && channel.type === 'GUILD_CATEGORY') || await channels?.create(Categories.VOICE, {
			type: 'GUILD_CATEGORY'
		})) as CategoryChannel;

		let addedChannels = 0;
		let deletedChannels = 0;

		for (let askedBloc of askedBlocs) {
			const currentBlocSeries = currentSeries.filter((series) =>
				series.bloc === askedBloc
			);
			const askedSeriesNumber = parseInt(this.parameters[askedBloc]);

			let newSeries: any[] = [];

			for (let seriesNumber = 1; seriesNumber <= askedSeriesNumber; seriesNumber++) {
				if (!currentSeries.find((series) => series.seriesNumber === seriesNumber)) {
					const name = askedBloc + 'i' + seriesNumber;
					const newRole = await message.guild?.roles.create({
						name
					});
					const newTextChannel = await message.guild?.channels.create(name, {
						type: 'GUILD_TEXT',
						parent: textCat
					});
					const newVoiceChannel = await message.guild?.channels.create(name, {
						type: 'GUILD_VOICE',
						parent: voiceCat
					});
					newSeries = [...newSeries, {
						bloc: askedBloc,
						seriesNumber,
						roleId: newRole?.id || '',
						textChannelId: newTextChannel?.id || '',
						voiceChannelId: newVoiceChannel?.id || ''
					}];
					addedChannels += 2;
				}
			}

			if (newSeries.length !== 0) {
				await prisma.series.createMany({
					data: newSeries
				});
			}

			if (askedSeriesNumber < currentBlocSeries.length) {
				let deletedSeries: string[] = [];

				for (let seriesNumber = askedSeriesNumber + 1; seriesNumber <= currentBlocSeries.length; seriesNumber++) {
					const series = currentBlocSeries[seriesNumber - 1];
					deletedSeries = [...deletedSeries, series.id];
					await (await message.guild?.channels.fetch(series.textChannelId))?.delete();
					await (await message.guild?.channels.fetch(series.voiceChannelId))?.delete();
					await (await message.guild?.roles.fetch(series.roleId))?.delete();
					deletedChannels += 2;
				}

				await prisma.series.deleteMany({
					where: {
						id: {
							in: deletedSeries
						}
					}
				});
			}
		}

		if (textCat.children.size === 0) {
			await textCat.delete();
		}
		if (voiceCat.children.size === 0) {
			await voiceCat.delete();
		}

		message.reply(`${addedChannels} channels ajoutés, ${deletedChannels} channels supprimés.`);
	}
}

class FartAction extends Action {
	execute(message: Message): void {
		message.reply('PROUUUUUT...');
	}
}

export default Action;