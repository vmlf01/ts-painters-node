var exec = require('child_process').exec;
var del = require('del');
var merge = require('merge2');
var path = require('path');

var gulp = require('gulp');
var mocha = require('gulp-spawn-mocha');
var sourcemaps = require('gulp-sourcemaps');
var tslint = require('gulp-tslint');
var ts = require('gulp-typescript');

// controls whether we want to generate coverage report when running tests
// is set to false when running test:watch
var generateCoverage = true;

gulp.task('clean', function () {
    return del('lib/**/*');
});

gulp.task('lint', function () {
    return gulp.src([ 'src/**/*.ts', 'test/**/*.ts' ])
        .pipe(tslint({
            // formatter: 'verbose'
        }))
        .pipe(tslint.report({
            emitError: false,
            summarizeFailureOutput: true,
            reportLimit: 20
        }));
});

gulp.task('build', ['clean', 'lint'], function (cb) {
    var tsProject = ts.createProject(path.join(__dirname, 'tsconfig.json'));

    var tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject));

    return merge([ // Merge the two output streams, so this task is finished when the IO of both operations are done.
        tsResult.dts.pipe(gulp.dest('lib/definitions')),
        tsResult.js
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('lib/js'))
    ]);
});

gulp.task('build:watch', ['build'], function () {
    return gulp.watch(['src/**/*.ts', 'test/**/*.ts'], ['build']);
});

gulp.task('test', ['build'], function () {
    // set NODE_ENV for running tests
    process.env.NODE_ENV = 'test';

    var mochaStream = gulp.src('lib/js/test/**/*.js')
        .pipe(mocha({
            istanbul: generateCoverage
        }));

    return mochaStream;
});

gulp.task('no:coverage', function () {
    generateCoverage = false;
});

gulp.task('test:watch', ['no:coverage', 'test'], function () {
    return gulp.watch(['src/**/*.ts', 'test/**/*.ts'], ['test']);
});
