const fs = require("fs");

module.exports = {
  syntax: "postcss-scss",
  parser: "postcss-scss",
  plugins: [
    require("postcss-easy-import")({
      extensions: ".scss"
    }),
    require("autoprefixer")({
      browsers: ["last 2 versions"],
      cascade: false
    }),
    require("postcss-advanced-variables")({
      variables: JSON.parse(
        fs.readFileSync("./src/assets/styles/variables.json", "utf-8")
      )
    }),
    require("postcss-nested"),
    require("postcss-rgb"),
    require("postcss-inline-svg")({
      removeFill: true,
      path: "./src/assets/images/icons"
    }),
    require("postcss-svgo"),
    require("cssnano")()
  ]
};
