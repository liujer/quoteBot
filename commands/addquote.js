var Quote = require('../models/quote');
var moment = require('moment');

module.exports = {
	name: 'addquote',
	description: 'Adds a quote to database',
	execute(message) {
		var fullQuote = message.content.trim().split(/-/);
		var quote = fullQuote[0].trim();
		if (quote[0] == "\"" && quote[quote.length - 1] == "\"") {
			quote = quote.substring(1, quote.length - 1);
		}

		var speaker = "unknown";
		if (fullQuote.length > 1) {
			speaker = fullQuote[1].trim();
		}
		var quoteModel = new Quote({
			speaker: speaker,
			quote: quote,
			dateEntered: moment().format('MMM Do YY, h:mm a')
		}); 
		quoteModel.save();

	},
};