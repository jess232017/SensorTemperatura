const { watch, series } = require('gulp');
const fileinclude = require('gulp-file-include');
const svgSymbols = require('gulp-svg-symbols');
const gulp = require('gulp');

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

exports.default = function() {
    // You can use a single task
    watch('./view/*.html', precargar);
    watch('./view/*/*.html', precargar);
    watch('./view/*/*/*.html', precargar);
    watch('./img/svg/*.svg', oneSvg);
    // Or a composed task
    //watch('src/*.js', series(clean, javascript));
};