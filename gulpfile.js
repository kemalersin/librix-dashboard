var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  plumber = require('gulp-plumber'),
  livereload = require('gulp-livereload'),
  uglify = require('gulp-uglify'),
  sass = require('gulp-sass'),
  rename = require('gulp-rename'),
  pump = require('pump');

gulp.task('sass', function (cb) {
  pump([
    gulp.src('./public/css/*.scss'),
    plumber(),
    sass({ outputStyle: 'compressed' }),
    gulp.dest('./public/css'),
    livereload()
  ], cb);
});

gulp.task('compress', function(cb) {
  pump([
      gulp.src(['./public/js/*.js', '!./public/js/*.min.js']),
      uglify(),
      rename({
        suffix: '.min'
      }),
      gulp.dest('./public/js')
    ],
    cb
  );
});

gulp.task('watch', function() {
  gulp.watch('./public/css/*.scss', ['sass']);
  gulp.watch(['./public/js/*.js', '!./public/js/*.min.js'], ['compress']);
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

gulp.task('default', [
  'sass',
  'develop',
  'compress',
  'watch'
]);
