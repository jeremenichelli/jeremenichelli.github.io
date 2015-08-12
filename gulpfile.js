(function() {
   'use strict';

    /*
     * aliasses
     * gulp: gulp streaming build system
     * $: namespace for gulp plugins
     */
    var gulp = require('gulp'),
        $ = require('gulp-load-plugins')({
                pattern: ['gulp-*', 'gulp.*'],
                scope: [ 'devDependencies' ],
                replaceString: /^gulp(-|\.)/,
                camelize: true
            });

    /*
     * browser list configuration for autoprefixer */
    var browserlist = [ 'Firefox > 30', 'Chrome > 36', 'IE > 8', 'iOS > 6', 'Safari > 6' ];

    /*
     * source and output paths for tasks */
    var paths = {
            styles: {
                noncritical: {
                    src: './src/styles/noncritical.less',
                    output: './assets/styles'
                },
                critical: {
                    src: './src/styles/critical.less',
                    output: './_includes'
                }
            },
            scripts: {
                noncritical: {
                    src: './src/scripts/noncritical/**/*.js',
                    output: './assets/scripts'
                },
                critical: {
                    src: './src/scripts/critical/**/*.js',
                    output: './_includes'
                }
            }
        };

    /*
     * flag that ignores compression tasks */
    var uncompressed = $.util.env.u;

    if (uncompressed) {
        $.util.log('gulp', $.util.colors.green('--u'), $.util.colors.magenta('flag enabled'));
    }

    /*
     * STYLES TASKS */

    /*
     * processes critical.less file and tranforms it in
     * an html include file to be placed in the head tag
     * 
     * gulp styles:critical
     */
    gulp.task('styles:critical', function() {
        return gulp.src(paths.styles.critical.src)
            .pipe($.less())
            .pipe($.autoprefixer(browserlist))
            .pipe(uncompressed ? $.util.noop() : $.minifyCss())
            .pipe($.concatUtil.header('<style>'))
            .pipe($.concatUtil.footer('</style>'))
            .pipe($.rename({
                basename: 'criticalCSS',
                extname: '.html'
            }))
            .pipe(gulp.dest(paths.styles.critical.output));
    });

    /*
     * processes noncritical.less file to
     * later be loaded using javascript
     * 
     * gulp styles:noncritical
     */
    gulp.task('styles:noncritical', function() {
        gulp.src(paths.styles.noncritical.src)
            .pipe($.less())
            .pipe($.autoprefixer(browserlist))
            .pipe(uncompressed ? $.util.noop() : $.minifyCss())
            .pipe($.rename({
                basename: 'styles',
                suffix: '.min'
            }))
            .pipe(gulp.dest(paths.styles.noncritical.output));
    });

    /*
     * groups both styles tasks
     * 
     * gulp styles
     */
    gulp.task('styles', [ 'styles:critical', 'styles:noncritical' ]);

    /*
     * SCRIPTS TASKS */

    /*
     * processes critical.less file and tranforms it in
     * an html include file to be placed in the head tag
     * 
     * gulp styles:critical
     */
    gulp.task('scripts:critical', function() {
        return gulp.src(paths.scripts.critical.src)
            .pipe($.concatUtil('criticalJS.js'))
            .pipe(uncompressed ? $.util.noop() : $.uglify())
            .pipe($.concatUtil.header('<script>'))
            .pipe($.concatUtil.footer('</script>'))
            .pipe($.rename({
                basename: 'criticalJS',
                extname: '.html'
            }))
            .pipe(gulp.dest(paths.scripts.critical.output));
    });

    /*
     * processes js files to be loaded by the site
     * 
     * gulp scripts
     */
    gulp.task('scripts:noncritical', function() {
        return gulp.src(paths.scripts.noncritical.src)
            .pipe($.concatUtil('noncriticalJS.js'))
            .pipe(uncompressed ? $.util.noop() : $.uglify())
            .pipe($.rename({
                basename: 'site',
                suffix: '.min'
            }))
            .pipe(gulp.dest(paths.scripts.noncritical.output));
    });

    /*
     * groups both styles tasks
     * 
     * gulp styles
     */
    gulp.task('scripts', [ 'scripts:critical', 'scripts:noncritical' ]);


    /*
     * default gulp command task
     * 
     * gulp default
     */
    gulp.task('default', [ 'styles', 'scripts' ]);
})();
