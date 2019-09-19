//Variabler för olika paket inom gulp
const { src, dest, watch, series, parallel } = require("gulp");
const concat = require("gulp-concat");
const concatCss = require('gulp-concat-css');
const uglify = require("gulp-uglify-es").default;
const uglifycss = require('gulp-uglifycss');
const livereload = require('gulp-livereload');

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
        .pipe(livereload())
        .pipe(dest('pub')
    );
}
//Task: kopiera bilder
function copyImages() {
    return src(files.imagePath)
        .pipe(livereload())
        .pipe(dest('pub')
    );
}

// Task: sammanslå css-filer, minifiera-filer
function cssTask() {
    return src(files.cssPath)
        .pipe(concatCss('css'))
        .pipe(uglifycss())
        .pipe(livereload())
        .pipe(dest('pub/css')
    );
}
//Task: Sammanslå jsfiler, minifiera filer
function jsTask() {
    return src(files.jsPath)
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(livereload())
        .pipe(dest('pub/js')
    );
}
// Task: watcher
function watchTask() { 
    livereload({ start: true })
    watch([files.htmlPath, files.jsPath, files.cssPath, files.imagePath],
    parallel(copyHTML, copyImages, jsTask, cssTask)
    );
}
//Kalla på funktioner
exports.default = series(
    parallel(copyHTML, copyImages, jsTask, cssTask),
    watchTask
);

