//how many seconds the clock has
var seconds1 = 90;
var seconds2 = 90;
// for the sake of transition and to keep track when a second has passed to start the animation
var tick = 0;

//keypress values
var yKey = 121;
var nKey = 110;
var enterKey = 13;

//variables that keeps track who who's team it is
var teamTurn = 1;
var colorTicker = 1;

//variables that keep track of score
var team1ThumbsUp = 0;
var team1ThumbsDown = 0;
var team2ThumbsUp = 0;
var team2ThumbsDown = 0;

var countdownTimer1;
var countdownTimer2;

var teamOneScore = 0;
var teamTwoScore = 0;


$(function() {
    pageLoad();

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
        $('#score1').addClass('team-turn');
        console.log('click');
        $('#play-button').fadeOut('medium');
            countdownTimer1 = setInterval('secondPassed1()', 1000);
            countdownTimer2 = setInterval('secondPassed2()', 1000);
    });

    teamsTurn();
    blinker();
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


function secondPassed1() {

    var minutes = Math.round((seconds1 - 30)/60);
    var remainingSeconds = seconds1 % 60;
    tick++;

    if (remainingSeconds < 10) {
        remainingSeconds = "0" + remainingSeconds;
    }
    document.getElementById('countdown1').innerHTML = minutes + ":" + remainingSeconds;
    if (seconds1 == 0) {
        document.getElementById('countdown1').innerHTML = "Buzz Buzz";
    } else {
        seconds1--;
    }
    if(tick === 1) {
        $('#countdown1').toggle('slow');
    }
}

function secondPassed2() {
    console.log('running');
    var minutes = Math.round((seconds2 - 30)/60);
    var remainingSeconds = seconds2 % 60;

    if (remainingSeconds < 10) {
        remainingSeconds = "0" + remainingSeconds;
    }
    document.getElementById('countdown2').innerHTML = minutes + ":" + remainingSeconds;
    if (seconds2 == 0) {
        document.getElementById('countdown2').innerHTML = "Buzz Buzz";
    } else {
        seconds2--;
    }
    if(tick === 1) {
        $('#countdown2').toggle('slow', function(){
            window.clearInterval(countdownTimer2);
        });
    }
}

function teamsTurn() {
    $(window).on('keypress', function(e) {
        if(e.which === enterKey) {
            $('#score1').toggleClass('team-turn');
            if(teamTurn % 2 !== 0) {
                $('#score1').css('-webkit-text-stroke-width', '0px');
                countdownTimer2 = setInterval('secondPassed2()', 1000);
                window.clearInterval(countdownTimer1);
            }
            $('#right-side-title').toggleClass('team-turn');
            if(teamTurn % 2 === 0) {
                $('#right-side-title').css('-webkit-text-stroke-width', '0px');
                countdownTimer1 = setInterval('secondPassed1()', 1000);
                window.clearInterval(countdownTimer2);
            }
            teamTurn ++;
        }
    })
}

//Adds an effect around teams turn when it's their turn
function blinker() {
        setInterval(function() {
            colorTicker += 1;
            if (colorTicker % 2 === 0) {
                $('.team-turn').css('-webkit-text-stroke-color', 'yellow').css('-webkit-text-stroke-width', '1px');
            }
            if (colorTicker % 2 !== 0) {
                $('.team-turn').css('-webkit-text-stroke-color', '')
            }
        }, 400)
}