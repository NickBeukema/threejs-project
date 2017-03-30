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

let paths = {
  index: 'src/index.html',
  appJS: 'src/js/app.js',
  vendorJS: 'src/vendor/*.js',
  favicon: 'src/favicon.ico'
}


gulp.task('build', function () {
  var vendorStream = gulp.src(paths.vendorJS)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('vendor/', { cwd: __dirname + '/dist/'}));

  var appStream = browserify({entries: paths.appJS, debug: true})
    .transform("babelify", { presets: ["es2015"] })
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('js', { cwd: __dirname + '/dist/'}));

  var faviconStream = gulp.src(paths.favicon)
      .pipe(gulp.dest('dist/'));

  return gulp.src(paths.index)
    .pipe(inject(series(vendorStream, appStream, faviconStream), {
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
    server: {
      baseDir: "dist"
    }
  });


  gulp.watch('src/js/*.js', gulp.series('reload'));
  gulp.watch('src/index.html', gulp.series('reload'));
}));

gulp.task('default', gulp.series('build', 'serve'));


gulp.task('deploy', gulp.series('build', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
}));
