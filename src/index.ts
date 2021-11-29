require('dotenv').config();

import {PrismaClient} from '@prisma/client';
import {Client} from 'discord.js';
import {
	guildMemberAddHandler,
	guildMemberRemoveHandler,
	interactionCreateHandler,
	messageCreateHandler
} from './events';
import {readyHandler} from './events/ready';
import {clientIntents, clientPartials} from './utils';

const prisma = new PrismaClient();

export const client: Client = new Client({
	intents: clientIntents,
	partials: clientPartials
});

client.on('ready', readyHandler);

client.on('interactionCreate', interactionCreateHandler);

client.on('guildMemberAdd', guildMemberAddHandler);

client.on('guildMemberRemove', guildMemberRemoveHandler);

client.on('messageCreate', messageCreateHandler);

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