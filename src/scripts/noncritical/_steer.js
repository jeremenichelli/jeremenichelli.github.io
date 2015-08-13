/*
 * steer - v2.0.2
 * https://github.com/jeremenichelli/steer
 * 2014 (c) Jeremias Menichelli - MIT License
*/

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory;
    } else {
        root.steer = factory();
    }
})(this, function() {
    var y = 0,
        config = {
            events: true,
            up: undefined,
            down: undefined
        },
        direction = 'null',
        oldDirection = 'null',
        root = window;

    /*
     * Binds event on scroll
     * @method
     * @param {function} fn - function to call on scroll
     */
    var _bindScrollEvent = function(fn) {
        if (root.addEventListener) {
            root.addEventListener('scroll', fn, false);
        } else if (root.attachEvent) {
            root.attachEvent('onscroll', fn);
        } else {
            root.onscroll = fn;
        }
    };

    /*
     * Replaces configuration values with custom ones
     * @method
     * @param {object} obj - object containing custom options
     */
    var _setConfigObject = function(obj) {
        // override with custom attributes
        if (typeof obj === 'object') {
            for (var key in config) {
                if (typeof obj[key] !== 'undefined') {
                    config[key] = obj[key];
                }
            }
        }
    };

    /*
     * Calls a function inside a try catch structure
     * @method
     * @param {function} fn - function to call
     * @param {array} args - arguments to use in the function
     */
    var _safeFn = function(fn, args) {
        if (typeof fn === 'function') {
            try {
                fn.apply(null, args);
            } catch (e) {
                console.error(e);
            }
        }
    };

    /*
     * Main function which sets all variables and bind events if needed
     * @method
     * @param {object} configObj - object containing custom options
     */
    var _set = function(configObj) {
        _setConfigObject(configObj);

        if (config.events) {
            _bindScrollEvent(_compareDirection);
        }
    };

    /*
     * Cross browser way to get how much is scrolled
     * @method
     */
    var _getYPosition = function() {
        return root.scrollY || root.pageYOffset || document.documentElement.scrollTop;
    };

    /*
     * Returns direction and updates position variable
     * @method
     */
    var _getDirection = function() {
        var actualPosition = _getYPosition(),
            direction;

        direction = (actualPosition < y) ? 'up' : 'down';

        // updates general position variable
        y = actualPosition;

        return direction;
    };

    /*
     * Compares old and new directions and call specific function
     * @method
     */
    var _compareDirection = function() {
        direction = _getDirection();

        if (direction !== oldDirection) {
            oldDirection = direction;
            _safeFn(config[direction], [ y ]);
        }
    };

    return {
        set: _set,
        trigger: _compareDirection
    };
});