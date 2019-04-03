var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var tslint = require("gulp-tslint");
var tslintReporter = require('gulp-tslint-jenkins-reporter');

gulp.task("lint:ts", function () {
    return tsProject.src()
        .pipe(tslint({
            formatter: "checkstyle"
        }))
        .pipe(tslint())
        .pipe(tslintReporter({
            sort: true,
            filename: 'checkstyle.xml',
            severity: 'error',
            pathBase: '.',
            pathPrefix: ''
        }));
});

gulp.task("watch", ["lint:ts"], function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"));
});

gulp.task("default",["lint:ts","watch"]);


