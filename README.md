# Terra Telegram Bot Website

This website is an additional module for [Terra Telegram Bot](https://github.com/block42-blockchain-company/thornode-telegram-bot) and operates with [terra-telegram-bot-backend](https://github.com/block42-blockchain-company/terra-telegram-bot-backend).

This website is meant to be lightweight and is powered just by:
 - Webpack 4
 - Typescript
 - Bulma
 
It uses Terra Station Extension to communicate with Terra chain.

## Running the project
### From command line
Before running any command remember to install dependencies with
```
npm install
```
To start dev server use
```
npm run start
```

To build production bundle use
```
npm run build:prod
```
Bundled source is available under `/dist`.

### From Intellij
Intellij configurations are available out of the box. To debug the code first run `start` configuration and then `debug`. Make sure to have intellij browser plugin installed.

## Connect with your own backend instance
To connect it with your self hosted backend instace simply set 
`backendUrl` variable in `/src/scripts/consts.ts` file to your address.