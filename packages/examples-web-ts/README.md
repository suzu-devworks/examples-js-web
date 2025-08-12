# examples-web-ts

## Table of Contents <!-- omit in toc -->

- [examples-web-ts](#examples-web-ts)
  - [References](#references)
  - [Getting Started](#getting-started)
    - [Setup](#setup)
    - [Development Server](#development-server)
    - [Production](#production)
  - [Development](#development)
    - [How the project was initialized](#how-the-project-was-initialized)

## References

- <https://www.typescriptlang.org/>

## Getting Started

### Setup

Install the dependency packages:

```shell
pnpm install
```

### Development Server

Start the development server on `http://localhost:5173`:

Start server:

```shell
pnpm run start
```

### Production

Build the application for production:

```bash
pnpm run build
```

Locally preview production build:

```bash
pnpm run preview
```

## Development

### How the project was initialized

This project was initialized with the following command:

```sh
# Generate package.json
pnpm create vite -t vanilla-ts packages/examples-web-ts
```
