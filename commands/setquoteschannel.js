var ServerInfo = require('../models/serverInfo');

module.exports = {
    name: "setquoteschannel",
    description: "Sets the quotes channel that bot will keep track of",
    async execute(message, args) {
        var newInfo = new ServerInfo({
            quotesChannelID: message.channel.id,
        });

        ServerInfo.findOne({}, (err, info) => {
            if (err) {
                console.log(err.toString());
                return;
            }
            if (info) {
                info.quotesChannelID = message.channel.id;
                info.save();
            } else {
                newInfo.save();
            }
        });
        await ServerInfo.findOne({}, (err, info) => {
            if(err) return;
            console.log(info.quotesChannelID);
        });
        console.log(message.channel.id);
        message.channel.send('Quotes channel set!');
    }
}