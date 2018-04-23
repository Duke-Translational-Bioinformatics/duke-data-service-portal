import React from 'react';
import { Router, Route, IndexRoute, Redirect, hashHistory } from 'react-router';
import App from './pages/app.jsx';
import Login from './pages/login.jsx';
import Home from './pages/home.jsx';
import Metadata from './pages/metadata.jsx';
import Privacy from './pages/privacy.jsx';
import PublicPrivacy from './pages/publicPrivacy.jsx';
import Project from './pages/project.jsx';
import Folder from './pages/folder.jsx';
import File from './pages/file.jsx';
import Activity from './pages/activity.jsx';
import Agents from './pages/agents.jsx';
import Agent from './pages/agent.jsx';
import Search from './pages/search.jsx';
import Version from './pages/version.jsx';
import Navigator from './pages/navigator.jsx';
import NotFound from './pages/notFound.jsx';

const routes = (
    <Router history={ hashHistory }>
        <Route path="/" component={ App } >
            <IndexRoute component={Home}/>
            <Route path="/404" component={ NotFound } />
            <Redirect from="/home" to="/" />
            <Route path="metadata" component={ Metadata } />
            <Route path="privacy" component={ Privacy } />
            <Route path="public_privacy" component={ PublicPrivacy } />
            <Route path="project/:id" component={ Project }/>
            <Route path="folder/:id" component={ Folder } />
            <Route path="file/:id" component={ File } />
            <Route path="activity/:id" component={ Activity } />
            <Route path="agents" component={ Agents } />
            <Route path="agent/:id" component={ Agent } />
            <Route path="search" component={ Search } />
            <Route path="version" component={ Version } />
            <Route path="version/:id" component={ Version } />
            <Route path="login" component={ Login } />
            <Route path="navigator" component={ Navigator } />
            <Route path="navigator/:path/:id" component={ Navigator } />
            <Route path="/(:access_token)" component={ Login } />
        </Route>
    </Router>
);

export default routes;