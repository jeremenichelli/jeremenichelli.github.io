window.DEV = true;
(function(_win, _doc) {
    "use strict";
    if (_win.FONTS_CACHED === true) {
        _win.FONTS_LOADED = Promise.resolve();
    }
    if (_win.PAGE === "home") {
        var IMAGE_LOADED = new Promise(function(resolve) {
            var image = _doc.getElementsByClassName("home__image")[0];
            image.onload = function() {
                image.onload = null;
                resolve();
            };
            image.src = image.dataset.src;
        });
    } else {
        var IMAGE_LOADED = Promise.resolve();
    }
    Promise.all([ IMAGE_LOADED, _win.FONTS_LOADED ]).then(function() {
        requestAnimationFrame(function() {
            _doc.documentElement.classList.add("ready");
        });
    });
    if (_win.PAGE === "post") {
        var headings = _doc.querySelectorAll("h2, h3");
        for (var i = 0, len = headings.length; i < len; i++) {
            var h = headings[i];
            h.innerHTML = '<a href="#' + h.id + '">' + h.textContent + "</a>";
            if (DEV === true) {
                console.log("Link added to heading", "<" + h.tagName.toLowerCase() + ">", h.textContent);
            }
        }
    }
})(window, document);