var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var _ = require('underscore');
var views = path.join(process.cwd(), 'views/');
var db = require('./models');

//test

// CONFIG //
// serve js & css files
app.use("/static", express.static("public"));
app.use("/vendor", express.static("bower_components"));
// body parser config to accept all datatypes
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req,res) {
   res.sendFile(views + 'index.html');
});

app.get('/catchphrases', function(req, res) {
    db.CatchPhrase.find({}, function(err, catchPhrases) {
        if (err) {return console.log(err)}
        res.send(catchPhrases);
    });
});

app.post('/catchphrases', function(req, res) {
    var newCp = req.body;
    db.CatchPhrase.create(newCp, function(err, cp) {
        if(err) {return console.log(err)}
        console.log(cp + ' was posted');
        res.send(cp);
    });

});

app.delete('/catchphrases/:id', function(req, res) {
    var target = req.params.id;
    db.CatchPhrase.remove({_id: target}, function(err, phrase) {
        if(err) {return console.log(err)}
        console.log(phrase + ' has been deleted');
    });
    res.sendStatus(200);
});

app.listen(3000, function() {
    console.log('Listening on port 3000');
});