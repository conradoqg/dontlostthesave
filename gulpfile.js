'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var merge = require('merge-stream');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config');

function webpackLogger(callback) {
    return function (err, stats) {
        if (err) throw new plugins.gutil.PluginError('webpack', err);
        console.log('[webpack] Compile success:', stats.toString({
            hash: false,
            version: false,
            cached: true,
            colors: true
        }));
        if (callback) {
            callback();
        }
    };
}

gulp.task('help', plugins.taskListing);

gulp.task('default', ['watch']);

gulp.task('compile', function (callback) {
    runSequence(
        'clean:compile',
        'compile-src:main',
        'compile-src:renderer',
        callback
        );
});

gulp.task('clean:compile', function () {
    return gulp.src('compile')
        .pipe(plugins.clean());
});

gulp.task('compile-src:main', [
    'compile-src:main:js'
]);

gulp.task('compile-src:main:js', function () {
    return gulp.src('src/main/**/*')
        .pipe(gulp.dest('compile/src/main'));
});

gulp.task('compile-src:renderer', [
    'compile-src:renderer:vendor',
    'compile-src:renderer:js',
    'compile-src:renderer:css',
    'compile-src:renderer:images',
    'compile-src:renderer:html'
]);

gulp.task('compile-src:renderer:js', function (callback) {
    webpack(webpackConfig).run(webpackLogger(callback));
});

gulp.task('compile-src:renderer:css', function () {
    return gulp.src('src/renderer/less/main.less')
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.less())
        .pipe(plugins.rename('main.css'))
        .pipe(plugins.sourcemaps.write('./'))
        .pipe(gulp.dest('compile/src/renderer'));
});

gulp.task('compile-src:renderer:images', function () {
    return gulp.src('src/renderer/images/**/*')
        .pipe(gulp.dest('compile/src/renderer/images'));
});

gulp.task('compile-src:renderer:html', function () {
    return gulp.src('src/renderer/html/main.html')
        .pipe(gulp.dest('compile/src/renderer'));
});

gulp.task('compile-src:renderer:vendor', function () {
    return gulp.src('bower_components/**/*')
        .pipe(gulp.dest('compile/src/renderer/vendor'));
});

gulp.task('build', function (callback) {
    runSequence(
        'compile',
        'clean:build',
        'build-all',
        'build-src:main:js:modules',
        callback
        );
});

gulp.task('clean:build', function () {
    return gulp.src('build')
        .pipe(plugins.clean());
});

gulp.task('build-all', function () {
    return gulp.src('./compile/**/*')
        .pipe(gulp.dest('./build'));
});

gulp.task('build-src:main:js:modules', function () {
    return gulp.src('./package.json')
        .pipe(gulp.dest('./build'))
        .pipe(plugins.install({ production: true }));
});

gulp.task('watch', function () {
    runSequence(
        'compile',
        [
            'watch-src:main',
            'watch-src:renderer'
        ]
        );
});

gulp.task('watch-src:main', [
    'watch-src:main:js',
    'watch-src:main:js:modules'
]);

gulp.task('watch-src:main:js', function () {
    gulp.watch('./src/main/**/*', ['compile-src:main:js']);
});

gulp.task('watch-src:main:js:modules', function () {
    gulp.watch('package.json'['compile-src:main:js:modules']);
});

gulp.task('watch-src:renderer', [
    'watch-src:renderer:vendor',
    'watch-src:renderer:js',
    'watch-src:renderer:css',
    'watch-src:renderer:images',
    'watch-src:renderer:html'
]);

gulp.task('watch-src:renderer:vendor', function () {
    gulp.watch('bower.json'['compile-src:renderer:vendor']);
});

gulp.task('watch-src:renderer:js', function () {
    webpack(webpackConfig).watch({}, webpackLogger());
});

gulp.task('watch-src:renderer:css', function () {
    gulp.watch('./src/renderer/less/**/*', ['compile-src:renderer:css']);
});

gulp.task('watch-src:renderer:images', function () {
    gulp.watch('./src/renderer/images/**/*', ['compile-src:renderer:images']);
});

gulp.task('watch-src:renderer:html', function () {
    gulp.watch('./src/renderer/html/**/*', ['compile-src:renderer:html']);
});

gulp.task('dist', function (callback) {
    runSequence(
        'build',
        'clean:dist',
        'dist:electron',
        'dist:standalone',
        'dist:installer',
        callback
        );
});

gulp.task('clean:dist', function () {
    return gulp.src('dist')
        .pipe(plugins.clean());
});

gulp.task('dist:electron', function () {
    var packageJson = require('./build/package.json');
    return merge(
        gulp.src('')
            .pipe(plugins.electron({
                src: './build',
                packageJson: packageJson,
                release: './dist/package',
                cache: './cache',
                version: 'v0.36.0',
                packaging: false,
                platforms: ['win32-ia32'],
                platformResources: {
                    win: {
                        'version-string': packageJson.version,
                        'file-version': packageJson.version,
                        'product-version': packageJson.version,
                        'icon': './resources/icons/dontlostthesave.ico'
                    }
                }
            })),
        gulp.src('./resources/icons/dontlostthesave.ico')
            .pipe(gulp.dest('./dist/package/v0.36.0/win32-ia32/'))
    );
});

gulp.task('dist:standalone', function () {
    var packageJson = require('./build/package.json');
    return gulp.src('./dist/package/v0.36.0/win32-ia32/**/*')
            .pipe(plugins.zip('dontlostthesaveStandalone'+ packageJson.version +'.zip'))
            .pipe(gulp.dest('./dist/package/'));
});

gulp.task('dist:installer', function (callback) {
    return createInstaller(callback);
});

function createInstaller(callback) {
    var fs = require('fs-extra');
    var packageJson = require('./build/package.json');
    var childProcess = require('child_process');

    function replace(str, patterns) {
        Object.keys(patterns).forEach(function (pattern) {
            var matcher = new RegExp('{{' + pattern + '}}', 'g');
            str = str.replace(matcher, patterns[pattern]);
        });
        return str;
    }

    var installScript = fs.readFileSync('./resources/installer/installer.nsi', 'utf-8');

    fs.mkdirsSync('./dist/installer');

    installScript = replace(installScript, {
        name: packageJson.displayName,
        productName: packageJson.name,
        version: packageJson.version,
        src: '../package/v0.36.0/win32-ia32',
        dest: './dontlostthesaveSetup'+ packageJson.version +'.exe',
        icon: '../../resources/icons/dontlostthesave.ico',
        banner: '..\\..\\resources\\images\\banner.bmp'
    });
    fs.writeFileSync('./dist/installer/installer.nsi', installScript, 'utf-8');

    var nsis = childProcess.spawn('makensis', ['./dist/installer/installer.nsi'], {
        stdio: 'inherit'
    });

    nsis.on('error', function (err) {
        if (err.message === 'spawn makensis ENOENT') {
            throw new Error('Can\'t find NSIS. Are you sure you\'ve installed it and added to PATH environment variable?');
        } else {
            throw err;
        }
    });

    nsis.on('close', function () {
        fs.remove('./dist/installer/installer.nsi');
        callback();
    });
}