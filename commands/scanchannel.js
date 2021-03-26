var addQuote = require("../commands/addquote");
// Reactions for bot asking permission to scan channel
const yes = '✅';
const no = '❌';

/*
    Pluralizes given message.
    
    Returns the message pluralized if the value given is not equal to 1
*/
getPlural = (message, value) => {
    return (value == 1) ? message + '' : message + 's';
}

/*
    Searches messages in message channel based on given options
    to find quotes in the quote format

    Returns a Promise with associative array with following values
    totalCount - total amount of messages processed (max 100)
    quoteCount - total amount of quotes found when fetching
    lastID - last ID of user found in messages fetched
*/
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
                resolve({
                    totalCount : totalCount,
                    quoteCount: quoteCount, 
                    lastID : messages.last().id
                });
            });
        });
    })
    
} 

/*
    Processes a given limit of messages in a channel given by the message.
    After executing, sends a message detailing total quotes found and 
    total messages processed 
*/
processChannel = async (message, limit) => {
    const options = {limit: 100};
    let numProcessed = 0;
    let quotesAdded = 0;
    let lastID;
    while (numProcessed < limit) {
        if (lastID) {
            options.before = lastID;
        }
        if (limit < 100) {
            options.limit = limit;
        }
        const cont = await fetchMessages(message, options)
            .then(results => { 
                const tempProcessed = results['totalCount'];
                const tempQuotesAdded = results['quoteCount'];
                const tempID = results['lastID'];
                numProcessed += tempProcessed;
                quotesAdded += tempQuotesAdded;
                lastID = tempID;
                return (tempProcessed != 100);
            })
        if (cont || numProcessed >= limit) {
            break;
        }
    }
    const stats = getPlural("Processed " + numProcessed + " message", 
        numProcessed) + getPlural(" and found " + quotesAdded + " quote", quotesAdded)+ '.';
    message.channel.send(stats);
}

// Sends a message to channel asking if user would like to process channel
// If proceeded, process channel given a limit on amount of messages to process
continueProcessing = (message, limit) => {
    const newLimit = (limit === undefined) ? 100 : limit;
    message.channel.send(getPlural("Are you sure? This will process " + newLimit + " message", newLimit) + '.')
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
                processChannel(message, newLimit);
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
            await continueProcessing(message);
        } else {
            const limit = args[0];
            if (args[0] <= 0) {
                message.channel.send("Invalid number of messages to scan.");
            } else {
                await continueProcessing(message, limit);
            }  
        }
        
    }
}