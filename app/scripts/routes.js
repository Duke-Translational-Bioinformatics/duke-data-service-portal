import React from 'react';
import { Route, DefaultRoute, NotFoundRoute } from 'react-router';

import App from './pages/app.jsx';
import Login from './pages/login.jsx';
import Home from './pages/home.jsx';
import Project from './pages/project.jsx';
import Folder from './pages/folder.jsx';
import File from './pages/file.jsx';
import Agents from './pages/agents.jsx';
import Agent from './pages/agent.jsx';
import Version from './pages/version.jsx';
import NotFound from './pages/notFound.jsx';

var routes = (
    <Route name="app" path="/" handler={ App }>
        <Route name="login" handler={ Login } />
        <Route name="loginTokens" path="/login/:tokens" handler={ Login } />
        <Route name="home" handler={ Home } />
        <Route name="project/:id" handler={ Project } />
        <Route name="folder/:id" handler={ Folder } />
        <Route name="file/:id" handler={File} />
        <Route name="agents" handler={ Agents } />
        <Route name="agent/:id" handler={ Agent } />
        <Route name="version" handler={ Version } />
        <Route name="version/:id" handler={ Version } />
        <DefaultRoute handler={ Home } />
        <NotFoundRoute handler={ NotFound } />
    </Route>
);

export default routes;