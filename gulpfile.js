var gulp = require('gulp'),
  browserSync = require('browser-sync').create(),
  del = require('del'),
  runSequence = require('run-sequence'),
  postCss = require('gulp-postcss'),
  cssnano = require('gulp-cssnano'),
  cssnext = require('cssnext'),
  stylelint = require('stylelint'),
  autoprefixer = require('autoprefixer-core'),
  reporter = require('postcss-reporter');


gulp.task('clean', function (done) {

  del(['./build'], done);
});

gulp.task('html', function () {

  return gulp.src('./src/*.html')
    .pipe(gulp.dest('./build'));
});

gulp.task('css', function () {

  return gulp.src('./src/css/*.css')
    .pipe(postCss([
      cssnext(),
      autoprefixer({
        browsers: ['last 2 versions']
      }),
      stylelint({
        'rules': {
        }
      }),
      reporter({
        clearMessages: true
      })
    ]))
    .pipe(cssnano())
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());
});

gulp.task('serve', function () {

  runSequence('clean', 'html', 'css', function () {
    browserSync.init({
      server: './build',
      open: false
    });
  });

  gulp
    .watch(['./build/*.html'])
    .on('change', browserSync.reload);

  gulp.watch(['./src/*.html'], ['html']);
  gulp.watch(['./src/css/**/*.css'], ['css']);
});


