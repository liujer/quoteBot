var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuoteSchema = new Schema({
    speaker: {type: String},
    quote: {type: String, required: true},
    dateEntered: {type: String}
});

module.exports = function(serverID) {
    return mongoose.model('Quote', QuoteSchema, serverID)
}
