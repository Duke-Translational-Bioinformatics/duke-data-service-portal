import React from 'react';
import { Route, DefaultRoute, NotFoundRoute } from 'react-router';

import App from './pages/app.jsx';
import Login from './pages/login.jsx';
import Home from './pages/home.jsx';
import Project from './pages/project.jsx';
import Folder from './pages/folder.jsx';
import File from './pages/file.jsx';
import NotFound from './pages/notFound.jsx';

var routes = (
    <Route name="app" path="/" handler={ App }>
        <Route name="login" handler={ Login } />
        <Route name="loginTokens" path="/login/:tokens" handler={ Login } />
        <Route name="home" handler={ Home } />
        <Route name="project/:id" handler={ Project } />
        <Route name="folder/:id" handler={ Folder } />
        <Route name="file/:id" handler={File} />
        <DefaultRoute handler={ Home } />
        <NotFoundRoute handler={ NotFound } />
    </Route>
);

export default routes;
