/** @type {import('stylelint').Config} */
export default {
  extends: ["stylelint-config-standard-scss", "stylelint-config-recess-order"],
  ignoreFiles: ["packages/examples-express-ejs/**/*.css", "**/generated/*.css"],
  rules: {
    "alpha-value-notation": "number",
  },
}
