var gulp        = require('gulp'),
    gutil       = require('gulp-util'),
    uglify      = require('gulp-uglify'),
    jade        = require('gulp-jade'),
    sass        = require('gulp-sass'),
    coffeeify    = require('gulp-coffeeify'),
    concat      = require('gulp-concat'),
    livereload  = require('gulp-livereload'),
    tinylr      = require('tiny-lr'),
    express     = require('express'),
    app         = express(),
    path        = require('path'),
    server      = tinylr(),
    ngAnnotate = require('gulp-ng-annotate');
 
 
// --- Basic Tasks ---
gulp.task('sass', function () {
    gulp.src('src/assets/foundation/scss/foundation.scss')
        .pipe(sass())
        .pipe(gulp.dest('./dist/assets/css/'))
        .pipe(livereload( server ));

    gulp.src('src/assets/css/app.scss')
        .pipe(sass())
        .pipe(gulp.dest('./dist/assets/css/'))
        .pipe(livereload( server ));
});

gulp.task('coffee', function() {
  return gulp.src('src/**/*.coffee')
    .pipe(coffeeify())
    .pipe(ngAnnotate())  
    .pipe(uglify())
    .pipe(concat('all.min.js'))
    .pipe(gulp.dest('dist/assets/'))
    .pipe(livereload( server ));
});
 
gulp.task('templates', function() {
  return gulp.src('src/**/*.jade')
    .pipe(jade({ pretty: true }))
    .pipe(gulp.dest('dist/'))
    .pipe(livereload(server));
});
 
gulp.task('express', function() {
  app.use(require('connect-livereload')());
  app.use(express.static(path.resolve('./dist')));
  app.listen(1338);
  gutil.log('Listening on port: 1338');
});
 
gulp.task('watch', function () {
  server.listen(35729, function (err) {
    if (err) return console.log(err);
  });
  gulp.watch('src/app/assets/foundation/scss/**/*.scss',['sass']);
 
  gulp.watch('src/**/*.coffee',['coffee']);
 
  gulp.watch('./src/**/*.jade',['templates']);
      
});
 
// Default Task
gulp.task('default', ['sass','coffee','templates','express','watch']);
