import React from 'react';
import { Route, DefaultRoute, NotFoundRoute } from 'react-router';

import App from './pages/app.jsx';
import Login from './pages/login.jsx';
import Home from './pages/home.jsx';
import Metadata from './pages/metadata.jsx';
import Privacy from './pages/privacy.jsx';
import PublicPrivacy from './pages/publicPrivacy.jsx';
import Project from './pages/project.jsx';
import Folder from './pages/folder.jsx';
import File from './pages/file.jsx';
import Agents from './pages/agents.jsx';
import Agent from './pages/agent.jsx';
import Results from './pages/results.jsx';
import Version from './pages/version.jsx';
import NotFound from './pages/notFound.jsx';

var routes = (
    <Route name="app" path="/" handler={ App }>
        <Route name="home" handler={ Home } />
        <Route name="metadata" handler={ Metadata } />
        <Route name="privacy" handler={ Privacy } />
        <Route name="public_privacy" handler={ PublicPrivacy } />
        <Route name="project/:id" handler={ Project } />
        <Route name="folder/:id" handler={ Folder } />
        <Route name="file/:id" handler={File} />
        <Route name="agents" handler={ Agents } />
        <Route name="agent/:id" handler={ Agent } />
        <Route name="results" handler={ Results } />
        <Route name="version" handler={ Version } />
        <Route name="version/:id" handler={ Version } />
        <Route name="login" handler={ Login } />
        <Route path='notFound' handler={ NotFound } />
        <DefaultRoute handler={ Home } />
        <Route name="loginTokens" path="/:access_token" handler={ Login } />
    </Route>
);

export default routes;