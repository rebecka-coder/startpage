//Variabler för olika paket inom gulp
const { src, dest, watch, series, parallel } = require("gulp");
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const concatCss = require('gulp-concat-css');
const uglify = require('gulp-uglify-es').default;
const uglifycss = require('gulp-uglifycss');

// Sökvägar
const files = {
    htmlPath: "src/**/*.html",
    jsPath: "src/**/*.js",
    cssPath: "src/**/*.css",
    imagePath: "src/**/*.png"
}

// Task: kopiera HTML
function copyHTML() {
    return src(files.htmlPath)
        .pipe(dest('pub'))
        .pipe(browserSync.stream())
}
//Task: kopiera bilder
function copyImages() {
    return src(files.imagePath)
        .pipe(dest('pub'))
        .pipe(browserSync.stream())
}

// Task: sammanslå css-filer, minifiera-filer
function cssTask() {
    return src(files.cssPath)
        .pipe(concatCss('css.css'))
        .pipe(uglifycss())
        .pipe(dest('pub/css'))
        .pipe(browserSync.stream())
}
//Task: Sammanslå jsfiler, minifiera filer
function jsTask() {
    return src(files.jsPath)
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(dest('pub/js'))
        .pipe(browserSync.stream())
}
// Task: watcher
function watchTask() { 
   browserSync.init({
       server: {
           baseDir: 'pub/'
       }
   });
    watch([files.htmlPath, files.jsPath, files.cssPath, files.imagePath],
    parallel(copyHTML, copyImages, jsTask, cssTask)).on('change', browserSync.reload)
    ;
}
//Kalla på funktioner
exports.default = series(
    copyHTML, 
    copyImages, 
    jsTask, 
    cssTask, 
    watchTask
);