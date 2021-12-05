import {Guild, MessageEmbed} from 'discord.js';
import {commands} from '../events';
import {Command} from '../utils';

export const adminCommands = commands.reduce((array: any[], command: Command) => {
	if (command.isAdmin) {
		array.push(command.data.toJSON());
	}
	return array;
}, []);

export const guildCreateHandler = async (guild: Guild) => {
	await guild.commands.set(adminCommands);
	const owner = await guild.members.resolve(guild.ownerId);
	const dmChannel = await owner?.createDM();
	dmChannel?.send({
		embeds: [
			new MessageEmbed()
				.setColor('#3ba55c')
				.setTitle('Thanks for adding me!')
				.setDescription(`Don't forget to setup your server settings via the command **/setup** in order to have all features enabled.`)
		]
	});
};