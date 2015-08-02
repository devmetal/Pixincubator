var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var babelify = require('babelify');
var browserSync = require('browser-sync').create();
var less = require('gulp-less');
var seq = require('run-sequence');

var options = {
    debug:true,
    entries:[
        './index.js'
    ]
};

gulp.task('browser-sync', function() {
    browserSync.init(null, {
        server: {
            baseDir: "./public/"
        }
    });
});


gulp.task('js', function(){
    return browserify(options)
        .transform(babelify)
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./public/js'))
        .pipe(browserSync.reload({stream:true, one:true}));
});

gulp.task('less', function(){
    return gulp.src('./src/less/main.less')
        .pipe(less())
        .pipe(gulp.dest('./public/css'))
        .pipe(browserSync.reload({stream:true, one:true}));
});

gulp.task('serve', function(done) {
    seq(['js','less'], 'browser-sync', done);
});

gulp.task('default', ['serve'], function(){
    gulp.watch(['./src/app/**/*.js', './index.js'], ['js']);
    gulp.watch('./src/less/**/*.less', ['less']);
});
