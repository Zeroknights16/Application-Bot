// DO NOT EDIT THIS FILE!!!
// DO NOT EDIT THIS FILE!!!
// DO NOT EDIT THIS FILE!!!

const Discord = require('discord.js');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./database/config.json', 'utf8'));
const chalk = require('chalk');
const consolewords = chalk.keyword('white');
const consolecommands = chalk.keyword('cyan');
const consoleerrcmds = chalk.keyword('yellow');

module.exports = {
	name: 'accept',
	description: 'Accept a user\'s applciation',
	cooldown: 5,
	guildOnly: true,
	args: false,
	execute(message, args) {

		const tagUser = message.mentions.users.first();
		const Method = message.guild.roles.cache.get(`${config['roles'].factionrole}`);
		const taggedUser = message.guild.member(message.mentions.users.first());

		if (!tagUser) {
			const errorArgsEmbed = new Discord.MessageEmbed()
				.setColor('ORANGE')
				.setTitle(`⛔ Error (${config['bot'].prefix}accept) `)
				.setDescription(`<@${message.author.id}>, you didn't mention an user!\n\n**ID:** \`\`100\`\`\n**Usage:** \`\`${config['bot'].prefix}accept [@User]\`\`\n**Case ID:** \`\`4\`\`\n\n_If you think this is an error report it to an owner_`)
				.setTimestamp()
				.setFooter(`${config['bot'].factionname} Discord Bot`);
			message.channel.send({ embed: errorArgsEmbed });
			console.log(consolewords('[CMD]: ') + consoleerrcmds(`${message.author.username}: Missing Mention => Error => ID: 100, Case ID: 4`));
			return;
		}
		if (message.member.hasPermission([`${config['permissions'].accept}`])) {
			if (!args[0]) {
				const errorArgsEmbed = new Discord.MessageEmbed()
					.setColor('ORANGE')
					.setTitle(`⛔ Error (${config['bot'].prefix}accept) `)
					.setDescription(`<@${message.author.id}>, you missed some arguments!\n\n**ID:** \`\`100\`\`\n**Usage:** \`\`${config['bot'].prefix}accept [@User]\`\`\n**Case ID:** \`\`2\`\`\n\n_If you think this is an error report it to an owner_`)
					.setTimestamp()
					.setFooter(`${config['bot'].factionname} Discord Bot`);
				message.channel.send({ embed: errorArgsEmbed });
				console.log(consolewords('[CMD]: ') + consoleerrcmds(`${message.author.username}: Missing Arguments => Error => ID: 100, Case ID: 2`));
			}
			if (args[0]) {
				const demotion = new Discord.MessageEmbed()
					.setTitle(`Welcome to ${config['bot'].factionname}!`)
					.setColor('GREEN')
					.setDescription(`Your application has been accepted by \`\`${message.author.username}\`\`.`)
					.setTimestamp()
					.setFooter(`${config['bot'].factionname} Discord Bot`);
				tagUser.send({ embed: demotion });
				taggedUser.roles.add(Method);
				message.channel.send(`**${message.author.username}**, the user has been accepted.`);
				console.log(consolewords('[CMD]: ') + consolecommands(`${message.author.username}: ${config['bot'].prefix}accept ${tagUser.username}`));
			}
		}
		else {
			const errorPermEmbed = new Discord.MessageEmbed()
				.setColor('ORANGE')
				.setTitle(`⛔ Error (${config['bot'].prefix}accept) `)
				.setDescription(`<@${message.author.id}>, you are not allowed to execute this command!\n\n**ID:** \`\`100\`\`\n**Needed Permission:** \`\`${config['permissions'].accept}\`\`\n**Case ID:** 1\n\n_If you think this is an error report it to an owner_`)
				.setTimestamp()
				.setFooter(`${config['bot'].factionname} Discord Bot`);
			message.channel.send({ embed: errorPermEmbed });
			console.log(consolewords('[CMD]: ') + consoleerrcmds(`${message.author.username}: Missing Permission => Error => ID: 100, Case ID: 1`));
		}
	},
};
