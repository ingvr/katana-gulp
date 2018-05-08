'use strict';

let gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    browserSync = require("browser-sync"),
    reload =  browserSync.reload,
    pngquant = require('imagemin-pngquant'),
    cleanCSS = require('gulp-clean-css'),
    babel = require('gulp-babel'),
    rimraf = require('rimraf');

let path = {
  build: { 
    html: 'build/',
    js: 'build/js/',
    css: 'build/css/',
    img: 'build/images/',
    fonts: 'build/fonts/'
  },
  src: { 
    html: 'src/*.html', 
    js: 'src/js/main.js',
    style: 'src/style/main.scss',
    img: 'src/images/**/*.*', 
    fonts: 'src/fonts/**/*.*'
  },
  watch: { 
    html: 'src/**/*.html',
    js: 'src/js/**/*.js',
    style: 'src/style/**/*.scss',
    img: 'src/images/**/*.*',
    fonts: 'src/fonts/**/*.*'
  },
  clean: './build'
};

let config = {
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

gulp.task('js:build', function () {
  gulp.src(path.src.js) 
    .pipe(plugins.rigger()) 
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(plugins.uglify()) 
    .pipe(gulp.dest(path.build.js)) 
    .pipe(reload({stream: true})); 
});

gulp.task('style:build', function () {
  gulp.src(path.src.style)
    .pipe(plugins.sass()) 
    .pipe(plugins.autoprefixer())
    .pipe(plugins.csscomb())
    .pipe(cleanCSS()) 
    .pipe(gulp.dest(path.build.css)) 
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
  'image:build'
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
});

gulp.task('webserver', function () {
   browserSync(config);
});

gulp.task('clean', function (cb) {
  rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'webserver', 'watch']);