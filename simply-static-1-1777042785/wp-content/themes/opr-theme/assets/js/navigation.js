document.addEventListener('DOMContentLoaded', function() {
    var toggle = document.getElementById('opr-nav-toggle');
    var links = document.getElementById('opr-nav-links');
    if (toggle && links) {
        toggle.addEventListener('click', function() {
            links.classList.toggle('open');
        });
    }
});
