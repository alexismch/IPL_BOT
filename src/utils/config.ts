import nodemailer from 'nodemailer';
import {BitFieldResolvable} from 'discord.js';
import {IntentsString} from 'discord.js';
import {PartialTypes} from 'discord.js';

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

export const SERVER_ID = '896718286430015518';
export const VERIFIED_ROLE_ID = '897104819246993438';

export const transporter = nodemailer.createTransport({
	host: 'ssl0.ovh.net',
	port: 587,
	secure: false, // true for 465, false for other ports
	auth: {
		user: process.env.MAIL_USER, // generated ethereal user
		pass: process.env.MAIL_PASSWD // generated ethereal password
	}
});

