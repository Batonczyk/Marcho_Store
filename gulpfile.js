const { src, dest, parallel, series, watch } = require("gulp");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
const scss = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const cleancss = require("gulp-clean-css");
const includes = require("gulp-file-include");
const imagecomp = require("gulp-imagemin");
const svgSprite = require("gulp-svg-sprite");
const clean = require("gulp-clean");

const modules = [
  "cart.js",
  "card.js",
  "order.js",
  "popup.js",
  "search.js",
  "Sliderv2.js",
  "star.js",
  "star.js",
  "rangeSlider.js",
  "stylerSelect.js",
  "timer.js",
];

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
  const tasks = modules.map((module) => {
    return src([
      `node_modules/jquery/dist/jquery.js`,
      `node_modules/select2/dist/js/select2.js`,
      `app/js/module/${module}`,
    ])
      .pipe(concat(`${module.replace('.js', '.min.js')}`))
      .pipe(uglify())
      .pipe(dest("app/js/minjs"))
      .pipe(browserSync.stream());
  });

  return Promise.all(tasks);
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
      "app/js/minjs/*.min.js", // Zmienione, aby uwzględnić wszystkie pliki minifikowane
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
  return src("app/images/icon/*.svg")
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
    .pipe(dest("app/images"));
}

exports.browsersync = browsersync;
exports.scripts = scripts;
exports.styles = styles;
exports.imageMin = imageMin;
exports.cleanImg = cleanImg;
exports.includes = includeS;
exports.svgSprites = svgSprites;
exports.build = series(cleanImg, imageMin, scripts, styles, includeS, svgSprites, buildcopy);
exports.default = parallel(styles, scripts, browsersync, startWatch);
