require('dotenv').config();

import {Client} from 'discord.js';
import {PrismaClient} from '@prisma/client';
import {clientPartials} from './utils';
import {clientIntents} from './utils';
import {guildMemberAddHandler} from './events';
//import {guildMemberRemoveHandler} from './events';
import {messageCreateHandler} from './events';
import {interactionCreateHandler} from './events';
import {readyHandler} from './events/ready';

const prisma = new PrismaClient();

export const client: Client = new Client({
	intents: clientIntents,
	partials: clientPartials
});

client.on('ready', readyHandler);

client.on('interactionCreate', interactionCreateHandler);

client.on('guildMemberAdd', guildMemberAddHandler);

//client.on('guildMemberRemove', guildMemberRemoveHandler);

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