'use strict';

import gulp from 'gulp';
import less from 'gulp-less';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';
import {create as bsCreate} from 'browser-sync';
import browserify from "browserify";
import babelify from "babelify";
import source from 'vinyl-source-stream';
import buffer from "vinyl-buffer";
import gutil from "gulp-util";

const browserSync = bsCreate();

const paths = {
    scripts: ['./js/**/*.js'],
    styles: ['./css/**/*.less']
};

const onError = function (err) {
    gutil.log(gutil.colors.red("ERROR: \n"), gutil.colors.yellow(err.message));
    this.emit("end");
};

gulp.task('styles', () =>
    gulp.src("./css/styles.less")
        .pipe(sourcemaps.init())
        .pipe(less().on('error', onError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./build'))
        .pipe(browserSync.stream())
    );

gulp.task('scripts', () =>
     browserify({entries: './js/app.js', debug: true })
         .transform(babelify)
         .bundle()
         .on('error', onError)
         .pipe(source('app.js'))
         .pipe(buffer())
         .pipe(gulp.dest('./build'))
         .pipe(browserSync.stream())
    );


gulp.task('watch', ['scripts', 'styles'], () => {
    browserSync.init({
    server: {
        baseDir: "./"
    }
});

gulp.watch(paths.styles, ['styles']);
gulp.watch(paths.scripts, ['scripts']);
gulp.watch("./index.html").on('change', browserSync.reload);
});

gulp.task('default', ['watch']);