(function(root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(function() {
            return factory();
        });
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.store = factory();
    }
})(this, function() {
    'use strict';

    var script = document.getElementsByTagName('script')[0],
        verbose = false;

    /*
     * Logs message only if verbose is enabled
     * @method _log
     */
    function _log() {
        if (verbose && console) {
            console.log.apply(console, arguments);
        }
    }

    /*
     * Method that is called when a stylesheet is loaded
     * @method _onload
     * @params {Object} config
     */
    function _onload(config) {
        this.onload = null;
        this.media = config.media ? config.media : 'all';

        _log(this.href, 'stylesheet loaded asynchronously');

        try {
            var rules = this.sheet ? this.sheet.cssRules : this.styleSheet.rules,
                len = rules.length,
                ssContent = '';

            for (var i = 0; i < len; i++) {
                ssContent += rules[i].cssText;
            }

            // wrap rules with @media statement if necessary
            if (config.media) {
                ssContent = '@media ' + config.media + '{' + ssContent + '}';
            }

            // if storage option is present, save for later visits
            if (config.storage) {
                window[ config.storage + 'Storage' ].setItem(this.href, ssContent);
            }
        } catch (e) {
            _log('Stylesheet could not be saved for future visits', e);
        }
    }

    /*
     * Loads stylesheet asynchronously or retrieves it from web storage
     * @method _storeCSS
     * @params {String} href
     * @params {Object} options
     */
    function storeCSS(href, options) {
        var l = document.createElement('link'),
            config = typeof options === 'undefined' ? {} : options,
            ref = config.ref ? config.ref : script,
            stored = null;

        // create link element to extract correct href path
        l.rel = 'stylesheet';
        l.href = href;

        /*
         * Detect stored stylesheet content only when storage option is present
         * and expose an error in console in case web storage is not supported
         */
        if (config.storage) {
            try {
                stored = window[ config.storage + 'Storage' ].getItem(l.href);
            } catch (e) {
                _log('Stylesheet could not be retrieved from ' + config.storage + 'Storage', e);
            }
        }

        /*
         * if stylesheet is in web storage inject a style tag with its
         * content, else load it using a link tag
         */
        if (stored) {
            l = null;

            var s = document.createElement('style');

            s.textContent = stored;
            ref.parentNode.insertBefore(s, ref);

            _log(href, 'stylesheet loaded from ' + config.storage + 'Storage');
        } else {
            /*
             * Filament Group approach to prevent stylesheet to block rendering
             * https://github.com/filamentgroup/loadCSS/blob/master/src/loadCSS.js#L26
             */
            l.media = 'only x';

            /*
             * Add crossOrigin attribute for external stylesheets, take in count this
             * attribute is not widely supported. In those cases CSS rules will not be
             * saved in web storage but stylesheet will be loaded
             */
            if (config.crossOrigin) {
                l.crossOrigin = config.crossOrigin;
            }

            l.onload = _onload.bind(l, config);

            /*
             * Node insert approach taken from Paul Irish's 'Surefire DOM Element Insertion'
             * http://www.paulirish.com/2011/surefire-dom-element-insertion/
             */
            ref.parentNode.insertBefore(l, ref);
        }
    }

    /*
     * Turn on console logs
     * @method enableVerbose
     */
    function enableVerbose() {
        verbose = true;
    }

    return {
        css: storeCSS,
        verbose: enableVerbose
    };
});
