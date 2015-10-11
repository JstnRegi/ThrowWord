//how many seconds the clock has
var seconds1 = 1200;
var seconds2 = 1200;
// for the sake of transition and to keep track when a second has passed to start the animation
var tick = 0;

//keypress values
var yKey = 121;
var nKey = 110;
var enterKey = 13;

//variables that keeps track who who's team it is
var teamTurn = 1;
var colorTicker = 1;

var countdownTimer1;
var countdownTimer2;

var teamOneScore = 0;
var teamTwoScore = 0;

var shuffledWords;

//counter that keeps certain event listeners on and off
var gameStart = 0;


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



    $('#ready-button').on('click', function() {
        $('#score1').addClass('team-turn');
        console.log('click');
        $(this).fadeOut('medium');
            gameStart++;
        $('#instructions').fadeOut(function() {
            countdownTimer1 = setInterval('secondPassed1()', 1000);
            countdownTimer2 = setInterval('secondPassed2()', 1000);

        //appends a word into #word element
        $('#word').append(words[phraseCount]);
        });
            
    });


    //blinker();


    //listens for an event to click play button and scrolls to the "play screen"
    $("#play").click(function() {
        scrollToAnchor('stop-here');
    });
    //makes play button fade in and out
    //playBlinker();
    //signals when the user is hovering over the button to signify it's clickable
    $('#play').hover(function() {
        $('#play').css('background-color', '#E4CB99').css('border', '1px solid black');
    }, function() {
        $('#play').css('background-color', 'rgb(255, 223, 160)').css('border', '');
    })

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
function renderPhrases(cps) {
    //resets the arrays so they dont get overloaded every addition or removal of catchphrase

    //makes the template out of our ul
    var template = _.template($('#cp-template').html());
    var cpList = cps.map(function(e) {
        words.push(e.word);
        return template(e);
    });

    shuffledWords = shuffle(words);

    //empties out the element so it isnt overloaded with catchphrases
    $('#catchphrases').empty();
    //appends he cpList with map
    $('#catchphrases').append(cpList);

    //gets a random number between 0 and the last of the index of the array
    var randomNum = getRandomNum(0, (words.length - 1));

}

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
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

    if(seconds1 === 0) {
        winner();
        $('#score1').css('-webkit-text-stroke-width', '0px');
        $('#score2').css('-webkit-text-stroke-width', '0px');
    }

    if ((seconds1 === 0) && (seconds2 > 0)) {
        winner();
        document.getElementById('countdown1').innerHTML = "Buzz Buzz";
        $('#score1').toggleClass('team-turn');
        $('#score1').css('-webkit-text-stroke-width', '0px');
        $('#score2').toggleClass('team-turn');
        countdownTimer2 = setInterval('secondPassed2()', 1000);
        window.clearInterval(countdownTimer1);
        teamTurn++;

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

    if(seconds2 === 0) {
        winner();
        $('#score1').css('-webkit-text-stroke-width', '0px');
        $('#score2').css('-webkit-text-stroke-width', '0px');
    }

    if ((seconds2 == 0) && (seconds1 > 0)) {
        document.getElementById('countdown2').innerHTML = "Buzz Buzz";
        winner();
        $('#score2').toggleClass('team-turn');
        $('#score2').css('-webkit-text-stroke-width', '0px');
        $('#score1').toggleClass('team-turn');
        countdownTimer1 = setInterval('secondPassed1()', 1000);
        window.clearInterval(countdownTimer2);
        teamTurn++;
        console.log('ran')
    } else {
        seconds2--;
    }
    if(tick === 1) {
        $('#countdown2').toggle('slow', function(){
            window.clearInterval(countdownTimer2);
            teamsTurn();
        });
    }
}

function teamsTurn() {
    var team1Pass = 0;
    var team2Pass = 0;
    $(window).on('keypress', function(e) {
        if(gameStart === 1) {
            if(e.which === enterKey) {
                $('#score1').toggleClass('team-turn');
                if(teamTurn % 2 !== 0) {
                    $('#score1').css('-webkit-text-stroke-width', '0px');
                    countdownTimer2 = setInterval('secondPassed2()', 1000);
                    keepScore('#team-one-score');
                    nextPhrase();
                    window.clearInterval(countdownTimer1);
                    team1Pass = 0;
                }
                $('#right-side-title').toggleClass('team-turn');
                if(teamTurn % 2 === 0) {
                    $('#score2').css('-webkit-text-stroke-width', '0px');
                    countdownTimer1 = setInterval('secondPassed1()', 1000);
                    keepScore('#team-two-score');
                    nextPhrase();
                    window.clearInterval(countdownTimer2);
                    team2Pass = 0;
                }
                if((seconds1 > 0) && (seconds2 > 0)) {
                    teamTurn ++;
                }

            }
            if(e.which === 112) {
                $('#score1').toggleClass('team-turn');
                if(teamTurn % 2 !== 0) {
                    $('#score1').css('-webkit-text-stroke-width', '0px');
                    countdownTimer2 = setInterval('secondPassed2()', 1000);
                    window.clearInterval(countdownTimer1);
                    team1Pass++;
                }
                $('#score2').toggleClass('team-turn');
                if(teamTurn % 2 === 0) {
                    $('#score2').css('-webkit-text-stroke-width', '0px');
                    countdownTimer1 = setInterval('secondPassed1()', 1000);
                    window.clearInterval(countdownTimer2);
                    team2Pass++;
                }
                if(team1Pass === 1 && team2Pass === 1) {
                    nextPhrase();
                    team1Pass = 0;
                    team2Pass = 0;
                }
                //if((seconds1 === 0) || (seconds2 === 0)) {
                //    if(teamOneScore > teamTwoScore) {
                //        alert('Team One won!');
                //    } else {
                //        alert('Team Two won!');
                //    }
                //    window.clearInterval(countdownTimer1);
                //    window.clearInterval(countdownTimer2);
                //}
                if((seconds1 > 0) && (seconds2 > 0)) {
                    teamTurn ++;
                }
            }
        }
    })
}

//Adds an effect around teams turn when it's their turn
function blinker() {
        setInterval(function() {
            colorTicker += 1;
            if (colorTicker % 2 === 0) {
                $('.team-turn').css('-webkit-text-stroke-color', 'yellow').css('-webkit-text-stroke-width', '3px');
            }
            if (colorTicker % 2 !== 0) {
                $('.team-turn').css('-webkit-text-stroke-color', '')
            }
        }, 400)
}

function keepScore(team) {
    $(team).empty();
    if(team === '#team-one-score') {
        teamOneScore += 1;
        $(team).append(teamOneScore);
    }
    if(team === '#team-two-score') {
        teamTwoScore += 1;
        $(team).append(teamTwoScore);
    }
}

function winner() {
    if((seconds1 === 0) && (seconds2 === 0)) {
        if(teamOneScore > teamTwoScore) {
            alert('Team one has won!');
        }
        else if(teamOneScore === teamTwoScore) {
            alert('Game\'s a tie!');
        } else {
            alert('Team two has won!');
        }
        gameStart++;
        window.clearInterval(countdownTimer1);
        window.clearInterval(countdownTimer2);
    }
}

function scrollToAnchor(aid){
    var aTag = $("a[name='"+ aid +"']");
    $('html,body').animate({
        scrollTop: aTag.offset().top},2000);
}

function playBlinker() {
    setInterval(function () {
        $('#play').fadeOut(800);
        $('#play').fadeIn(600);
    }, 500);
}


var phraseCount = 0;
function nextPhrase () {
    phraseCount++;
    $('#word').empty().append(shuffledWords[phraseCount]);
    if(phraseCount === shuffledWords.length) {
        if(teamOneScore > teamTwoScore) {
            alert('Team one has won!');
        }
        else if(teamOneScore === teamTwoScore) {
            alert('Game\'s a tie!');
        } else {
            alert('Team two has won!');
        }
        gameStart++;
        window.clearInterval(countdownTimer1);
        window.clearInterval(countdownTimer2);
    }
}

function 