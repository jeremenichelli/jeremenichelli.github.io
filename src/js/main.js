(function(document){
    'use strict';
    // Object to prototype
    var els = (typeof HTMLElement !== 'undefined') ? HTMLElement : Element;

    // Given an element, converts classes into an array
    var _classToArray = function(el){
        return el.className.split(/\s/);
    };
    // Checks if an element has a class
    var _hasClass = function(el, c){
        return _classToArray(el).indexOf(c) !== -1;
    };
    // Adds a class (if it's not already there)
    var _addClass = function(el, c){
        if(!_hasClass(el, c)){
            el.className += (el.className === '') ? c : ' ' + c;
        }
    };
    // Removes a class (if it's there)
    var _removeClass = function(el, c){
        if(_hasClass(el, c)){
            var cs = _classToArray(el);
            cs.splice(cs.indexOf(c), 1);
            el.className = cs.join(' ');
        }
    };
    // Toggles a class in an element
    var _toggleClass = function(el, c){
        if(_hasClass(el, c)){
            _removeClass(el, c);
        } else {
            _addClass(el, c);
        }
    };

    if(document.documentElement.classList){
        els.prototype.hasClass = function(c){
            return this.classList.contains(c);
        };

        els.prototype.addClass = function(c){
            this.classList.add(c);
        };

        els.prototype.removeClass = function(c){
            this.classList.remove(c);
        };

        els.prototype.toggleClass = function(c){
            this.classList.toggle(c);
        };
    } else {
        els.prototype.hasClass = function(c){
            return _hasClass(this, c);
        };

        els.prototype.addClass = function(c){
            _addClass(this, c);
        };

        els.prototype.removeClass = function(c){
            _removeClass(this, c);
        };

        els.prototype.toggleClass = function(c){
            _toggleClass(this, c);
        };
    }
})(document);

var Site = Site || {};

Site.mobileMenu = (function(body){
    var isOpen = false,
        menuEvent = 'touchstart';

    var _openMenu = function(){
        body.addClass('mobile-menu-open');
        isOpen = true;
    };

    var _closeMenu = function(){
        body.removeClass('mobile-menu-open');
        isOpen = false;
    };

    var _toggleMenu = function(){
        if (isOpen){
            _closeMenu();
        } else {
            _openMenu();
        }
    };

    var _bindEvents = function(){
        document.getElementById('mobile-menu-button').addEventListener(menuEvent, function(e){
            e.preventDefault();
            _openMenu();
        }, false);

        document.getElementById('page-wrap-overlay').addEventListener(menuEvent, function(e){
            e.preventDefault();
            _closeMenu();
        }, false);

        document.getElementById('close-mobile-menu').addEventListener(menuEvent, function(e){
            e.preventDefault();
            _closeMenu();
        }, false);
    };

    return {
        open : _openMenu,
        close : _closeMenu,
        toggle : _toggleMenu,
        bindEvents : _bindEvents
    };
})(document.body);

// Bind mobile menu events
if(document.documentElement && document.documentElement.addEventListener){
    Site.mobileMenu.bindEvents();
}

window.onload = function(){
    // hack to prevent transitions on load
    document.body.removeClass('preload');
};
