import React from 'react';
import Router from 'react-router';
import routes from './routes';

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

let appRouter = Router.create({
    routes: routes,
    location: Router.HashLocation
});

appRouter.run((Handler, state) => {
    React.render(<Handler routerPath={state.path} appRouter={appRouter}/>, document.body)
});

