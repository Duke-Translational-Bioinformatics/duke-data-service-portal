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
            currentUser: ProjectStore.currentUser,
            error: ProjectStore.error,
            errorModal: ProjectStore.errorModal,
            filesChecked: ProjectStore.filesChecked,
            foldersChecked: ProjectStore.foldersChecked,
            loading: false,
            projects: ProjectStore.projects,
            project: ProjectStore.project,
            searchText: ProjectStore.searchText,
            uploads: ProjectStore.uploads,
            users: ProjectStore.users
        };
    }

    componentDidMount() {
        if(this.state.searchText !== '') ProjectActions.setSearchText('');
        let id = this.props.params.id;
        this.unsubscribe = ProjectStore.listen(state => this.setState(state));
        ProjectActions.getChildren(id, 'projects/');
        ProjectActions.showDetails(id);
        ProjectActions.getProjectMembers(id);
        ProjectActions.getUser(id);
    }

    componentDidUpdate(prevProps) {
        let id = this.props.params.id;
        if(prevProps.children !== this.props.children) {
            this.getChildren(id, 'projects/');
        }
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