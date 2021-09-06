$(document).ready(function() {
    $('.stylebtn:eq(0)').on('click', function() {
        if ($('input[name=radioName]:checked', '#selectform').val() == 1) {
            window.location.href = "routes/countries.html";
        } else if ($('input[name=radioName]:checked', '#selectform').val() == 2) {
            window.location.href = "routes/language.html";
        } else {
            window.location.href = "routes/category.html";
        }
    })
})