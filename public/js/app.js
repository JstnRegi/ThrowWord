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

function renderPhrases(cps) {
    var template = _.template($('#cp-template').html());
    var cpList = cps.map(function(e) {
        return template(e);
    });
    $('#catchphrases').empty();
    $('#catchphrases').append(cpList);
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