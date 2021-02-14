const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config.json');
const async = require('async');

var ServerInfo = require('./models/serverInfo');

var mongoose = require('mongoose');
var mongodb = config.mongoDBkey;
mongoose.connect(mongodb, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '));

const PREFIX = ">>";

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/` + file);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
});

client.login(config.discordKey);

client.on('message', message => {
	if(message.author.bot) {
		return;
	}
	if (message.content.substring(0, PREFIX.length) == PREFIX) {
		const args = message.content.slice(PREFIX.length).trim().split(/ +/);
		const command = args.shift().toLowerCase();
	
		try {
			client.commands.get(command).execute(message, args);
		} catch (error) {
			//message.channel.send('Invalid command');
			console.log(error.toString());
		}
	}
	var channelID = "";
	async.series([
		function(callback) {
			ServerInfo.findOne({}, (err, data) => {
				channelID = data.quotesChannelID;
				callback();
			});
		},
		function(callback) {
			if (channelID === message.channel.id) {
				client.commands.get("addquote").execute(message);
			} 
			callback();
		}
	]);
})
