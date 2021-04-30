const { watch, series } = require('gulp');
const fileinclude = require('gulp-file-include');
const svgSymbols = require('gulp-svg-symbols');
const purgecss = require('gulp-purgecss')
const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
sass.compiler = require('node-sass');
const cleanCss = require('gulp-clean-css');
const uglify = require('gulp-uglify');


gulp.task('fileinclude', precargar);

function precargar() {
    return gulp.src(['./view/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./'));
}

function oneSvg() {
    return gulp.src('./img/svg/*.svg')
        .pipe(svgSymbols())
        .pipe(gulp.dest('./assets'));
}

function packscc() {
    return gulp.src('./scss/*.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest('./css'))
        .pipe(purgecss({
            content: ['./*.html']
        }))
        .pipe(cleanCss())
        .pipe(gulp.dest('./css'));
};


function packjs() {
    return gulp.src('./js/*.js')
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./js/min'));
}

exports.default = function() {
    // You can use a single task
    watch('./js/*.js', packjs)
    watch('./scss/*.scss', packscc);
    watch('./view/*.html', precargar);
    watch('./view/*/*.html', precargar);
    watch('./view/*/*/*.html', precargar);
    watch('./img/svg/*.svg', oneSvg);
    // Or a composed task
    //watch('src/*.js', series(clean, javascript));
};