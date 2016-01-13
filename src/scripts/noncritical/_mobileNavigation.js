(function(_win, _doc) {
    'use strict';

    /*
     * aliasses
     * _win: window global object
     * _doc: document object
     */

    var navButton = _doc.getElementsByClassName('mobile--navigation-button')[0],
        navContainer = _doc.getElementsByClassName('mobile--navigation')[0],
        navOverlay = _doc.getElementsByClassName('mobile--navigation-overlay')[0],
        isOpen = false;

    // open navigation method
    var open = function() {
        navOverlay.style.display = 'block';
        navButton.classList.add('active');
        navContainer.style.height = navContainer.scrollHeight + 'px';
        isOpen = true;

        // add close event on overlay for touch screens
        navOverlay.addEventListener('touchstart', close, false);
    };

    // close navigation method
    var close = function() {
        navOverlay.style.display = 'none';
        navButton.classList.remove('active');
        navContainer.style.height = '0px';
        isOpen = false;

        // remove close event on overlay
        navOverlay.removeEventListener('touchstart', close, false);
    };

    module.exports = {
        toggle: function() {
            if (isOpen) {
                close();
            } else {
                open();
            }
        },
        button: navButton
    };
})(window, document);
