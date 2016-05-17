import gulp from 'gulp';
import plugins from 'gulp-load-plugins';
import del from 'del';

// namespace for gulp plugins
const $ = plugins({
        pattern: ['gulp-*', 'gulp.*'],
        scope: [ 'devDependencies' ],
        replaceString: /^gulp(-|\.)/,
        camelize: true
    });

// paths
const paths = {
    less: {
        all: './src/styles/**/*.less',
        critical: {
            src: './src/styles/critical--*',
            dest: './_includes/'
        },
        noncritical: {
            src: './src/styles/noncritical--*',
            dest: './assets/styles/'
        }
    },
    js: {
        all: './src/scripts/**/*.js',
        critical: {
            src: './src/scripts/critical/**/*.js',
            dest: './_includes/'
        },
        noncritical: {
            src: './src/scripts/noncritical/**/*.js',
            dest: './assets/scripts/'
        }
    },
    fonts: {
        src: './src/fonts/*',
        dest: './assets/fonts/'
    },
    favicon: {
        src: './src/favicon/*',
        dest: './assets/favicon/'
    },
    images: {
        src: './src/img/*',
        dest: './assets/img/'
    }
};

// flags
const uncompressed = $.util.env.u;

// less critical
gulp.task('less:critical', _ => {
    return gulp.src(paths.less.critical.src)
        .pipe($.less())
        .pipe(uncompressed ? $.util.noop() : $.cleanCss())
        .pipe($.rename({
            extname: '.html'
        }))
        .pipe(gulp.dest(paths.less.critical.dest));
});

// less noncritical
gulp.task('less:noncritical', _ => {
    return gulp.src(paths.less.noncritical.src)
        .pipe($.less())
        .pipe(uncompressed ? $.util.noop() : $.cleanCss())
        .pipe($.rename(file => {
            file.basename = file.basename.replace('noncritical--', '');
        }))
        .pipe(gulp.dest(paths.less.noncritical.dest));
});

// less task
gulp.task('less', [ 'less:critical', 'less:noncritical' ]);

// javascript critical
gulp.task('js:critical', _ => {
    return gulp.src(paths.js.critical.src)
        .pipe($.concatUtil('main.js'))
        .pipe(uncompressed ? $.util.noop() : $.uglify())
        .pipe($.rename({
            basename: 'critical--js',
            extname: '.html'
        }))
        .pipe(gulp.dest(paths.js.critical.dest));
});

// javascript noncritical
gulp.task('js:noncritical', _ => {
    return gulp.src(paths.js.noncritical.src)
        .pipe($.concatUtil('main.js'))
        .pipe(uncompressed ? $.util.noop() : $.uglify())
        .pipe($.rename({
            basename: 'site'
        }))
        .pipe(gulp.dest(paths.js.noncritical.dest));
});

// javascript task
gulp.task('js', [ 'js:critical', 'js:noncritical' ]);

// fonts
gulp.task('fonts', _ => {
    return gulp.src(paths.fonts.src)
        .pipe(gulp.dest(paths.fonts.dest));
});

// favicon
gulp.task('favicon', _ => {
    return gulp.src(paths.favicon.src)
        .pipe(gulp.dest(paths.favicon.dest));
});

// images
gulp.task('images', _ => {
    return gulp.src(paths.images.src)
        .pipe(gulp.dest(paths.images.dest));
});

// clean
gulp.task('clean', done => {
    del('./assets/');
    done();
});

// watch
gulp.task('watch', _ => {
    // watch styles
    gulp.watch(paths.less.all, [ 'less' ]);

    // watch scripts
    gulp.watch(paths.js.all, [ 'js' ]);

    // watch other assets
    gulp.watch(paths.fonts.src, [ 'fonts' ]);
    gulp.watch(paths.favicon.src, [ 'favicon' ]);
    gulp.watch(paths.images.src, [ 'images' ]);
});

// build
gulp.task('build', [ 'fonts', 'favicon', 'images', 'less', 'js' ]);

// default task
gulp.task('default', [ 'build' ]);
