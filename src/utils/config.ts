import {BitFieldResolvable, IntentsString, PartialTypes} from 'discord.js';

export const clientIntents: BitFieldResolvable<IntentsString, number> = [
	'GUILDS',
	'GUILD_MEMBERS',
	'GUILD_BANS',
	'GUILD_EMOJIS_AND_STICKERS',
	'GUILD_INTEGRATIONS',
	'GUILD_WEBHOOKS',
	'GUILD_INVITES',
	'GUILD_VOICE_STATES',
	'GUILD_PRESENCES',
	'GUILD_MESSAGES',
	'GUILD_MESSAGE_REACTIONS',
	'GUILD_MESSAGE_TYPING',
	'DIRECT_MESSAGES',
	'DIRECT_MESSAGE_REACTIONS',
	'DIRECT_MESSAGE_TYPING'
];
export const clientPartials: PartialTypes[] = [
	'CHANNEL',
	'GUILD_MEMBER',
	'MESSAGE',
	'REACTION',
	'USER'
];