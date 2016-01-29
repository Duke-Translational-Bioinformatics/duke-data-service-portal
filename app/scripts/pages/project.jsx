import React from 'react';
import { RouteHandler } from 'react-router';
import ProjectActions from '../actions/projectActions';
import ProjectStore from '../stores/projectStore';
import MainStore from '../stores/mainStore';
import MainActions from '../actions/mainActions';
import ProjectChildren from '../components/projectComponents/projectChildren.jsx';
import ProjectDetails from '../components/projectComponents/projectDetails.jsx';
import Header from '../components/globalComponents/header.jsx';

class Project extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            children: ProjectStore.children,
            projects: ProjectStore.projects,
            project: ProjectStore.project,
            currentUser: ProjectStore.currentUser,
            loading: false,
            uploading: ProjectStore.uploading,
            uploadCount: ProjectStore.uploadCount
        };
    }

    componentDidMount() {
        let id = this.props.params.id;
        this.unsubscribe = ProjectStore.listen(state => this.setState(state));
        ProjectActions.loadProjectChildren(id);
        ProjectActions.showDetails(id);
        ProjectActions.getProjectMembers(id);
        ProjectActions.getUser();
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