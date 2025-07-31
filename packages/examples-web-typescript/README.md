# examples-web-typescript

## Table of Contents <!-- omit in toc -->

- [examples-web-typescript](#examples-web-typescript)
  - [References](#references)
  - [Getting Started](#getting-started)
  - [Development](#development)
    - [How the project was initialized](#how-the-project-was-initialized)

## References

- <https://www.typescriptlang.org/>

## Getting Started

Install dependency packages:

```shell
pnpm install
```

Start server:

```shell
pnpm run start
```

## Development

### How the project was initialized

This project was initialized with the following command:

```sh
mkdir -p packages/examples-web-typescript
cd packages/examples-web-typescript

# Generate package.json
pnpm init

pnpm add typescript -D
pnpm add ts-node nodemon -D
pnpm add @types/node -D

pnpm add http-server

pnpm tsc --init --rootDir ./src --outDir ./dist --module esnext --target es2022
```
