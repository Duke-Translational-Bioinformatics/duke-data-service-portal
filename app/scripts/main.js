import React from 'react';
import ReactDOM from 'react-dom'
import Router from 'react-router';
import routes from './routes';
import _  from 'lodash';
require('./util/polyfills.js');
require('es6-promise').polyfill();
require('babel-polyfill');

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

ReactDOM.render(routes, document.body);
