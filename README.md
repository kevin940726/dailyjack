# dailyjack
向 **__Jack** 請安

This is a monorepo managed by `lerna`. There are a set of packages inside it.

- `dailyjack-core`: Core functionality and dataset of `dailyjack`.
- `dailyjack-api`: A headless api server powered by `claudia` and `AWS lambda`, also include slack slash command api.

## Getting Started

First make sure you have `lerna` installed globally, and run the commands after cloning.

```sh
npm install
npm run bootstrap
```

`lerna` will install the dependencies of each packages and symlink each package to each other.

## License

MIT
