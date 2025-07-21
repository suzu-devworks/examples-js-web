# examples-express-ejs

## Table of Contents <!-- omit in toc -->

- [examples-express-ejs](#examples-express-ejs)
  - [References](#references)
  - [Getting Started](#getting-started)
  - [Development](#development)
    - [How the project was initialized](#how-the-project-was-initialized)

## References

- [express-dart-sass](https://github.com/Colbyjdx/express-dart-sass)
- [nodemon](https://github.com/remy/nodemon)

- [Material Components for the web](https://github.com/material-components/material-components-web)
  - [日本語訳](https://github.com/YuoMamoru/material-components-web)
- [Primer CSS - GitHub](https://primer.style/css/)
  - [日本語情報](https://segakuin.com/css/primer/)
- [Materialize](https://materializecss.com/)
- [Pure.CSS - Yahoo](https://purecss.io/)

## Getting Started

Install dependency packages:

```shell
pnpm install
```

Start server:

```shell
pnpm run start
```

or

```shell
DEBUG=examples-js-express:* pnpm run start
```

## Development

### How the project was initialized

```shell
mkdir -p packages/examples-express-ejs
cd packages/examples-express-ejs

# Generate package.json
pnpm init

pnpm dlx express-generator --view ejs --css sass --git

# un-supported package in template.
pnpm remove node-sass-middleware

pnpm add express-dart-sass sass
pnpm add express-session
pnpm add @primer/css

```
