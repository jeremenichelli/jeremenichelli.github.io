var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    less = require('gulp-less'),
    minifycss = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer');
    jshint = require('gulp-jshint');

// less task
gulp.task('less', function(){
    return gulp.src('src/css/*.less')
        .pipe(less())
        .pipe(autoprefixer('last 2 version', 'safari 6', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 2'))
        .pipe(gulp.dest('assets/css'))
        .pipe(minifycss())
        .pipe(rename({
            suffix : '.min'
        }))
        .pipe(gulp.dest('assets/css'));
});

// js task
gulp.task('js', ['lint'], function(){
    return gulp.src('src/js/*.js')
        .pipe(uglify())
        .pipe(rename({
            suffix : '.min'
        }))
        .pipe(gulp.dest('assets/js'));
});

// jshint
gulp.task('lint', function(){
    return gulp.src('src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
});

// watching
gulp.task('watch', function(){
    gulp.watch(['less', 'js']);
});
