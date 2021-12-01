import {SlashCommandBuilder, SlashCommandChannelOption, SlashCommandRoleOption} from '@discordjs/builders';
import {Settings} from '@prisma/client';
import {CommandInteraction, GuildMemberRoleManager, MessageEmbed, Permissions} from 'discord.js';
import {prisma} from '../index';

const options: {
	[key: string]: {
		name: string,
		optionName: string,
		dbName: Exclude<keyof Settings, 'id' | 'guildId'>
	}
} = {
	ADMIN_ROLE: {
		name: 'Admin Role',
		optionName: 'admin_role',
		dbName: 'adminRole'
	},
	HELP_TICKETS_CHANNEL: {
		name: 'Help Tickets Channel',
		optionName: 'help_tickets_channel',
		dbName: 'helpTicketsChannel'
	},
	VERIFIED_ROLE: {
		name: 'Verified Role',
		optionName: 'verified_role',
		dbName: 'verifiedRole'
	}
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setup')
		.setDescription('Setup the bot settings for the server')
		.addRoleOption((option: SlashCommandRoleOption) =>
			option
				.setName(options.ADMIN_ROLE.optionName)
				.setDescription('The admin role that can use the commands')
		)
		.addChannelOption((option: SlashCommandChannelOption) =>
			option
				.setName(options.HELP_TICKETS_CHANNEL.optionName)
				.setDescription('The channel in which help tickets will be sent')
		)
		.addRoleOption((option: SlashCommandRoleOption) =>
			option
				.setName(options.VERIFIED_ROLE.optionName)
				.setDescription('The role that will be applied to verified people')
		),
	async execute(interaction: CommandInteraction) {
		if (!interaction.guild) {
			return interaction.reply('Command should be used within a server.');
		}

		const {id: settingsId, ...settings} = await prisma.settings.findFirst({
			where: {
				guildId: interaction.guild?.id
			}
		}) || {
			id: '000000000000000000000000',
			guildId: interaction.guild?.id,
			adminRole: null,
			helpTicketsChannel: null,
			verifiedRole: null
		};

		if (!(settings.adminRole && (interaction.member?.roles as GuildMemberRoleManager).resolve(settings.adminRole))
			&& !(interaction.member?.permissions as Permissions).has('ADMINISTRATOR')) {
			return interaction.reply({
				content: 'You should have the bot Admin Role or admin permission to execute this command.',
				ephemeral: true
			});
		}

		let embed = new MessageEmbed()
			.setColor('#3ba55c')
			.setTitle('Bot settings updated!')
			.setDescription(`<@${interaction.user.id}> has update the bot settings of the server.`);

		for (let optionKey in options) {
			const option = interaction.options.get(options[optionKey].optionName);
			if (option) {
				let oldValue: string | null = settings[options[optionKey].dbName];
				let textValue: string = option.value as string;
				settings[options[optionKey].dbName] = textValue;

				switch (option.type) {
					case 'CHANNEL':
						textValue = (oldValue === null ? '__none__' : `<#${oldValue}>`) + ` => <#${textValue}>`;
						break;
					case 'ROLE':
						textValue = (oldValue === null ? '__none__' : `<@&${oldValue}>`) + ` => <@&${textValue}>`;
				}

				embed = embed
					.addField(options[optionKey].name, textValue);
			}
		}

		await prisma.settings.upsert({
			where: {
				id: settingsId
			},
			create: settings,
			update: settings
		});

		return interaction.reply({
			embeds: [embed]
		});
	}
};