document.addEventListener('DOMContentLoaded', function() {
    var toggle = document.getElementById('opr-nav-toggle');
    var links = document.getElementById('opr-nav-links');
    if (!toggle || !links) return;
    toggle.setAttribute('aria-controls', 'opr-nav-links');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.addEventListener('click', function() {
        var open = links.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && links.classList.contains('open')) {
            links.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.focus();
        }
    });
});
