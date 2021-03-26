var addQuote = require("../commands/addquote");
const yes = '✅';
const no = '❌';

fetchMessages = (message, options) => {
    return new Promise((resolve, reject) => {
        message.channel.messages.fetch(options)
        .then(messages => {
            var totalCount = 0;
            var quoteCount = 0;
            var result = [];
            messages.forEach((newMessage) => {
                if (message.author.id !== newMessage.author.id) {
                    result.push(addQuote.execute(newMessage)
                    .then(isQuote => {
                        if (isQuote) {
                            quoteCount++;
                        }
                    })); 
                }
                totalCount++;
            });
            Promise.all(result).then(() => {
                resolve([totalCount, quoteCount, messages.last().id]);
            });
        });
    })
    
} 

processChannel = async (message, limit) => {
    const options = {limit: 100};
    if (limit === undefined) {
        await fetchMessages(message, options)
            .then((args) => {
                const numProcessed = args[0];
                const quoteCount = args[1];
                message.channel.send("Processed " + numProcessed + " messages and found " 
                    + quoteCount + " quotes");
            })
    } else {
        let numProcessed = 0;
        let quotesAdded = 0;
        let lastID;
        while (numProcessed < limit) {
            if (lastID) {
                options.before = lastID;
            }
            const cont = await fetchMessages(message, options)
                .then(results => { 
                    const tempProcessed = results[0];
                    const tempQuotesAdded = results[1];
                    const tempID = results[2];
                    numProcessed += tempProcessed;
                    quotesAdded += tempQuotesAdded;
                    lastID = tempID;
                    return (tempProcessed != 100);
                })
            if (cont || numProcessed >= limit) {
                break;
            }
        }
        message.channel.send("Processed " + numProcessed + " messages and found " + quotesAdded + " quotes");
    }


}

// Sends a message to channel asking if user would like to process channel
// callback: executes if user reacts with ✅ 
continueProcessing = (message, limit) => {
    message.channel.send("Are you sure? This will process " + limit + " messages.")
    .then(async function(message) {
        await message.react(yes);
        await message.react(no);
        const filter = (reaction, user) => {
            return [yes, no].includes(reaction.emoji.name)
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
                processChannel(message, limit);
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
        if (isNaN(args[0])) {
            if (args[0] <= 0) {
                message.channel.send("Invalid number of messages to scan.");
            } else {
                await continueProcessing(message);
            }
        } else {
            const limit = args[0];
            await continueProcessing(message, limit);
        }
        
    }
}