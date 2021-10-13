import {Message} from 'discord.js';
import {MessageMentions} from 'discord.js';
import {client} from '../index';

const mentionsMe = (mentions: MessageMentions): boolean => Boolean(mentions.users.get(client.application?.id || ''));

export const messageCreateHandler = async (message: Message) => {
	if (message.author.bot) {
		return;
	}

	if (mentionsMe(message.mentions)) {
		await message.reply('Ptdr t ki');
	}
};