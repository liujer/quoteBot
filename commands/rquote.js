var Quote = require("../models/quote");

getRandomQuote = async function(count, author, message) {
    var random = Math.floor(Math.random() * count);
    var params = (author == undefined) ? undefined : {speaker: author};

    await Quote(message.guild.id).findOne(params).skip(random).exec(
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
    name: "rquote",
    description: "Gets a random quote based on name",
    async execute(message, args) {


        const author = (args.length == 0) ? undefined : args.join(" ");
        const params = (args.length == 0) ? undefined : {speaker: author};
        Quote(message.guild.id).find(params).countDocuments().exec(
            async function(err, count) {
            if (err) {
                console.log(err);
                return;
            }
            if (count == 0) {
                if (params == undefined && author == undefined) {
                    message.channel.send("No quotes have been recorded yet for anyone.");
                } else {
                    message.channel.send(author + " has not said any quotes.");
                }      
            } else {
                await getRandomQuote(count, author, message);
            }   
        });
    }
}