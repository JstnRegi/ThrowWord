$(function() {
    pageLoad();
    $('.row .btn').on('click', function(e) {
        e.preventDefault();
        var $this = $(this);
        var $collapse = $this.closest('.collapse-group').find('.collapse');
        $collapse.collapse('toggle');
    });
    $('#catchphrases').on('change', function() {
        $('#catchphrases').css('overflow-y', 'scroll')
    });
});

function pageLoad() {
    //load phrases
    getPhrases();
    //add new phrase
    addPhrase();
}

function getPhrases() {
    $.ajax({
        url: '/catchphrases',
        type: 'GET'
    }).done(function(req) {
        var catchphrases = req;
        renderPhrases(req);
    });
}

var words = [];
var definitions = [];
function renderPhrases(cps) {
    //resets the arrays so they dont get overloaded every addition or removal of catchphrase
    words = [];
    definitions = [];

    //makes the template out of our ul
    var template = _.template($('#cp-template').html());
    var cpList = cps.map(function(e) {
        words.push(e.word);
        return template(e);
    });

    //empties out the element so it isnt overloaded with catchphrases
    $('#catchphrases').empty();
    //appends he cpList with map
    $('#catchphrases').append(cpList);

    //gets a random number between 0 and the last of the index of the array
    var randomNum = getRandomNum(0, (words.length - 1));

    //appends a word into #word element
    $('#word').append(words[randomNum]);
}

function addPhrase() {
    $('#new-phrase-form').on('submit', function(e) {
        e.preventDefault();
        var newCp = $(this).serialize();
        $.ajax({
            url: '/catchphrases',
            type: 'POST',
            data: newCp
        }).done(function() {
            $('#new-phrase-form')[0].reset();
            getPhrases();
            });
        });
}

function deletePhrase(context) {
    var phraseId = $(context).data().id;
    $.ajax({
        url: '/catchphrases/' + phraseId,
        type: 'DELETE'
    }).done(function(req,res) {
        getPhrases();
    })
}

function toggleDefinition() {
    console.log('toggled')
}

function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}