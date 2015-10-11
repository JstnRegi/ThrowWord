var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/catchphrase");

module.exports.CatchPhrase = require("./phrases.js")
module.exports.User = require("./users.js")