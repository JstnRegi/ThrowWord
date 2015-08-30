var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/catchphrase");

module.exports.CatchPhrase = require("./phrases.js")