const gulp = require("gulp");
const config = require("./env.paths.json");
const env = process.env.NODE_ENV;


const $gp = require("gulp-load-plugins")();

const browserSync = require("browser-sync").create();
const reload = browserSync.reload;
const $webpack = require("webpack-stream");
const webpack = require("webpack");
const del = require("del");


gulp.task("styles", () => {
  return gulp
    .src(`${config.SRC_DIR}/styles/main.scss`)
    .pipe($gp.sourcemaps.init())
    .pipe($gp.plumber())
    .pipe($gp.postcss(require("./postcss.config")))
    .pipe($gp.rename("main.min.css"))
    .pipe($gp.if(env === "development", $gp.sourcemaps.write()))
    .pipe(gulp.dest(`${config.DIST_DIR}`))
    .pipe(reload({ stream: true }));
});


gulp.task("fonts", () => {
  return gulp
    .src(`${config.SRC_DIR}/fonts/**`)
    .pipe(gulp.dest(`${config.DIST_DIR}/assets/fonts/`));
});


gulp.task("clean", () => {
  return del(config.ROOT_PATH);
});


gulp.task("scripts", () => {
  return gulp
    .src(`${config.SRC_DIR}/scripts/*.js`)
    .pipe($gp.plumber())
    .pipe(
      $webpack(
        {
          ...require("./webpack.mpa.config"),
          mode: env
        },
        webpack
      )
    )
    .pipe(gulp.dest(`${config.DIST_DIR}`))
    .pipe(reload({ stream: true }));
});


gulp.task("pug", () => {
  return gulp
    .src(`${config.VIEWS_DIR}/pages/*.pug`)
    .pipe($gp.plumber())
    .pipe($gp.pug())
    .pipe(gulp.dest(`${config.DIST_DIR}`))
    .pipe(reload({ stream: true }));
});


gulp.task("server", () => {
  browserSync.init({
    server: {
      baseDir: `${config.DIST_DIR}`
    },
    open: false
  });
});


gulp.task("svg", done => {
  return gulp
    .src(`${config.SRC_DIR}/images/icons/*.svg`)
    .pipe(
      $gp.svgmin({
        js2svg: {
          pretty: true
        },
        plugins: [

        ]
      })
    )
    .pipe(
      $gp.cheerio({
        run($) {
          $("[fill], [stroke], [style], [width], [height]")
            .removeAttr("fill")
            .removeAttr("stroke")
            .removeAttr("style");
        },
        parserOptions: { xmlMode: true }
      })
    )
    .pipe($gp.replace("&gt;", ">"))
    .pipe(
      $gp.svgSprite({
        mode: {
          symbol: {
            sprite: "../sprite.svg"
          }
        }
      })
    )
    .pipe(gulp.dest(`${config.DIST_DIR}/assets/images/icons`));
});


gulp.task("images", () => {
  return gulp
    .src([
      `${config.SRC_DIR}/images/**/*.*`,
      `!${config.SRC_DIR}/images/icons/*.*`
    ])
    .pipe(gulp.dest(`${config.DIST_DIR}/assets/images/`));
});


gulp.task("watch", () => {
  gulp.watch(`${config.SRC_DIR}/styles/**/*.scss`, gulp.series("styles"));
  gulp.watch(`${config.SRC_DIR}/images/**/*.*`, gulp.series("images"));
  gulp.watch(`${config.SRC_DIR}/scripts/**/*.js`, gulp.series("scripts"));
  gulp.watch(`${config.SRC_DIR}/fonts/*`, gulp.series("fonts"));
  gulp.watch(`${config.VIEWS_DIR}/**/*.pug`, gulp.series("pug"));
});


gulp.task(
  "default",
  gulp.series(
    "clean",
    "svg",
    gulp.parallel("styles", "pug", "images", "fonts", "scripts"),
    gulp.parallel("watch", "server")
  )
);


gulp.task(
  "build",
  gulp.series(
    "clean",
    "svg",
    gulp.parallel("styles", "pug", "images", "fonts", "scripts")
  )
);
