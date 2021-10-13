import {client} from '../index';

export const readyHandler = () => {
	console.log('Bot ready to fight!');
	client.user?.setPresence({
		afk: true,
		activities: [{name: 'CS:GO', type: 'PLAYING'}],
		status: 'online'
	});
};