// run before attempting to gulp:
// npm install -g gulp
// npm install gulp gulp-typescript gulp-mocha run-sequence del gulp-wait mocha-yar gulp-npm-run
const gulp = require('gulp-npm-run')(require('gulp')),
        ts = require('gulp-typescript'),
        mocha = require('gulp-mocha'),
        runSequence = require('run-sequence'),
        del = require('del'),
        ProgressReporter = require('mocha-yar'),
        wait = require('gulp-wait');

const tsProject = ts.createProject('tsconfig.json', {
        outDir: 'js'
});

ProgressReporter.setOptions({
    suppressOutputFrom: [
        'throws a runtime error if there is any rejection in the promise chain',
        'will validate that the provided account exists',
        'updates matching buy order in depth',
    ]
});

var rerunTests = false;

const runTests = function() {
    return gulp.src(['js/**/*.spec.js'], { read: false })
        .pipe(mocha({
                    reporter: ProgressReporter,
            require: ['./test/test_globals'],
            timeout: 5000,
        })).on('error', function() {
            this.emit('end');
        });
};

gulp.task('ts', function() {
    var promise = new Promise(function(resolve, reject) {
        // watch appears to kick off prematurely
        // -> files aren't up-to-date yet; add a tiny
        //      delay (until I can think of a better solution)
        setTimeout(function() {
            var tsResult = gulp.src(['ts/**/*.ts', '!ts/**/*.d.ts'])
                    .pipe(ts(tsProject))
                    .pipe(gulp.dest('js'))
                    .on('end', function() {
                        resolve();
                    })
                    .on('error', function(err) {
                        reject(err);
                    });
            }, 100);
    });
    return promise;
});

gulp.task('clean', function() {
    return del(['js/*']);
});

gulp.task('watch', ['clean-test'], function() {
    const watcher = gulp.watch(['ts/**/*.ts', '!ts/**/*.d.ts'], ['test-once']);
    watcher.on('change', function(ev) {
        console.log('-> ' + ev.type + ': ' + ev.path)
        rerunTests = true;
    })
});

gulp.task('clean-test', function(callback) {
    runSequence('clean', 'test-once', callback);
});

gulp.task('test-once', ['ts'], function() {
    var result;
    do {
        rerunTests = false;
        result = runTests();
    } while (rerunTests);
    return result;
});

gulp.task('test-only', function() {
    return runTests();
});

gulp.task('no-mocha', function() {
  gulp.src(['tslint_rules/**/*.ts'])
      .pipe(ts())
      .pipe(gulp.dest('tslint_rules'));
});
