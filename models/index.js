var mongoose = require("mongoose");

mongoose.connect(process.env.MONGOLAB_URI ||
                 process.env.MONGOHQ_URL ||
                 "mongodb://localhost/throwWords");

module.exports.CatchPhrase = require("./phrases.js")
// module.exports.User = require("./users.js")