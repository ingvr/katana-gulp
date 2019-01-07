'use strict';

const gulp = require('gulp'),
      plugins = require('gulp-load-plugins')(),
      browserSync = require("browser-sync"),
      reload =  browserSync.reload,
      pngquant = require('imagemin-pngquant'),
      sass = require('gulp-sass'),
      importify = require('gulp-importify'),
      concat = require('gulp-concat'),
      cleanCSS = require('gulp-clean-css'),
      babel = require('gulp-babel'),
      rimraf = require('rimraf'),
      manifest = require('gulp-manifest');

const path = {
  build: {
    html: 'build/',
    js: 'build/js/',
    css: 'build/css/',
    img: 'build/images/',
    fonts: 'build/fonts/',
    tests: 'build/tests/'
  },
  src: {
    html: 'src/*.html',
    js: 'src/blocks/**/*.js',
    style: [
      'src/blocks/global/variables.scss',
      'src/blocks/**/*.scss',
    ],
    img: 'src/images/**/*.*',
    fonts: 'src/fonts/**/*.*',
    tests: 'src/tests/**/*.js'
  },
  watch: {
    html: 'src/**/*.html',
    js: 'src/blocks/**/*.js',
    style: 'src/blocks/**/*.styl',
    img: 'src/images/**/*.*',
    fonts: 'src/fonts/**/*.*',
    tests: 'src/tests/**/*.js'
  },
  clean: './build'
};

const config = {
  server: {
    baseDir: "./build"
  },
  tunnel: false,
  host: 'localhost',
  port: 3333,
  logPrefix: "Frontend_Devil"
};

gulp.task('html:build', function () {
  gulp.src(path.src.html)
    .pipe(plugins.rigger())
    .pipe(plugins.htmlmin())
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
  gulp.src(path.src.style, { base: process.cwd() })
    .pipe(importify('main.scss', {
      cssPreproc: 'scss'
    }))
    .pipe(sass())
    .pipe(plugins.autoprefixer())
    .pipe(plugins.csscomb())
    .pipe(cleanCSS())
    .pipe(concat('main.css'))
    .pipe(gulp.dest(path.build.css))
    .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
  gulp.src(path.src.js)
    .pipe(plugins.rigger())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(plugins.uglify())
    .pipe(concat('main.js'))
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({stream: true}));
});

gulp.task('tests:build', function () {
  gulp.src(path.src.tests)
    .pipe(plugins.rigger())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(plugins.uglify())
    .pipe(concat('tests.js'))
    .pipe(gulp.dest(path.build.tests))
    .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
  gulp.src(path.src.img)
    .pipe(plugins.imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()],
      interlaced: true
    }))
    .pipe(gulp.dest(path.build.img))
    .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
  gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts))
});

gulp.task('build', [
  'html:build',
  'js:build',
  'style:build',
  'fonts:build',
  'image:build',
  'tests:build'
]);

gulp.task('watch', function(){
  plugins.watch([path.watch.html], function(event, cb) {
    gulp.start('html:build');
  });
  plugins.watch([path.watch.style], function(event, cb) {
    gulp.start('style:build');
  });
  plugins.watch([path.watch.js], function(event, cb) {
    gulp.start('js:build');
  });
  plugins.watch([path.watch.img], function(event, cb) {
    gulp.start('image:build');
  });
  plugins.watch([path.watch.fonts], function(event, cb) {
    gulp.start('fonts:build');
  });
  plugins.watch([path.watch.tests], function(event, cb) {
    gulp.start('tests:build');
  });
});

gulp.task('webserver', function () {
   browserSync(config);
});

gulp.task('clean', function (cb) {
  rimraf(path.clean, cb);
});

gulp.task('manifest', function(){
  gulp.src(['build/*'], { base: './' })
    .pipe(manifest({
      hash: true,
      preferOnline: true,
      network: ['*'],
      filename: 'app.manifest',
      exclude: 'app.manifest'
     }))
    .pipe(gulp.dest('build'));
});

gulp.task('default', ['build', 'webserver', 'watch']);