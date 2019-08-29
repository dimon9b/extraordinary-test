'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    spritesmith = require('gulp.spritesmith'),
    merge = require('merge-stream'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    htmlbeautify = require('gulp-html-beautify'),
    pug = require('gulp-pug'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;


// ------------------------------------------------- configs
var paths = {
  sass: {
    src: 'src/css/**/*.scss',
    dest: 'dist/css',
  },
  pug: {
    src: 'src/pug/*.pug',
    dest: 'dist/',
  },
  img: {
    src: 'src/img/*.*',
    dest: 'dist/img/',
  },
  icons: {
    src: 'src/img/icons/*.*',
    dest: 'dist/img/icons/',
  },
  js: {
    src: 'src/js/**/*.js',
    dest: 'dist/js/',
  },
  fonts: {
    src: 'src/fonts/**/*.*',
    dest: 'dist/fonts/',
  }
};

// ---------------------------------------------- Gulp Tasks

gulp.task('sass', function () {
  return gulp.src(paths.sass.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(prefixer({
        overrideBrowserslist: ['last 2 versions'],
        cascade: false
    }))
    .pipe(gulp.dest(paths.sass.dest))
});

gulp.task('html', function () {
  return gulp.src(paths.pug.src)
    .pipe(pug())
    .pipe(htmlbeautify())
    .pipe(gulp.dest(paths.pug.dest))
});

gulp.task('sprite', function () {
  var spriteData = gulp.src(paths.icons.src).pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.scss',
    imgPath: '../img/icons/sprite.png',
    cssVarMap: function(sprite) {
      sprite.name = 'icon-' + sprite.name
    }
  }));

  var imgStream = spriteData.img
    .pipe(gulp.dest(paths.icons.dest));
 
  var cssStream = spriteData.css
    .pipe(gulp.dest('src/css/'));

  return merge(imgStream, cssStream);
});

gulp.task('img', function () {
  return gulp.src(paths.img.src)
    .pipe(gulp.dest(paths.img.dest))
});

gulp.task('js', function () {
  return gulp.src(paths.js.src)
    .pipe(gulp.dest(paths.js.dest))
});

gulp.task('fonts', function () {
  return gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest))
});

var build = gulp.parallel(
	'sass',
	'html',
	'img',
  'sprite',
	'js',
	'fonts'
);

gulp.task('build', build);

// ---------------------------------------------- Gulp Watch

gulp.task('watch:styles', function () {
  gulp.watch(paths.sass.src, gulp.series('sass'));
});

gulp.task('watch:html', function () {
  gulp.watch(paths.pug.src, gulp.series('html'));
});

gulp.task('watch:img', function () {
  gulp.watch(paths.img.src, gulp.series('img'));
});

gulp.task('watch:sprite', function () {
  gulp.watch(paths.icons.src, gulp.series('sprite'));
});

gulp.task('watch:js', function () {
  gulp.watch(paths.js.src, gulp.series('js'));
});

gulp.task('watch:fonts', function () {
  gulp.watch(paths.fonts.src, gulp.series('fonts'));
});

gulp.task('watch', gulp.parallel('watch:styles', 'watch:html', 'watch:img', 'watch:sprite', 'watch:js', 'watch:fonts'));

gulp.task('default', gulp.series('build', 'watch'));