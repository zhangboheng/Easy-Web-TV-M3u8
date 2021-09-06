$(document).ready(function() {
    var init;
    $('.stylebtn:eq(0)').on('click', function() {
        if (init == 1) {
            window.location.href = "routes/countries.html";
        } else if (init == 2) {
            window.location.href = "routes/language.html";
        } else {
            window.location.href = "routes/category.html";
        }
    })
})