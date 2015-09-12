if (window.location.hostname !== 'localhost') {
    // track visit if not serving locally
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-50290926-1', 'jeremenichelli.github.io');
    ga('send', 'pageview');
} else {
    console.log('Serving locally. Google Analytics is not tracking.');
};
