import React from 'react';
import { RouteHandler } from 'react-router';
import ProjectActions from '../actions/projectActions';
import ProjectStore from '../stores/projectStore';
import ProjectChildren from '../components/projectComponents/projectChildren.jsx';
import ProjectDetails from '../components/projectComponents/projectDetails.jsx';
import Header from '../components/globalComponents/header.jsx';

let mui = require('material-ui'),
    Snackbar = mui.Snackbar;


class Project extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            children: ProjectStore.children,
            projects: ProjectStore.projects,
            project: ProjectStore.project,
            loading: false
        };
    }

    componentDidMount() {
        let id = this.props.params.id;
        this.unsubscribe = ProjectStore.listen(state => this.setState(state));
        ProjectActions.loadProjectChildren(id);
        ProjectActions.showDetails(id);
        ProjectActions.getProjectMembers(id);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        return (
            <div>
                <ProjectDetails {...this.props} {...this.state} />
                <ProjectChildren {...this.props} {...this.state} />
            </div>
        );
    }
}

export default Project;