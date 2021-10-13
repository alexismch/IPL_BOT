require('dotenv').config();
import {Client} from 'discord.js';
import {PrismaClient} from '@prisma/client';
import {clientPartials} from './utils';
import {clientIntents} from './utils';
import {GuildMember} from 'discord.js';
import {handleGuildMemberAdd} from './events';
import {handleGuildMemberRemove} from './events';
import {Message} from 'discord.js';
import {MessageMentions} from 'discord.js';
import {getCommandsCollection} from './utils';

const prisma = new PrismaClient();

const client: Client = new Client({
	intents: clientIntents,
	partials: clientPartials
});

const commands = getCommandsCollection();

const mentionsMe = (mentions: MessageMentions): boolean => Boolean(mentions.users.get(client.application?.id || ''));

client.on('ready', () => {
	console.log('Bot ready to fight!');
	client.user?.setPresence({
		afk: true,
		activities: [{name: 'CS:GO', type: 'PLAYING'}],
		status: 'online'
	});
});

client.on('interactionCreate', async (interaction) => {
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
});

client.on('guildMemberAdd', (guildMember: GuildMember) => {
	handleGuildMemberAdd(guildMember);
});

client.on('guildMemberRemove', (guildMember) => {
	handleGuildMemberRemove(guildMember);
});

client.on('messageCreate', (message: Message) => {
	if (message.author.bot) {
		return;
	}

	if (mentionsMe(message.mentions)) {
		message.reply('Ptdr t ki');
	}
});

prisma
	.$connect()
	.then(() => {
		client
			.login(process.env.DISCORD_TOKEN)
			.catch(console.error);
	})
	.catch(console.error);

export {
	prisma
};