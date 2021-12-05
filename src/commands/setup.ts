import {SlashCommandBuilder, SlashCommandChannelOption, SlashCommandRoleOption} from '@discordjs/builders';
import {Settings} from '@prisma/client';
import {CommandInteraction, Guild, MessageEmbed} from 'discord.js';
import {adminCommands} from '../events';
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
	isAdmin: true,
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
	async execute(interaction: CommandInteraction & { guild: Guild; }) {
		await interaction.deferReply();

		const {id: settingsId, ...settings} = await prisma.settings.findFirst({
			where: {
				guildId: interaction.guild.id
			}
		}) || {
			id: '000000000000000000000000',
			guildId: interaction.guild.id,
			adminRole: null,
			helpTicketsChannel: null,
			verifiedRole: null
		};
		let adminRoleChanged = false;

		let embed = new MessageEmbed()
			.setColor('#3ba55c')
			.setTitle('Bot settings updated!')
			.setDescription(`<@${interaction.user.id}> has updated the bot settings of the server.`);

		for (let optionKey in options) {
			const option = interaction.options.get(options[optionKey].optionName);
			if (option) {
				let oldValue: string | null = settings[options[optionKey].dbName];
				let textValue: string = option.value as string;
				if (oldValue === textValue) {
					continue;
				} else if (options[optionKey].name === options.ADMIN_ROLE.name) {
					adminRoleChanged = true;
				}
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

		if (!embed.fields.length) {
			embed.addField('No change', ':man_shrugging:');
		} else if (adminRoleChanged) {
			const fullPermissions: any[] = [];

			const commandsNames = adminCommands.reduce((names: string[], command: SlashCommandBuilder) => {
				names.push(command.name);
				return names;
			}, []);
			const commandsCollection = (await interaction.guild.commands.fetch()).filter(command => commandsNames.includes(command.name));
			const commands = commandsCollection.values();

			let command = commands.next().value;
			while (command) {
				fullPermissions.push({
					id: command.id,
					permissions: [
						{
							id: settings.adminRole,
							type: 'ROLE',
							permission: true
						},
						{
							id: interaction.guild.roles.everyone.id,
							type: 'ROLE',
							permission: false
						}
					]
				});
				command = commands.next().value;
			}

			await interaction.guild.commands.permissions.set({fullPermissions});
		}

		return interaction.followUp({
			embeds: [embed]
		});
	}
};