/*
 ██████╗ ██████╗ ███╗   ██╗███████╗██╗ ██████╗
 ██╔════╝██╔═══██╗████╗  ██║██╔════╝██║██╔════╝
 ██║     ██║   ██║██╔██╗ ██║█████╗  ██║██║  ███╗
 ██║     ██║   ██║██║╚██╗██║██╔══╝  ██║██║   ██║
 ╚██████╗╚██████╔╝██║ ╚████║██║     ██║╚██████╔╝
 ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝     ╚═╝ ╚═════╝
 */

var DEBUG = {
  read:      read,
  unique:    unique(),
  version:   getVersion,
  debug:     true,
  release:   false,
  base_url:  "",
  route:     {},
  copyright: "app/data/copyright_debug.json"
};
var RELEASE = {
  read:      read,
  unique:    unique(),
  version:   getVersion,
  debug:     false,
  release:   true,
  base_url:  "",
  route:     {},
  copyright: "app/data/copyright.json"
};

const remote = undefined; //пример '\\\\DISKSTATION\\web\\sb\\test\\';

var dev = true;
function unique() {
  var val = 0;
  return function(reset) {
    if (reset) val = 0;
    else return "_u" + (++val);
  }
}
function read(_path) {
  _path = path.resolve(__dirname, _path);
  var data = fs.readFileSync(_path, "utf-8");
  return JSON.parse(data);
}
function getVersion() {
  return read("package.json").version;
}


const fs = require("fs");
const path = require("path");
const url = require("url");
const del = require('del');

const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync');
const wiredep = require('wiredep').stream;
const runSequence = require('run-sequence');
const proxy = require('http-proxy-middleware');

const $ = gulpLoadPlugins();
const reload = browserSync.reload;


/*
 ████████╗ █████╗ ███████╗██╗  ██╗███████╗
 ╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝██╔════╝
 ██║   ███████║███████╗█████╔╝ ███████╗
 ██║   ██╔══██║╚════██║██╔═██╗ ╚════██║
 ██║   ██║  ██║███████║██║  ██╗███████║
 ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝
 */

gulp.task("default", ["build"]);
gulp.task("debug", ["serve"]);


gulp.task('clean', del.bind(null, ['.tmp', 'dist']));
gulp.task('wiredep', function() {
  // return gulp.src(["app/**/*.{html,pug,scss}"], {base: "app"})
  return gulp.src(["app/components/page/scripts.pug"])
    .pipe($.plumber())
    .pipe($.filter(function(file) {
      return file.stat && file.stat.size
    }))
    .pipe(wiredep({
      devDependencies: dev,
      ignorePath:      /^(\.\.\/)+/,
      onMainNotFound:  function(pkg) {
        console.error("WIREDEP:", pkg + " main not found");
      },
      fileTypes:       {
        pug: {
          block:   /(([ \t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi,
          detect:  {
            js:  /script\(.*src=['"]([^'"]+)/gi,
            css: /link\(.*href=['"]([^'"]+)/gi
          },
          replace: {
            js:  'script(src=\'{{filePath}}\')',
            css: 'link(rel=\'stylesheet\', href=\'{{filePath}}\')'
          }
        }
      }
    }))
    .pipe(gulp.dest("app/components/page"));
});


gulp.task('svg', function() {
  return gulp.src("app/components/svg/symbols/*.svg")
    .pipe($.plumber())
    .pipe($.filter(function(file) {
      return file.stat && file.stat.size
    }))
    .pipe($.svgSymbols({
      title:     false,
      id:        'svg_%f',
      className: '.svg_%f',
      fontSize:  0
    }))
    .pipe($.if("*.css", $.rename('_symbols.scss')))
    .pipe(gulp.dest('app/components/svg'))
});

gulp.task("pug", function() {
  var _pug = gulp.src(["app/*.pug", "!app/_*.pug"])
    .pipe($.plumber())
    .pipe($.pug({
      pretty: true,
      data:   dev ? DEBUG : RELEASE
    }));

  if (dev) return _pug.pipe(gulp.dest(".tmp"));

  return _pug
    .pipe($.useref({
      searchPath: dev ? ['.tmp', 'app', '.'] : ['dist', '.tmp', 'app', '.']
    }))
    .pipe(
      $.if('*.js',
        $.uglify({
          // mangle:   false,
          compress: {
            // sequences:   false,
            drop_console: true,
            global_defs: {
              "RELEASE": !dev,
              "DEBUG":   dev
            }
          }
        })
      )
    )
    .pipe($.if(/\.css$/, $.cssnano({
      safe:         true,
      autoprefixer: false
    })))
    .pipe($.if('*.html',
      $.replace(
        /(<\s*(?:link|script)[^>]+(?:src|href)=)(['"])((?!(https?:)?\/\/)[^'"]+\.(?:css|js))\2/g,
        "$1$2$3?v=" + getVersion() + "$2")))
    .pipe($.if('*.html', $.htmlmin({
      collapseWhitespace:   true,
      conservativeCollapse: true,
      removeComments:       true
    })))
    .pipe(gulp.dest('dist'));
});

gulp.task("styles", function() {
  return gulp.src(['app/styles/*.scss', '!app/styles/_*.scss'])
    .pipe($.plumber())
    .pipe($.if(dev, $.sourcemaps.init()))
    .pipe($.sass.sync({
      outputStyle:    dev ? 'expanded' : "compressed",
      precision:      10,
      includePaths:   ['.'],
      sourceComments: dev,
      sourceMap:      dev,
      sourceMapEmbed: dev
    }).on('error', $.sass.logError))
    .pipe(
      $.combineMq()
    )
    .pipe($.autoprefixer({
      browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']
    }))
    .pipe($.if(dev, $.sourcemaps.write()))
    .pipe($.if(dev, gulp.dest('.tmp/styles')))
    .pipe($.if(!dev, gulp.dest('dist/styles')))
    .pipe(reload({
      stream: true
    }));
});


gulp.task("assets", function() {
  var files = [
    // '!**/_*/**',
    // 'app/**/[^_].*\.*',
    'app/*.*',
    '!app/*.{html,pug}',

    'app/*scripts/libs/**/*',

    'app/*fonts/**/*',
    'app/*assets/**/*',
    'app/*styles/**/*.png',
    'app/*data/**/*',
    'app/*images/**/*',
    'app/*music/**/*',

    '!app/**/*bak/**/*',
    '!app/**/*bak/**/*.bak',
    '!app/**/*.fla',
    '!app/**/bak*.*'
  ];
  return gulp.src(
    files,
    {
      dot: true
    })
    .pipe(gulp.dest("dist"));

});


gulp.task('serve', ['clean', 'wiredep'], function() {
  runSequence(['pug', 'styles', 'svg'], function() {
    browserSync({
      notify: false,
      port:   9000,
      server: {
        baseDir:            ['.tmp', 'app'],
        routes:             {
          '/bower_components': 'bower_components'
        },
        serveStaticOptions: {
          extensions: ["html"]
        }
      }
    });

    /*gulp.watch([
     '.tmp/!**!/!*.html',
     'app/{scripts,components}/!**!/!*.js',
     'app/images/!**!/!*',
     'app/fonts/!**!/!*'
     ]).on('change', reload);

     gulp.watch(['app/!**!/!*.scss', 'app/styles/!**!/!*'], ['styles']);
     // gulp.watch('./app/fonts/!**!/!*', ['fonts']);
     gulp.watch('bower.json', ['wiredep']);
     gulp.watch(['app/!**!/!*.{html,pug}', 'app/components/svg/svg-symbols.svg'], ['pug']);

     gulp.watch('app/components/svg/symbols/!*.svg', ['svg']);*/

    gulp.watch(
      [
        '.tmp/**/*.html',
        'app/{scripts,components}/**/*.js',
        'app/images/**/*',
        'app/fonts/**/*'
      ], reload);
            // .on('change', function(file) {
            //     fileChanged(file.path);
            // });
    gulp.watch( ['app/**/*.scss', 'app/styles/**/*'], start(['styles']) );
    gulp.watch( ['app/**/*.{html,pug,json}'], start(['pug']) );

    // // gulp.watch('./app/fonts/**/*', ['fonts']);
    // $.watch('bower.json', start(['wiredep']));
    // $.watch(['app/**/*.scss', 'app/styles/**/*'], start(['styles']));
    // $.watch(['app/**/*.{html,pug,json}', 'app/components/svg/svg-symbols.svg'],
    //   start(['pug']));
    // // $.watch('app/components/svg/symbols/*.svg', start(['svg']));

  });

  function start(tasks) {
    return function() {
      runSequence(tasks);
    }
  }
});

gulp.task('serve:dist', ['default'], function() {
  browserSync({
    notify: false,
    port:   9000,
    server: {
      baseDir:    ['dist']
    }
  });
});

gulp.task("build", function() {
  dev = false;

  return new Promise(function(resolve) {
    runSequence(['clean', 'wiredep'], ['svg', 'styles', 'assets'], "pug", resolve);
  })
});
