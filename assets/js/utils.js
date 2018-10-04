var $$ = document.querySelectorAll.bind(document);

function scrollTo(to, duration) {
    var element = document.documentElement || document.body;

    if (duration <= 0) return;
    var difference = to - element.scrollTop;
    var perTick = difference / duration * 10;

    setTimeout(function () {
        element.scrollTop = element.scrollTop + perTick;
        if (element.scrollTop === to) return;
        scrollTo(to, duration - 10);
    }, 10);
}