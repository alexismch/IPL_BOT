import {SlashCommandBuilder} from '@discordjs/builders';
import {Collection, CommandInteraction, Permissions} from 'discord.js';
import fs from 'fs';
import path from 'path';

const commandsDirPath: string = path.join(__dirname, '/../commands');
const commandFiles = fs.readdirSync(commandsDirPath).filter(file => file.endsWith('.js'));

type CommandsAdapter = {
	init(): void,
	add(command: any): void,
	get(): any
}

export type Command = {
	isAdmin?: boolean,
	data: SlashCommandBuilder,
	execute(interaction: CommandInteraction): Promise<void>
}

let commandsCollection: Collection<string, Command>;
const commandsCollectionAdapter: CommandsAdapter = {
	add(command: any): void {
		commandsCollection.set(command.data.name, command);
	},
	get(): Collection<string, { execute(interaction: CommandInteraction): Promise<void> }> {
		return commandsCollection;
	},
	init(): void {
		commandsCollection = new Collection();
	}
};

let commandsArray: Command[];
const commandsArrayAdapter: CommandsAdapter = {
	add(command: any): void {
		commandsArray.push(command.data.toJSON());
	},
	get(): any[] {
		return commandsArray;
	},
	init(): void {
		commandsArray = [];
	}
};

type CommandsCollections = 'COLLECTION' | 'ARRAY';
const commandsCollections: {
	[collectionName: string]: CommandsAdapter
} = {
	COLLECTION: commandsCollectionAdapter,
	ARRAY: commandsArrayAdapter
};

type getCommandsOptions = {
	isAdmin?: boolean
}

const getCommands = (collectionType: CommandsCollections, options?: getCommandsOptions): Collection<string, Command> | Command[] => {
	const commands: CommandsAdapter = commandsCollections[collectionType];
	commands.init();
	for (const file of commandFiles) {
		const command = require(`${commandsDirPath}/${file}`);
		if (options?.isAdmin != undefined) {
			const isAdmin = command.isAdmin || false;
			if (options.isAdmin === isAdmin) {
				commands.add(command);
			}
		} else {
			commands.add(command);
		}
	}
	return commands.get();
};

const getCommandsArray = (options?: getCommandsOptions): Command[] => getCommands('ARRAY', options) as any [];
const getCommandsCollection = (options?: getCommandsOptions): Collection<string, Command> =>
	getCommands('COLLECTION', options) as Collection<string, Command>;

const memberHasPermission = async (interaction: CommandInteraction): Promise<boolean> => {
	try {
		const commandPermissions = interaction.command?.permissions
			|| (await interaction.guild?.commands.fetch(interaction.commandId))?.permissions;
		const commandsHasPermissions = Boolean(await commandPermissions?.fetch({}));
		return (commandsHasPermissions)
			|| (interaction.member?.permissions as Permissions).has(Permissions.FLAGS.ADMINISTRATOR);
	} catch (e) {
		return (interaction.member?.permissions as Permissions).has(Permissions.FLAGS.ADMINISTRATOR);
	}
};

export {
	getCommands,
	getCommandsArray,
	getCommandsCollection,
	memberHasPermission
};