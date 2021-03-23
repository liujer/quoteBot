const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config.json');
const async = require('async');

var ServerInfo = require('./models/serverInfo');

// Connect to mongoDB
var mongoose = require('mongoose');
var mongodb = config.mongoDBkey;
mongoose.connect(mongodb, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '));

const PREFIX = ">>"; // Prefix for discord commands

const client = new Discord.Client();
client.commands = new Discord.Collection();

// Process all commands into one array

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
	// Process command based on prefix
	if (message.content.substring(0, PREFIX.length) == PREFIX) {
		const args = message.content.slice(PREFIX.length).trim().split(/ +/);
		const command = args.shift().toLowerCase();
	
		try {
			client.commands.get(command).execute(message, args);
		} catch (error) {
			console.log(error.toString());
		}
	} else { // Store quote if said in assigned channel
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
	}
	
})
