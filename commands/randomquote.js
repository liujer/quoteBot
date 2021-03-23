var Quote = require("../models/quote");

getRandomQuote = async function(count, author, message) {
    var random = Math.floor(Math.random() * count);
    var params = (author == undefined) ? undefined : {speaker: author};
    await Quote.findOne(params).skip(random).exec(
        function(err, result) {
            if (err) {
                console.log(err);
                return;
            }
            message.channel.send(result["quote"] + " - " + result["speaker"]
                + "\n" + result["dateEntered"]);
        }
    );
};

module.exports = {
    name: "randomquote",
    description: "Gets a random quote based on name",
    async execute(message, args) {
        if(args.length > 1) {
            message.channel.send("Invalid number of parameters.");
        } else {
            const author = (args.length == 0) ? undefined : args[0];
            const params = (args.length == 0) ? undefined : {speaker: author};
            Quote.find(params).countDocuments().exec(
                async function(err, count) {
                if (err) {
                    console.log(err);
                    return;
                }
                if (count == 0) {
                    message.channel.send(author + " has not said any quotes.");
                } else {
                    await getRandomQuote(count, author, message);
                }   
            });

        }
    }
}