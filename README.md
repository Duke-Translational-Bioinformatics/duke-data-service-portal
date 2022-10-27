# Duke Data Service Portal


*** This Project is no longer being maintained ***

This is a UI web portal built for use with the [Duke Data Service API](https://github.com/Duke-Translational-Bioinformatics/duke-data-service/tree/master).
It is based on [webpack](https://github.com/webpack/webpack).
The internal data flow is handled with [MobX](https://mobx.js.org/refguide/api.html) and routing is managed with
 [React-Router](https://github.com/rackt/react-router). The UI is handled by [material-ui](http://material-ui.com/)
 and a layout grid from Google Material Design Lite.

## Get the portal

```
$ git clone https://github.com/Duke-Translational-Bioinformatics/duke-data-service-portal.git 
```

## Installation

Install all dependencies. 

```
$ npm install
```

## Development

Builds the application and starts a webserver with webpack. By default the webserver starts at port 1337.
You can define a port in `package.json: scripts > start`.

```
$ npm start
```

## Build

Builds a minified version of the application for production in the build folder.

```
$ npm run build
```

## Testing

We use [jest](http://facebook.github.io/jest/) to test our application.<br />
You can run the tests that are defined under [app/scripts/\_\_tests__](./app/scripts/__tests__) with

```
$ npm test

```

In order to test files that are using the react-router we had to add [stubRouterContext.jsx](./test-utils/stubRouterContext.jsx) which we found [here](https://github.com/rackt/react-router/blob/master/docs/guides/testing.md). 

## Duke Data Service

The portal interfaces with the [Duke Data Service API](https://github
.com/Duke-Translational-Bioinformatics/duke-data-service/tree/master). The API blueprint for Duke Data Service can be
 found on this [API documentation page](http://docs.dukedataservices.apiary.io/#reference/api-usage).

## Javascript

Javascript entry file: `src/scripts/index.js` <br />

**MobX**

We are using MobX to manage application state. Mobx makes state management simple and scalable by transparently
applying functional reactive programming (TFRP). If you want to read more about MobX, check out the readme of the
[MobX git repo](https://github.com/mobxjs/mobx/blob/master/README.md) or the [MobX API documentation](https://mobx.js.org/refguide/api.html).

**React-Router**

The routing is done with the [react-router](https://github.com/rackt/react-router). It's especially great for SPA's. We would recommend to read the [guide](https://github.com/rackt/react-router/blob/master/docs/guides/overview.md) to get an overview of the router features.

**ES6 with babel**

We are working with the webpack [babel loader](https://github.com/babel/babel-loader) in order to load our .js/.jsx files. Babel allows you to use ES6 features like class, arrow functions and [much more](https://babeljs.io/docs/compare/).

## CSS

CSS entry file: `src/styles/index.css`<br />

## Webpack Hints

You can find the webpack configuration in the [webpack.config.js file](./config/webpack.config.js).
We use the babel-loader in order to load .jsx and .js files via webpack. If it's possible install all your dependencies with NPM. Packages installed with NPM can be used as es6 modules or via require:

```language-javascript

import moduleXYZ from 'moduleXYZ';

```
or

```language-javascript

var moduleXYZ = require('moduleXYZ');

```

You can find all loaders in this [list](http://webpack.github.io/docs/list-of-loaders.html).


###Requirements
* node
* npm