var Quote = require('../models/quote');
var moment = require('moment');
const quoteFormat = /"(.)*"(\s)*-(\s)*(.)*/; // Matches "<quote>" - <author>

module.exports = {
	name: 'addquote',
	description: 'Adds a quote to database',
	async execute(message) {
		if (message.content.match(quoteFormat)) {
			var fullQuote = message.content.trim().split(/-/);
			var quote = fullQuote[0].trim();
			
			var temp = fullQuote[1].trim().split(/\s+/).join(" ")
			var speaker = (temp == "") ? "unknown" : temp; // Format author in case excess whitespace

			var time = moment(message.createdAt).format('MMM Do YY, h:mm a');

			var count = await Quote.find({ 
				speaker: speaker, 
				quote: quote, 
				dateEntered: time
			}).count();
			if (count == 0) {
				var quoteModel = new Quote({
					speaker: speaker,
					quote: quote,
					dateEntered: time
				}); 
				quoteModel.save();
			}
			
		}
		

	},
};