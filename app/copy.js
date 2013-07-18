function copy(str) {
    var sandbox = $('#sandbox').val(str).select();
    document.execCommand('copy');
    sandbox.val('');
}

$("#copy").on('click', function() {
    $.get('prehook.txt', function(content) {
        $("#copy").text("Copied!")
        copy(content)
        setTimeout(function() {
            $("#copy").text("Copy Pre-commit Hook");
        }, 2000)
    })
})

