// DO NOT EDIT THIS FILE!!!
// DO NOT EDIT THIS FILE!!!
// DO NOT EDIT THIS FILE!!!


const Discord = require('discord.js');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./database/config.json', 'utf8'));
const quest = JSON.parse(fs.readFileSync('./database/questions.json', 'utf8'));
const chalk = require('chalk');
const consoleerror = chalk.bold.red;
const consolewords = chalk.keyword('white');
const consolecommands = chalk.keyword('cyan');
const consolestart = chalk.keyword('red');
const consoleerrcmds = chalk.keyword('yellow');
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./cmds').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./cmds/${file}`);
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.once('ready', () => {
	console.log(consolewords('[INFO]: ') + consolestart('\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\'));
	console.log(consolewords('[INFO]: ') + consolestart('\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\'));
	console.log(consolewords('[INFO]: ') + consolestart('\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\  Starting Ice Discord Bot (Version 1.0)  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\'));
	console.log(consolewords('[INFO]: ') + consolestart('\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\'));
	console.log(consolewords('[INFO]: ') + consolestart('\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\  Made by Zeroknights#9457  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\'));
	console.log(consolewords('[INFO]: ') + consolestart('\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\'));
	console.log(consolewords('[INFO]: ') + consolestart('\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\'));
	console.log(consolewords('[INFO]: ') + consolecommands(`Logged in as ${client.user.tag}`));
});

const activities_list = [
	`${config['bot'].prefix}apply`,
	`${config['bot'].factionname} Application Bot`,
	'Developed by Zeroknights#9457',
];

client.on('ready', () => {
	setInterval(() => {
		const index = Math.floor(Math.random() * (activities_list.length - 1) + 1);
		client.user.setActivity(activities_list[index]);
	}, 10000);
});
client.on('message', message => {
	const prefix = config['bot'].prefix;
	if (!message.content.startsWith(prefix)) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;

	if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply('I can\'t execute that command inside DMs!');
	}

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}`;
		if (command.usage) {
			reply += `\nThe proper usage would be: \`${config['bot'].prefix}${command.name} ${command.usage}\``;
		}
		return message.channel.send(reply);
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(consolewords('[ERROR]: ') + consoleerror(error));
		message.reply('there was an error trying to execute that command!');
	}
});
client.on('message', message => {
	if (message.content == `${config['bot'].prefix}uptime`) {
		const days = Math.floor(client.uptime / 86400000);
		const hours = Math.floor(client.uptime / 3600000) % 24;
		const minutes = Math.floor(client.uptime / 60000) % 60;
		const seconds = Math.floor(client.uptime / 1000) % 60;
		const errorPermEmbed = new Discord.MessageEmbed()
			.setColor('#00FFBF')
			.setDescription(`\`\`🕰️\`\` **${config['server'].name} Discord Bot Uptime**: \`\`${days}\`\`d \`\`${hours}\`\`h \`\`${minutes}\`\`m \`\`${seconds}\`\`s`);
		message.channel.send({ embed: errorPermEmbed });
		console.log(consolewords('[CMD]: ') + consolecommands(`${message.author.username}: ${config['bot'].prefix}uptime`));
	}
});
const userApplications = {};

client.on('message', function(message) {


	if (message.author.equals(client.user)) return;

	const authorId = message.author.id;
	const channelreq = client.channels.cache.get(`${config['channels'].requirementchannel}`);

	if (message.content === `${config['bot'].prefix}apply`) {
		console.log(consolewords('[CMD]: ') + consolecommands(`Apply begin for authorId ${authorId}`));
		if (!(authorId in userApplications)) {
			userApplications[authorId] = { 'step' : 1 };
			const embed1 = new Discord.MessageEmbed()
				.setTitle(`${config['bot'].factionname} Application`)
				.setDescription('Write `Start` to start your application.')
				.setFooter(`${config['bot'].factionname} Discord Bot`)
				.setTimestamp();
			try {
				message.author.send(embed1);
			}
			catch {
				const errorArgsEmbed = new Discord.MessageEmbed()
					.setColor('ORANGE')
					.setTitle(`⛔ Error (${config['bot'].prefix}apply) `)
					.setDescription(`<@${message.author.id}>, you didn't enable dm's!\n\n**ID:** \`\`108\`\`\n**Usage:** \`\`${config['bot'].prefix}apply\`\`\n**Case ID:** \`\`2\`\`\n\n_If you think this is an error report it to an owner_`)
					.setTimestamp()
					.setFooter(`${config['bot'].factionname} Discord Bot`);
				message.channel.send({ embed: errorArgsEmbed });
				console.log(consolewords('[CMD]: ') + consoleerrcmds(`${message.author.username}: Missing Arguments => Error => ID: 108, Case ID: 2`));
				return;
			}
		}
		message.channel.send(`Before applying make sure you read the requirements (${channelreq})! However your application is starting in **1** second(s).`);
		const officalembed = new Discord.MessageEmbed()
			.setTitle(`${config['bot'].factionname} Application`)
			.setDescription('Your application has been started in dm\'s!')
			.setFooter(`${config['bot'].factionname} Discord Bot`)
			.setTimestamp();
		message.channel.send(officalembed);
	}
	else if (message.channel.type === 'dm' && authorId in userApplications) {
		const authorApplication = userApplications[authorId];

		if (authorApplication.step == 1) {
			authorApplication.answer1 = message.content;
			const embed2 = new Discord.MessageEmbed()
				.setDescription(`${quest['questions'].q1}`);
			message.author.send(embed2);
			authorApplication.step++;
		}
		else if (authorApplication.step == 2) {
			authorApplication.answer2 = message.content;
			const embed3 = new Discord.MessageEmbed()
				.setDescription(`${quest['questions'].q2}`);
			message.author.send(embed3);
			authorApplication.step++;
		}
		else if (authorApplication.step == 3) {
			authorApplication.answer3 = message.content;
			const embed4 = new Discord.MessageEmbed()
				.setDescription(`${quest['questions'].q3}`);
			message.author.send(embed4);
			authorApplication.step++;
		}
		else if (authorApplication.step == 4) {
			authorApplication.answer4 = message.content;
			const embed5 = new Discord.MessageEmbed()
				.setDescription(`${quest['questions'].q4}`);
			message.author.send(embed5);
			authorApplication.step++;
		}
		else if (authorApplication.step == 5) {
			authorApplication.answer5 = message.content;
			const embed6 = new Discord.MessageEmbed()
				.setDescription(`${quest['questions'].q5}`);
			message.author.send(embed6);
			authorApplication.step++;
		}
		else if (authorApplication.step == 6) {
			authorApplication.answer6 = message.content;
			const embed7 = new Discord.MessageEmbed()
				.setDescription(`${quest['questions'].q6}`);
			message.author.send(embed7);
			authorApplication.step++;
		}
		else if (authorApplication.step == 7) {
			authorApplication.answer7 = message.content;
			const embed8 = new Discord.MessageEmbed()
				.setDescription(`${quest['questions'].q7}`);
			message.author.send(embed8);
			authorApplication.step++;
		}
		else if (authorApplication.step == 8) {
			authorApplication.answer8 = message.content;
			const embed9 = new Discord.MessageEmbed()
				.setDescription(`${quest['questions'].q8}`);
			message.author.send(embed9);
			authorApplication.step++;
		}
		else if (authorApplication.step == 9) {
			authorApplication.answer9 = message.content;
			const embed10 = new Discord.MessageEmbed()
				.setDescription(`${quest['questions'].q9}`);
			message.author.send(embed10);
			authorApplication.step++;
		}
		else if (authorApplication.step == 10) {
			authorApplication.answer10 = message.content;
			const embed11 = new Discord.MessageEmbed()
				.setDescription(`${quest['questions'].q10}`);
			message.author.send(embed11);
			authorApplication.step++;
		}
		else if (authorApplication.step == 11) {
			authorApplication.answer11 = message.content;
			const embed12 = new Discord.MessageEmbed()
				.setDescription(`${quest['questions'].q11}`);
			message.author.send(embed12);
			authorApplication.step++;
		}
		else if (authorApplication.step == 12) {
			authorApplication.answer12 = message.content;
			const embed13 = new Discord.MessageEmbed()
				.setDescription(`${quest['questions'].q12}`);
			message.author.send(embed13);
			authorApplication.step++;
		}
		else if (authorApplication.step == 13) {
			authorApplication.answer13 = message.content;
			const embed14 = new Discord.MessageEmbed()
				.setDescription(`${quest['questions'].q13}`);
			message.author.send(embed14);
			authorApplication.step++;
		}
		else if (authorApplication.step == 14) {
			authorApplication.answer14 = message.content;
			const embed15 = new Discord.MessageEmbed()
				.setDescription(`${quest['questions'].q14}`);
			message.author.send(embed15);
			authorApplication.step++;
		}
		else if (authorApplication.step == 15) {
			authorApplication.answer15 = message.content;
			const embed16 = new Discord.MessageEmbed()
				.setDescription(`${quest['questions'].q15}`);
			message.author.send(embed16);
			authorApplication.step++;
		}
		else if (authorApplication.step == 16) {
			authorApplication.answer16 = message.content;
			const embed17 = new Discord.MessageEmbed()
				.setDescription(`${quest['questions'].q16}`);
			message.author.send(embed17);
			authorApplication.step++;
		}
		else if (authorApplication.step == 17) {
			authorApplication.answer17 = message.content;
			const embed18 = new Discord.MessageEmbed()
				.setTitle(`${config['bot'].factionname} Application`)
				.setDescription(`Hey \`\`${message.author.username}\`\`,\nyour application has been sent.`)
				.setFooter(`${config['bot'].factionname} Discord Bot`)
				.setTimestamp();
			message.author.send(embed18);

			const applylog = client.channels.cache.get(`${config['channels'].applylog}`);
			const applyembed = new Discord.MessageEmbed()
				.setTitle(`Application ${message.author.username} (${message.author.id})`)
				.addField(`${quest['questions'].q1}`, `\`\`${authorApplication.answer2}\`\``)
				.addField(`${quest['questions'].q2}`, `\`\`${authorApplication.answer3}\`\``)
				.addField(`${quest['questions'].q3}`, `\`\`${authorApplication.answer4}\`\``)
				.addField(`${quest['questions'].q4}`, `\`\`${authorApplication.answer5}\`\``)
				.addField(`${quest['questions'].q5}`, `\`\`${authorApplication.answer6}\`\``)
				.addField(`${quest['questions'].q6}`, `\`\`${authorApplication.answer7}\`\``)
				.addField(`${quest['questions'].q7}`, `\`\`${authorApplication.answer8}\`\``)
				.addField(`${quest['questions'].q8}`, `\`\`${authorApplication.answer9}\`\``)
				.addField(`${quest['questions'].q9}`, `\`\`${authorApplication.answer10}\`\``)
				.addField(`${quest['questions'].q10}`, `\`\`${authorApplication.answer11}\`\``)
				.addField(`${quest['questions'].q11}`, `\`\`${authorApplication.answer12}\`\``)
				.addField(`${quest['questions'].q12}`, `\`\`${authorApplication.answer13}\`\``)
				.addField(`${quest['questions'].q13}`, `\`\`${authorApplication.answer14}\`\``)
				.addField(`${quest['questions'].q14}`, `\`\`${authorApplication.answer15}\`\``)
				.addField(`${quest['questions'].q15}`, `\`\`${authorApplication.answer16}\`\``)
				.addField(`${quest['questions'].q16}`, `\`\`${authorApplication.answer17}\`\``)
				.setTimestamp()
				.setFooter(`${config['bot'].factionname} Discord Bot | Made by Zeroknights#9457`);
			applylog.send(applyembed);
			delete userApplications[authorId];
		}
	}
});

client.login(`${config['bot'].token}`);
