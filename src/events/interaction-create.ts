import {Interaction} from 'discord.js';
import {getCommandsCollection} from '../utils/commands';

const commands = getCommandsCollection();

export const interactionCreateHandler = async (interaction: Interaction) => {
	if (!interaction.isCommand()) {
		return;
	}

	const command = commands.get(interaction.commandName);

	if (!command) {
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		return interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
	}
};