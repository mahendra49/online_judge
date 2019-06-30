const mongoose  = require('mongoose');

// mongoose/model here
var Editorial = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Editorial',Editorial);