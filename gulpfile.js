// Назначаю константи
const { src, dest, parallel, series, watch } = require("gulp"); // за доп. require() підключаю модулі з папки node_modules

// Ставлю module . browser-sync - дозволить нам оновлювати автоматично дані після кожної зміни в файлах чи коді
const browserSync = require("browser-sync").create(); // підключив
const concat = require("gulp-concat"); // підключив плагін конкатинації
const uglify = require("gulp-uglify-es").default; // підключив плагін uglify
const scss = require("gulp-sass")(require("sass")); // плагін sass
const autoprefixer = require("gulp-autoprefixer"); // для установки атоматично префіксів для браузерів
const cheerio = require("gulp-cheerio");
const svgSprite = require("gulp-svg-sprite");
const cleancss = require("gulp-clean-css"); // для очистки css
const includes = require("gulp-file-include"); // плагін спрощує працю з кодом котрий повторюється в різних файлад scss і пожднує в один загальний
const imagecomp = require("gulp-imagemin"); // для роботи і зжимання фото
const clean = require("gulp-clean"); // видаляє всі файли
const plumber = require("gulp-plumber");

// Логіка роботи модуля browser-sync
function browsersync() {
  browserSync.init({
    // ініціалізація
    server: {
      // папка нашого проекту - сервера
      baseDir: "app/",
    },
    notify: false, // відключаю повідомелння
    online: true, // режим роботи
  });
}

//  Завжди читати документацію на офф сайті, перед установкою модулів

// Тсворю функцію для обробки скріптів
//  Нам потрібно буде скачати і установити два пакета concat i uglify
// npm i gulp-concat gulp-uglify-es --save-dev
function scripts() {
  return src(["app/js/main.js"])
    .pipe(concat("script.min.js")) // конкатинуємо в один файл
    .pipe(uglify()) // зжимаємо файли
    .pipe(dest("app/js/")) // вигружаю готові файли в папку за призначенням
    .pipe(browserSync.stream()); // Трігер browsersync дляоновлення після змін
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

// Тепер створю функцію, котра при збережені скріптів, автоматично оновлювало сторінку
//  Щоб функція запрацювала, потрібно додати її в дефолтний запуск
function startWatch() {
  watch(["app/html/**/*.html"], includes);
  watch(["app/**/*.js", "!app/**/*.min.js"], scripts); // вибрані усі файли в в app/ js з розширеням js, але крім !app/**/*.min.js вже змініфікованого файлу
  watch(["app/scss/**/*.scss"], styles); // слідкую за усіма файлами scss та їх змінами
  watch(["app/**/*.html"]).on("change", browserSync.reload); // слідкую за усіма html
  watch(["app/images/icons/*.svg"], svgSprites);
}

// Праця зі стилями. Створю функцію для стиолів. Створю в папці файл scss
// Потрібно встановити плагіни
// npm i --save-dev gulp-sass sass gulp-less gulp-autoprefixer gulp-clean-css
function styles() {
  // паралельне підключення через parallel
  return src("app/scss/style.scss") // вибираю файл для обробки і хчитування даних
    .pipe(
      scss({
        outputStyle: "compressed", // роблю компресію
      })
    )
    .pipe(concat("style.min.css")) // поєдную в мініфіковану версію
    .pipe(
      autoprefixer({
        // додаю префіксти типу --web... для різних браузерів
        overrideBrowserslist: ["last 10 versions"], // для браузерів остані 10 версій
        grid: true,
      })
    )
    .pipe(
      cleancss({
        level: {
          1: {
            specialComments: 0,
          },
        } /* , format: 'beautify' */,
      })
    ) //мініфікація стилів
    .pipe(dest("app/css")) // вигружаю результат
    .pipe(browserSync.stream()); // слідкую за змінами
}

// Робота з зображенями. Встановлю кілька плагінів
// npm i --save-dev compress-images gifsicle@5.3.0 pngquant-bin@6.0.0 gulp-clean
// УВАГА - для стабільної роботи, потрібно поставити pngquant-bin@6.0.0 версія(6) і gifsicle версии 5.3.0.
function imageMin() {
  return src("app/images/**/*.*")
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
    .pipe(dest("dist/images"));
}

function buildcopy() {
  return src(
    [
      "app/**/*.html",
      "app/css/style.min.css",
      "app/js/script.min.js",
      "app/images/**/*.*",
    ],
    {
      base: "app",
    }
  ).pipe(dest("dist"));
}

//  буваж при роботі з зображенями, потрібно очистити усю папку з фото
function cleanImg() {
  return src("app/images/dest", {
    allowEmpty: true,
  }).pipe(clean()); // видаляю всі готові фото
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

exports.browsersync = browsersync; // експортую наш таск як функцію
exports.scripts = scripts; // експорт функції для роботи
exports.styles = styles; // експортую для роботи
exports.imageMin = imageMin; // укспорт для роботи
exports.cleanImg = cleanImg;
exports.includes = includeS; // укспорт для роботи
exports.svgSprites = svgSprites;
// exports.default - дозволяє запускати однією командою gulp
exports.build = series(cleanImg, imageMin, buildcopy);
exports.default = parallel(
  includeS,
  svgSprites,
  styles,
  scripts,
  browsersync,
  startWatch
); // тепер ці функцї запускаються паралельно
