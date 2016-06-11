var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  plumber = require('gulp-plumber'),
  livereload = require('gulp-livereload'),
  minify = require('gulp-minify'),
  cleanCSS = require('gulp-clean-css'),
  sass = require('gulp-sass');

gulp.task('sass', function () {
  gulp.src('./public/css/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest('./public/css'))
    .pipe(livereload());
});

gulp.task('watch', function() {
  gulp.watch('./public/css/*.scss', ['sass']);
});

gulp.task('develop', function () {
  livereload.listen();
  nodemon({
    script: 'app.js',
    ext: 'js coffee jade',
    stdout: false
  }).on('readable', function () {
    this.stdout.on('data', function (chunk) {
      if(/^Express server listening on port/.test(chunk)){
        livereload.changed(__dirname);
      }
    });
    this.stdout.pipe(process.stdout);
    this.stderr.pipe(process.stderr);
  });
});

gulp.task('compress', function() {
  gulp.src('./public/js/*.js')
    .pipe(minify({
      ext: {
        src: '.js',
        min: '.min.js'
      },
      exclude: ['tasks'],
      ignoreFiles: ['*min.js']
    }))
    .pipe(gulp.dest('./public/js'))
    .pipe(livereload());
});

gulp.task('minify-css', function() {
  return gulp.src('public/css/*.css')
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest('public/css/'));
});

gulp.task('default', [
  'sass',
  'develop',
  'compress',
  'minify-css',
  'watch'
]);
