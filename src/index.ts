require('dotenv').config();

import {PrismaClient} from '@prisma/client';
import {Client} from 'discord.js';
import {
	guildCreateHandler,
	guildDeleteHandler,
	guildMemberAddHandler,
	guildMemberRemoveHandler,
	interactionCreateHandler,
	messageCreateHandler,
	readyHandler
} from './events';
import {clientIntents, clientPartials} from './utils';

const express = require('express');
export const prisma = new PrismaClient();

export const client: Client = new Client({
	intents: clientIntents,
	partials: clientPartials
});

client.on('ready', readyHandler);

client.on('guildCreate', guildCreateHandler);

client.on('guildDelete', guildDeleteHandler);

client.on('interactionCreate', interactionCreateHandler);

client.on('guildMemberAdd', guildMemberAddHandler);

client.on('guildMemberRemove', guildMemberRemoveHandler);

client.on('messageCreate', messageCreateHandler);

express()
	.listen(
		process.env.PORT || 5000,
		() => {
			prisma
				.$connect()
				.then(() => {
					client
						.login(process.env.DISCORD_TOKEN)
						.catch(console.error);
				})
				.catch(console.error);
		}
	);