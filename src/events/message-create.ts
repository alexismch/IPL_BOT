import {Message, MessageMentions} from 'discord.js';
import {client} from '../index';

const mentionsMe = (mentions: MessageMentions): boolean => Boolean(mentions.users.get(client.application?.id || ''));

export const messageCreateHandler = async (message: Message) => {
	try {
		if (message.author.bot) {
			return;
		}

		if (mentionsMe(message.mentions)) {
			await message.reply('Ptdr t ki');
		}
	} catch (e) {
		console.log('---');
		console.log(`messageCreateHandler error ${message.id} ${message.content}`);
		console.log(e);
		console.log('---');
	}
};