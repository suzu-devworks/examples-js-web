# examples-js-express

## Project Setup

```sh
npm install
```

### Start

```sh
npm run start

# or

DEBUG=examples-js-express:* npm run start
```

<!-- ----- -->

## Project Created

```sh
mkdir examples-js-express
cd examples-js-express

express --view ejs --css sass -git

# un-suppoted package in template.
npm uninstall node-sass-middleware

# add
npm install express-dart-sass sass
npm install express-session

npm install @primer/css

npm install --save-dev nodemon
npm install --save-dev eslint prettier eslint-config-prettier
npm install --save-dev npm-run-all

# generate eslintrc.js
npm init @eslint/config

# check outdated
npm outdated

```

## References

- [express-dart-sass](https://github.com/Colbyjdx/express-dart-sass)
- [nodemon](https://github.com/remy/nodemon)

- [Material Components for the web](https://github.com/material-components/material-components-web)
  - [日本語訳](https://github.com/YuoMamoru/material-components-web)
- [Primer CSS - GitHub](https://primer.style/css/)
  - [日本語情報](https://segakuin.com/css/primer/)
- [Materialize](https://materializecss.com/)
- [Pure.CSS - Yahoo](https://purecss.io/)
