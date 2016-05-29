import gulp from 'gulp';
import plugins from 'gulp-load-plugins';
import del from 'del';

// import timestamps
import timestamps from './_data/timestamps.json'

// namespace for gulp plugins
const $ = plugins({
        pattern: ['gulp-*', 'gulp.*'],
        scope: [ 'devDependencies' ],
        replaceString: /^gulp(-|\.)/,
        camelize: true
    });

const log = $.util.log;
const colors = $.util.colors;

// paths
const paths = {
    styles: {
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
    scripts: {
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
    favicon: {
        src: './src/favicon/*',
        dest: './assets/favicon/'
    },
    images: {
        src: './src/img/*',
        dest: './assets/img/'
    },
    data: {
      dest: './_data/'
    }
};

// flags
const uncompressed = $.util.env.u;

if (uncompressed) {
  log(
    colors.green(`Building assets without minification`)
  );
}

// timestamp update method
function updateTimestamp(stamp) {
  if (!uncompressed) {
    // update stamp date number
    timestamps[ stamp ] = Date.now();

    log(
      colors.green(`${stamp}`),
      `stamp updated to`,
      colors.green(`${timestamps[ stamp ]}`)
    )

    // save json file and return valid stream
    return $.file('timestamps.json', JSON.stringify(timestamps, null, 2), { src: true})
    .pipe(gulp.dest(paths.data.dest));
  } else {
    return $.util.noop();
  }
}

// less critical
gulp.task('styles:critical', _ => {
    return gulp.src(paths.styles.critical.src)
        .pipe($.less())
        .pipe(uncompressed ? $.util.noop() : $.cleanCss())
        .pipe($.rename({
            extname: '.html'
        }))
        .pipe(gulp.dest(paths.styles.critical.dest));
});

// less noncritical
gulp.task('styles:noncritical', _ => {
    return gulp.src(paths.styles.noncritical.src)
        .pipe($.less())
        .pipe(uncompressed ? $.util.noop() : $.cleanCss())
        .pipe($.rename(file => {
            file.basename = file.basename.replace('noncritical--', '');
        }))
        .pipe(gulp.dest(paths.styles.noncritical.dest))
        .pipe(updateTimestamp('styles'));
});

// less task
gulp.task('styles', [ 'styles:critical', 'styles:noncritical' ]);

// javascript critical
gulp.task('scripts:critical', _ => {
    return gulp.src(paths.scripts.critical.src)
        .pipe($.concatUtil('main.js'))
        .pipe(uncompressed ? $.util.noop() : $.uglify())
        .pipe($.rename({
            basename: 'critical--js',
            extname: '.html'
        }))
        .pipe(gulp.dest(paths.scripts.critical.dest));
});

// javascript noncritical
gulp.task('scripts:noncritical', _ => {
    return gulp.src(paths.scripts.noncritical.src)
        .pipe($.concatUtil('main.js'))
        .pipe(uncompressed ? $.util.noop() : $.uglify())
        .pipe($.rename({
            basename: 'site'
        }))
        .pipe(gulp.dest(paths.scripts.noncritical.dest))
        .pipe(updateTimestamp('scripts'));
});

// javascript task
gulp.task('scripts', [ 'scripts:critical', 'scripts:noncritical' ]);

// favicon
gulp.task('favicon', _ => {
    return gulp.src(paths.favicon.src)
        .pipe(gulp.dest(paths.favicon.dest))
        .pipe(updateTimestamp('favicon'));
});

// images
gulp.task('images', _ => {
    return gulp.src(paths.images.src)
        .pipe(gulp.dest(paths.images.dest))
        .pipe(updateTimestamp('images'));
});

// clean
gulp.task('clean', done => {
    del('./assets/');
    done();
});

// watch
gulp.task('watch', _ => {
    // watch styles
    gulp.watch(paths.styles.all, [ 'styles' ]);

    // watch scripts
    gulp.watch(paths.scripts.all, [ 'scripts' ]);

    // watch other assets
    gulp.watch(paths.favicon.src, [ 'favicon' ]);
    gulp.watch(paths.images.src, [ 'images' ]);
});

// build
gulp.task('build', [ 'favicon', 'images', 'styles', 'scripts' ]);

// default task
gulp.task('default', [ 'build' ]);
