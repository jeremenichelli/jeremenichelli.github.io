(function(_win, _doc, SITE) {
    'use strict';

    /*
     * aliasses
     * _win: window global object
     * _doc: document object
     */

    /*
     * Mobile Menu Navigation Controller
     */
    var navButton = _doc.getElementsByClassName('mobile--navigation-button')[0],
        navContainer = _doc.getElementsByClassName('mobile--navigation')[0],
        navOverlay = _doc.getElementsByClassName('mobile--navigation-overlay')[0],
        isOpen;

    SITE.mobileNavigation = {};

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

    // export through SITE global namespace
    SITE.mobileNavigation.toggle = function toggle() {
        if (isOpen) {
            close();
        } else {
            open();
        }
    };

    SITE.mobileNavigation.button = navButton;

})(window, document, window.SITE = window.SITE ? window.SITE : {});
