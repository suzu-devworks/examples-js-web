# examples-web-visualization

## Table of Contents <!-- omit in toc -->

- [examples-web-visualization](#examples-web-visualization)
  - [Getting Started](#getting-started)
  - [Index](#index)
  - [Development](#development)
    - [How the project was initialized](#how-the-project-was-initialized)

## Getting Started

Install dependency packages:

```shell
pnpm install
```

Start server:

```shell
pnpm run start
```

## Index

- [Chart.js examples](./public/chartjs/README.md)
- [D3.js examples](./public/d3js/README.md)
- [QRCode.js examples](./public/qrcodejs/README.md)
- [Html5-QRCode examples](./public/html5-qrcode/README.md)

## Development

### How the project was initialized

This project was initialized with the following command:

```sh
mkdir -p packages/examples-web-visualization
cd packages/examples-web-visualization

# Generate package.json
pnpm init

pnpm add http-server
```
