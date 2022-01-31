import {Interaction} from 'discord.js';
import {getCommandsCollection, memberHasPermission} from '../utils';

export const commands = getCommandsCollection();

export const interactionCreateHandler = async (interaction: Interaction) => {
	if (!interaction.isCommand()) {
		return;
	}

	// TODO: verify all command
	const command = commands.get(interaction.commandName);

	if (!command) {
		return;
	}

	try {
		if (command.isAdmin && !(await memberHasPermission(interaction))) {
			return await interaction.reply({
				content: 'You should have the bot Admin Role or admin permission to execute this command.',
				ephemeral: true
			});
		}
		await command.execute(interaction);
	} catch (e) {
		console.log('---');
		console.log(`interactionCreateHandler error ${interaction.id} ${interaction.commandName}`);
		console.log(e);
		console.log('---');
		return interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
	}
};