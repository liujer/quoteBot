var Quote = require('../models/quote');
var moment = require('moment');
const quoteFormat = /"(.)*"(\s)*-(\s)*(.)*/; // Matches "<quote>" - <author>

module.exports = {
	name: 'addquote',
	description: 'Adds a quote to database',
	execute(message) {
		if (message.content.match(quoteFormat)) {
			var fullQuote = message.content.trim().split(/-/);
			var quote = fullQuote[0].trim();
			if (quote[0] == "\"" && quote[quote.length - 1] == "\"") {
				quote = quote.substring(1, quote.length - 1);
			}

			var temp = fullQuote[1].trim().split(/\s+/).join(" ");
			var speaker = (temp == "") ? "unknown" : temp;

			var quoteModel = new Quote({
				speaker: speaker,
				quote: quote,
				dateEntered: moment().format('MMM Do YY, h:mm a')
			}); 
			quoteModel.save();
		}
		

	},
};