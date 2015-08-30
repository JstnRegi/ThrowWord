var db = require('./models');

var catchPhrases = [
    {word: "Tiramisu", definition: "quite"},
    {word: "Green Eggs & Ham", definition: "sure"},
    {word: "aardvark", definition: "depending"},
    {word: "Foie Gras", definition: "omg"},
    {word: "Kale", definition: "meh"}
];

db.CatchPhrase.remove({}, function(err, phrases){
    db.CatchPhrase.create(catchPhrases, function(err, phrases){
        if (err) { return console.log(err); }
        console.log("created", phrases.length, "phrases");
    })
});