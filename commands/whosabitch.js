module.exports = {
	name: 'whosabitch',
	description: 'no',
	execute(message, args) {
		const user = message.author;
		console.log('bitch is running');
		message.channel.send('<@' + message.author.id + '> is a bitch');
	},
};