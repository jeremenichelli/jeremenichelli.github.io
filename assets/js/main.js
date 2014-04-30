// Classing.js
// fallback for browser that don't support classList
// by Jeremias Menichelli - https://github.com/jeremenichelli
(function(){
	'use strict';
	// Object to prototype
	var els = (typeof HTMLElement !== "undefined") ? HTMLElement : Element;

	// Given an element, converts classes into an array
	var _classToArray = function(el){
		return el.className.split(/\s/);
	}
	// Given an array, returns a string
	var _arrayToClass = function(cs){
		return cs.join(" ")
	}
	// Checks if an element has a class
	var _hasClass = function(el, c){
		var cs = _classToArray(el);
		var flag = false;
		for (var i = 0; i < cs.length; i++) {
			if(cs[i] == c) flag = true;
		};
		return flag
	}
	// Adds a class (if there's not already there)
	var _addClass = function(el, c){
		if(!_hasClass(el, c)){
			var nc = el.className+" "+c;
			el.className = nc;
		}
	}
	// Removes a class (if it's there)
	var _removeClass = function(el, c){
		if(_hasClass(el, c)){
			var cs = _classToArray(el);
			for (var i = 0; i < cs.length; i++) {
				if(cs[i] == c){
					cs.splice(i,1);
				}
			};
			el.className = _arrayToClass(cs);
		}
	}
	// Toggles a class in an element
	var _toggleClass = function(el, c){
		_hasClass(el, c) ? _removeClass(el, c) : _addClass(el, c);
	}
	
	if(document.documentElement.classList){
		els.prototype.hasClass = function(c){
			return this.classList.contains(c);
		}

		els.prototype.addClass = function(c){
			this.classList.add(c);
		}

		els.prototype.removeClass = function(c){
			this.classList.remove(c);
		}

		els.prototype.toggleClass = function(c){
			this.classList.toggle(c)
		}
	} else {
		els.prototype.hasClass = function(c){
			return _hasClass(this, c);
		}

		els.prototype.addClass = function(c){
			_addClass(this, c);
		}

		els.prototype.removeClass = function(c){
			_removeClass(this, c);
		}

		els.prototype.toggleClass = function(c){
			_toggleClass(this, c);
		}
	}
})();

var Site = Site || {};
var body = document.body;

Site.mobileMenu = (function(document){
	var isOpen = false;

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
	}

	return {
		open : _openMenu,
		close : _closeMenu,
		toggle : _toggleMenu
	}
})(document);

Site.preloader = (function(document){
	
	var _remove = function(elem){
		body.addClass('loaded');
		setTimeout(function(){
			elem.remove();
		}, 250);
	}

	return {
		remove : _remove
	}
})(document);

if (document.documentElement && document.documentElement.addEventListener) {
	document.getElementById('mobile-menu-button').addEventListener('click', function(e){
		e.preventDefault();
		Site.mobileMenu.open();
	}, false);

	document.getElementById('page-wrap-overlay').addEventListener('click', function(e){
		e.preventDefault();
		Site.mobileMenu.close();
	}, false);

	document.getElementById('close-mobile-menu').addEventListener('click', function(e){
		e.preventDefault();
		Site.mobileMenu.close();
	}, false);
}

window.onload = function(){
	var loading = document.getElementById('loader-wrap');
	Site.preloader.remove(loading);
}



