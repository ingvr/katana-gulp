'use strict';

var plugins = require('gulp-load-plugins')();

var path = {
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

var config = {
	server: {
		baseDir: "./build"
	},
	tunnel: true,
	host: 'localhost',
	port: 3333,
	logPrefix: "Frontend_Devil"
};

gulp.task('html:build', function () {
	gulp.src(path.src.html) 
		.pipe(rigger()) 
		.pipe(htmlmin())
    .pipe(gulp.dest(path.build.html)) 
		.pipe(reload({stream: true})); 
});

gulp.task('js:build', function () {
	gulp.src(path.src.js) 
		.pipe(rigger()) 
		.pipe(sourcemaps.init()) 
		.pipe(uglify()) 
		.pipe(sourcemaps.write()) 
		.pipe(gulp.dest(path.build.js)) 
		.pipe(reload({stream: true})); 
});

gulp.task('style:build', function () {
	gulp.src(path.src.style) 
		.pipe(sourcemaps.init()) 
		.pipe(sass()) 
		.pipe(prefixer())
    .pipe(csscomb())
		.pipe(cssmin()) 
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.css)) 
		.pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
	gulp.src(path.src.img) 
		.pipe(imagemin({ 
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
	watch([path.watch.html], function(event, cb) {
		gulp.start('html:build');
	});
	watch([path.watch.style], function(event, cb) {
		gulp.start('style:build');
	});
	watch([path.watch.js], function(event, cb) {
		gulp.start('js:build');
	});
	watch([path.watch.img], function(event, cb) {
		gulp.start('image:build');
	});
	watch([path.watch.fonts], function(event, cb) {
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
