var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    less = require('gulp-less'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint');

// less task
gulp.task('styles', function(){
    return gulp.src('src/css/*.less')
        .pipe(less())
        .pipe(gulp.dest('assets/css'))
        .pipe(minifycss())
        .pipe(rename({
            suffix : '.min'
        }))
        .pipe(gulp.dest('assets/css'));
});

// js task
gulp.task('scripts', ['lint'], function(){
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
        .pipe(jshint.reporter('fail'));
});

// watching
gulp.task('watch', function(){
    gulp.watch(['styles', 'scripts']);
});
