import {Collection, CommandInteraction} from 'discord.js';
import fs from 'fs';
import path from 'path';

const commandsDirPath: string = path.join(__dirname, '/../commands');
const commandFiles = fs.readdirSync(commandsDirPath).filter(file => file.endsWith('.js'));

type CommandsAdapter = {
	init(): void,
	add(command: any): void,
	get(): any
}

let commandsCollection: Collection<string, { execute(interaction: CommandInteraction): Promise<void> }>;
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

let commandsArray: any[];
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

const getCommands = (collectionType: CommandsCollections): Collection<string, { execute(interaction: CommandInteraction): Promise<void> }> | any[] => {
	const commands: CommandsAdapter = commandsCollections[collectionType];
	commands.init();
	for (const file of commandFiles) {
		const command = require(`${commandsDirPath}/${file}`);
		commands.add(command);
	}
	return commands.get();
};

const getCommandsArray = (): any[] => getCommands('ARRAY') as any [];
const getCommandsCollection = (): Collection<string, { execute(interaction: CommandInteraction): Promise<void> }> =>
	getCommands('COLLECTION') as Collection<string, { execute(interaction: CommandInteraction): Promise<void> }>;

export {
	getCommands,
	getCommandsArray,
	getCommandsCollection
};