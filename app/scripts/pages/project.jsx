import React from 'react';
import { RouteHandler } from 'react-router';
import ProjectListActions from '../actions/projectListActions';
import ProjectStore from '../stores/projectStore';
import FolderActions from '../actions/folderActions';
import FolderStore from '../stores/folderStore';
import ProjectContents from '../components/projectComponents/projectContents.jsx';
import ProjectDetails from '../components/projectComponents/projectDetails.jsx';
import Header from '../components/globalComponents/header.jsx';

let mui = require('material-ui'),
    Snackbar = mui.Snackbar;


class Project extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            folders: FolderStore.folders,
            projects: ProjectStore.projects,
            loading: false
        };
    }

    componentDidMount() {
        let id = this.props.params.id;
        this.unsubscribe = FolderStore.listen(state => this.setState(state));
        FolderActions.loadFolders(id);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        return (
            <div>
                <!--<RouteHandler {...this.props} {...this.state} />-->
                <ProjectDetails {...this.props} {...this.state} />
                <ProjectContents {...this.props} {...this.state} />
            </div>
        );
    }
}

export default Project;