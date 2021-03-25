var Quote = require("../models/quote");
const yes = '✅';
const no = '❌';
var addQuote = require("../commands/addquote");

processChannel = async (message) => {
    await message.channel.messages.fetch({limit: 100})
        .then(messages => {
            var count = 0;
            var result = [];
            messages.forEach((newMessage) => {
                if (message.author.id !== newMessage.author.id) {
                    result.push(addQuote.execute(newMessage)
                    .then(isQuote => {
                        if (isQuote) {
                            count++;
                        }
                    })); 
                }
            });
            Promise.all(result).then(() => {
                message.channel.send("Found " + count + " quotes");
            });
        });
}

// Sends a message to channel asking if user would like to process channel
// callback: executes if user reacts with ✅
continueProcessing = (message, callback) => {
    message.channel.send("Are you sure? This will process the entire channel.")
    .then(async function(message) {
        await message.react(yes);
        await message.react(no);
        const filter = (reaction, user) => {
            return ['✅', '❌'].includes(reaction.emoji.name)
                && user.id !== message.author.id;
        };    
        const collector = message.createReactionCollector(filter, { max: 1, time: 10000});
        var cont = false;
        var authorID;
        collector.on('collect', (reaction, user) => {
            cont = (reaction.emoji.name === yes);
            authorID = "<@" + user.id + ">";
        })
        collector.on('end', collected => {
            if (cont) {
                processChannel(message);
            } else if (authorID !== undefined){
                message.channel.send(authorID + " chose not to process channel.");
            }
        })
    })
}

module.exports = {
    name: "scanchannel",
    description: "Processes messages in a channel to add them to quote database",
    async execute(message, args) {
        await continueProcessing(message);
    }
}