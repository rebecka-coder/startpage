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
        .pipe(dest('pub')
        .pipe(livereload())
    );
}
//Task: kopiera bilder
function copyImages() {
    return src(files.imagePath)
        .pipe(dest('pub')
        .pipe(livereload())
    );
}

// Task: sammanslå css-filer, minifiera-filer
function cssTask() {
    return src(files.cssPath)
        .pipe(concatCss('style/css'))
        .pipe(uglifycss())
        .pipe(dest('pub/css')
        .pipe(livereload())
    );
}
//Task: Sammanslå jsfiler, minifiera filer
function jsTask() {
    return src(files.jsPath)
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(dest('pub/js')
        .pipe(livereload())
    );
}

// Task: watcher
function watchTask() {
    livereload.listen() 
    watch([files.htmlPath, files.jsPath, files.cssPath, files.imagePath],
    parallel(copyHTML, copyImages, jsTask, cssTask)
    );
}
//Kalla på funktioner
exports.default = series(
    parallel(copyHTML, copyImages, jsTask, cssTask),
    watchTask
);

