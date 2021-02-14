var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var serverInfoSchema = new Schema({
    quotesChannelID: {type: String},
});

module.exports = mongoose.model('ServerInfo', serverInfoSchema, 'ServerInfo');