require('dotenv').config();
const {REST} = require('@discordjs/rest');
const {Routes} = require('discord-api-types/v9');
import {getCommandsArray} from './utils';

const commands = getCommandsArray({isAdmin: false});

const rest = new REST({version: '9'}).setToken(process.env.DISCORD_TOKEN);

rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), {body: commands})
		.then(() => console.log('Successfully registered application commands.'))
		.catch(console.error);