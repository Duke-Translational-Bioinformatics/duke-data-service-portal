import ReactDOM from 'react-dom'
import routes from './routes';
import './styles/index.css';
require('./util/polyfills.js');

// require('es6-promise').polyfill();
// require('babel-polyfill');

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

ReactDOM.render(routes, document.getElementById('root'));