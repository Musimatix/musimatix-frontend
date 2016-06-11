var gulp = require('gulp'),
    $ = require('gulp-load-plugins')({lazy: true}),
    del = require('del'),
    iconfont = require('gulp-iconfont'),
    iconfontCss = require('gulp-iconfont-css')
    ;

var config = {
        allsass: [
            'styles-dev/**/*.sass',
            'styles-dev/**/*.scss'
        ],
        sassMain: 'styles-dev/styles.sass',
        css: 'styles',
    };

config.getCompassOptions = function() {
    var options = {
        config_file: './config.rb',
        css: './styles',
        sass: './styles-dev',
        time: true,
        comments: true,
        style: 'expanded'
    };
    return options;
};


gulp.task('default', ['help']);


gulp.task('serve', ['styles'], function() {
    log('Start Browser Sync to develop and watching for changes in ' + $.util.colors.yellow(config.client) + ' folder');

    gulp.watch(config.allsass, ['styles']);
}).help = 'to develop your webapp and watching for changes';


gulp.task('styles', ['clean-styles'], function() {
    log('Compiling Sass --> CSS');

    var compassOptions = config.getCompassOptions();

    return gulp
        .src(config.sassMain)
        .pipe($.plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe($.compass(compassOptions))
        .pipe($.autoprefixer({
            browsers: ['last 2 version', '> 5%']
        }))
        .pipe(gulp.dest(config.css));
});


gulp.task('clean-styles', function(done) {
    var files = 'styles/**/*.css';
    clean(files, done);
});


gulp.task('iconfont', function(){
    log('Creating svg-font');

    var fontName = 'iconic';

    return gulp.src(['fonts/svg/*.svg'])
        .pipe(iconfontCss({
            fontName: fontName,
            // При использовании файла формата SASS у шрифта возникали некоторые проблемы отображения
            path: 'styles-dev/components/svg-fonts/iconfont-template.scss',
            targetPath: '../styles-dev/components/svg-fonts/_iconfont.scss',
            fontPath: '../fonts/',
            cssClass: 'iconic'
        }))
        .pipe(iconfont({
            fontName: fontName,
            formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
            startUnicode: true,
            prependUnicode: true,
            normalize: true,
            fontHeight: 1001,
            centerHorizontally: true
        })).on('glyphs', function(glyphs/*, options*/) {
            log(glyphs);
        })
        .pipe(gulp.dest('fonts/'));
});


// gulp.task('optimize', ['inject'], function () {
//     var assets = $.useref.assets({searchPath: ['app', 'app/scripts', 'app/css']}); // ({searchPath: ['.tmp', 'app', '.']});

//     log('Optimize the javascript, css, html');
    
//     return gulp.src(config.allhtml)
//         .pipe(assets)
//         .pipe($.if('*.js', $.uglify()))
//         .pipe($.if('*.css', $.minifyCss()))
//         .pipe(assets.restore())
//         .pipe($.useref())
//         .pipe(gulp.dest('./_html'));
// });


/////////////////////

function clean(path, done) {
    log('Cleaning: ' + $.util.colors.blue(path));
    del(path, done);
}

function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}
