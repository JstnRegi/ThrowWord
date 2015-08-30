var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CatchPhraseSchema = new Schema( {
    word: {
        type: String,
        required: true
    },
    definition: {
        type: String,
        required: true
    }
});

var CatchPhrase = mongoose.model('CatchPhrase', CatchPhraseSchema);

module.exports = CatchPhrase;