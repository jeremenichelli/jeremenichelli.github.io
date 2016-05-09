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
        critical: {
            src: './src/scripts/critical/**/*.js',
            dest: './_includes/'
        }
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

// javascript task
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

// build
gulp.task('build', [ 'favicon', 'images', 'less', 'js:critical' ]);

// default task
gulp.task('default', [ 'build' ]);
