import React from 'react';
import ProjectListActions from '../actions/projectListActions';
import ProjectStore from '../stores/projectStore';
import FolderActions from '../actions/folderActions';
import FolderStore from '../stores/folderStore';
import ProjectContents from '../components/projectContents.jsx';
import ProjectDetails from '../components/projectDetails.jsx';
import Header from '../components/header.jsx';

class Project extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            folders: [],
            projects: [],
            loading: false
        };
    }

    componentDidMount() {
        let id = this.props.params.id;
        this.unsubscribe = FolderStore.listen(this.onStatusChange.bind(this));
        FolderActions.loadFolders(id);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onStatusChange(state) {
        this.setState(state);
    }

    render() {
        return (
            <div>
                <ProjectDetails { ...this.state } {...this.props} />
                <ProjectContents { ...this.state } {...this.props} />
            </div>
        );
    }
}

export default Project;