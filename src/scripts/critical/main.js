(function(_win, _doc) {
    'use strict';

    var host = _win.location.hostname;

    // development flag
    var DEV = (host === 'localhost' || host === '0.0.0.0' || host === '127.0.0.1');

    if (DEV) {
        // clear storage, show store css messages
        _win.sessionStorage.clear();
        _win.store.verbose();
    }

    // stylesheets
    if (_win.PAGE) {
        // page styles
        _win.store.css('/assets/styles/' + PAGE + '.css', {
            storage: 'session'
        });
        // font face styles
        _win.store.css('https://fonts.googleapis.com/css?family=Fira+Sans:400,400italic,700', {
            storage: 'session',
            crossOrigin: 'anonymous'
        });
    }

    // fonts
    if (_win.sessionStorage.getItem('fonts-loaded')) {
        _doc.documentElement.classList.add('fonts-loaded');
    } else {
        var w400 = new FontFaceObserver('Fira Sans', { weight: 400 }),
            w400i = new FontFaceObserver('Fira Sans', { weight: 400, style: 'italic' }),
            w700 = new FontFaceObserver('Fira Sans', { weight: 700 });

        Promise.all([ w400.load(), w400i.load(), w700.load() ])
            .then(function() {
                _doc.documentElement.classList.add('fonts-loaded');
                _win.sessionStorage.setItem('fonts-loaded', true);
            });
    }

    // analytics
    if (!DEV) {
        // track visit when not serving locally
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(_win,_doc,'script','//www.google-analytics.com/analytics.js','ga');

        ga('create', 'UA-50290926-1', 'jeremenichelli.github.io');
        ga('send', 'pageview');
    } else {
        console.log('Serving locally. Google Analytics is not tracking.');
    }
})(window, document);
