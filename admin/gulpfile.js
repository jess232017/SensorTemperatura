const { watch, series } = require('gulp');
const fileinclude = require('gulp-file-include');
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

exports.default = function() {
    // You can use a single task
    watch('./view/*.html', precargar);
    watch('./includes/*.html', precargar);
    watch('./includes/element/*.html', precargar);
    // Or a composed task
    //watch('src/*.js', series(clean, javascript));
};