$(function() {
    pageLoad();
    var seconds = 180;




});

function pageLoad() {
    //load phrases
    getPhrases();
    //add new phrase
    addPhrase();

    //Makes the element collapsible
    $('#view-throw-words').on('click', function(e) {
        e.preventDefault();
        var $this = $(this);
        var $collapse = $this.closest('.collapse-group').find('.collapse');
        $collapse.collapse('toggle');
    });

    //makes a scroll for the catchphrases so it doesnt take up a lot of room
    $('#catchphrases').on('change', function() {
        $('#catchphrases').css('overflow-y', 'scroll')
    });

    //toggles the definitions off and on
    //toggle definitions on is nested inside toggle off
    toggleDefinitionsOff();

    $('#play-button').on('click', function() {
        console.log('click');
        $('#play-button').fadeOut('medium');
            var countdownTimer = setInterval('secondPassed()', 1000);


    });







}

function getPhrases() {
    $.ajax({
        url: '/catchphrases',
        type: 'GET'
    }).done(function(req) {
        var catchphrases = req;
        renderPhrases(catchphrases);
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

function toggleDefinitionsOff() {
    $('#toggle-definitions').click(function () {
        words.forEach(function(e) {
            $('#' + e).toggle('slow');
        });
        console.log('toggled');
        $('.toggles').toggle();
    });
}

function toggleDefinitionsOn() {
    $('.btn.btn-default.showing').click(function () {
        words.forEach(function(e) {
            $('#' + e).fadeIn('slow');
        });
    });

}

//random num to choose a random word
function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


//how many seconds the clock has
var seconds = 5;
var tick = 0;

function secondPassed() {
    var minutes = Math.round((seconds - 30)/60);
    var remainingSeconds = seconds % 60;
    tick++;

    if (remainingSeconds < 10) {
        remainingSeconds = "0" + remainingSeconds;
    }
    document.getElementById('countdown').innerHTML = minutes + ":" + remainingSeconds;
    if (seconds == 0) {
        document.getElementById('countdown').innerHTML = "Buzz Buzz";
    } else {
        seconds--;
    }
    if(tick === 1) {
        $('#countdown').toggle('slow');
    }
}