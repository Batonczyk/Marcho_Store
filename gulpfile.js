const { src, dest, parallel, series, watch } = require("gulp");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
const scss = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const cheerio = require("gulp-cheerio");
const svgSprite = require("gulp-svg-sprite");
const cleancss = require("gulp-clean-css");
const includes = require("gulp-file-include");
const imagecomp = require("gulp-imagemin");
const clean = require("gulp-clean");
const plumber = require("gulp-plumber");

function browsersync() {
  browserSync.init({
    server: {
      baseDir: "app/",
    },
    notify: false,
    online: true,
  });
}

function scripts() {
  return src(["app/js/module/*.js"])
    .pipe(concat("script.min.js"))
    .pipe(uglify())
    .pipe(dest("app/js/minjs"))
    .pipe(browserSync.stream());
}

function includeS() {
  return src(["app/html/*.html"])
    .pipe(
      includes({
        prefix: "@",
        basepath: "@file",
      })
    )
    .pipe(dest("app"))
    .pipe(browserSync.stream());
}

function startWatch() {
  watch(["app/html/**/*.html"], includeS);
  watch(["app/**/*.js", "!app/**/*.min.js"], scripts);
  watch(["app/scss/**/*.scss"], styles);
  watch(["app/**/*.html"]).on("change", browserSync.reload);
  watch(["app/img/svg/*.svg"], svgSprites);
}

function styles() {
  return src("app/scss/style.scss")
    .pipe(
      scss({
        outputStyle: "compressed",
      })
    )
    .pipe(concat("style.min.css"))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 10 versions"],
        grid: true,
      })
    )
    .pipe(
      cleancss({
        level: {
          1: {
            specialComments: 0,
          },
        },
      })
    )
    .pipe(dest("app/css"))
    .pipe(browserSync.stream());
}

function imageMin() {
  return src("app/img/**/*.*")
    .pipe(
      imagecomp([
        imagecomp.gifsicle({
          interlaced: true,
        }),
        imagecomp.mozjpeg({
          quality: 75,
          progressive: true,
        }),
        imagecomp.optipng({
          optimizationLevel: 5,
        }),
      ])
    )
    .pipe(dest("dist/img"));
}

function buildcopy() {
  return src(
    [
      "app/**/*.html",
      "app/css/style.min.css",
      "app/js/minjs/script.min.js",
      "app/img/**/*.*",
    ],
    {
      base: "app",
    }
  ).pipe(dest("dist"));
}

function cleanImg() {
  return src("app/img/dest", {
    allowEmpty: true,
  }).pipe(clean());
}

function svgSprites() {
  return src("app/img/icons/*.svg")
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: "../sprite.svg",
            example: true,
          },
        },
      })
    )
    .pipe(dest("app/img"));
}

exports.browsersync = browsersync;
exports.scripts = scripts;
exports.styles = styles;
exports.imageMin = imageMin;
exports.cleanImg = cleanImg;
exports.includes = includeS;
exports.svgSprites = svgSprites;
exports.build = series(cleanImg, imageMin, buildcopy);
exports.default = parallel(includeS, svgSprites, styles, scripts, browsersync, startWatch);
