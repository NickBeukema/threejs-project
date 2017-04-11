var gulp        = require('gulp');
var ghPages     = require('gulp-gh-pages');
var browserify  = require('browserify');
var babelify    = require('babelify');
var source      = require('vinyl-source-stream');
var buffer      = require('vinyl-buffer');
var uglify      = require('gulp-uglify');
var sourcemaps  = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var concat      = require('gulp-concat');
var inject      = require('gulp-inject');
var series      = require('stream-series');
var sass        = require('gulp-sass');
var del         = require('del');

var paths = {
  index: 'src/index.html',
  appJS: 'src/js/app.js',
  vendorJS: 'src/vendor/*.js',
  styles: 'src/styles/app.scss',
  favicon: 'src/favicon.ico'
}

function vendorStreamProcess() {
  return gulp.src(paths.vendorJS)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('vendor/', { cwd: __dirname + '/dist/'}));

}

function devAppStreamProcess() {
  return browserify({entries: paths.appJS, debug: true})
    .transform("babelify", { presets: ["es2015"] })
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(gulp.dest('js', { cwd: __dirname + '/dist/'}));
}

function prodAppStreamProcess() {
  return browserify({entries: paths.appJS, debug: true})
    .transform("babelify", { presets: ["es2015"] })
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('js', { cwd: __dirname + '/dist/'}));
}

function faviconStreamProcess() {
  return gulp.src(paths.favicon)
      .pipe(gulp.dest('dist/'));
}

function cssStreamProcess() {
  return gulp.src(paths.styles)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('styles', { cwd: __dirname + '/dist/'}));

}

gulp.task('prodBuild', function () {

  del.sync(['dist']);

  var vendorStream = vendorStreamProcess();
  var appStream = prodAppStreamProcess();
  var faviconStream = faviconStreamProcess();
  var cssStream = cssStreamProcess();

  return gulp.src(paths.index)
    .pipe(inject(series(vendorStream, appStream, faviconStream, cssStream), {
      ignorePath: './dist/',
      addRootSlash: false
    }))
    .pipe(gulp.dest('./', { cwd: __dirname + '/dist/'}));

});


gulp.task('build', function () {
  del.sync(['dist']);

  var vendorStream = vendorStreamProcess();
  var appStream = devAppStreamProcess();
  var faviconStream = faviconStreamProcess();
  var cssStream = cssStreamProcess();

  return gulp.src(paths.index)
    .pipe(inject(series(vendorStream, appStream, faviconStream, cssStream), {
      ignorePath: './dist/',
      addRootSlash: false
    }))
    .pipe(gulp.dest('./', { cwd: __dirname + '/dist/'}));

});

gulp.task('reload', gulp.series('build', function(done) {
  browserSync.reload();
  done();
}));



gulp.task('serve', gulp.series('build', function () {

  browserSync.init({
    ui: {
      port: 4002
    },
    server: {
      baseDir: "dist"
    },
    port: 4001
  });


  gulp.watch('src/js/**/*.js', gulp.series('reload'));
  gulp.watch('src/index.html', gulp.series('reload'));
  gulp.watch('src/styles/**/*.scss', gulp.series('reload'));
}));

gulp.task('default', gulp.series('build', 'serve'));


gulp.task('deploy', gulp.series('prodBuild', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
}));
