var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/throwWords");

module.exports.CatchPhrase = require("./phrases.js")
// module.exports.User = require("./users.js")