import React from 'react';
import ProjectList from '../components/projectComponents/projectList.jsx';
import AccountOverview from '../components/globalComponents/accountOverview.jsx';
import ProjectStore from '../stores/projectStore';
import ProjectListActions from '../actions/projectListActions';
import FolderStore from '../stores/folderStore';
import FileStore from '../stores/fileStore';
import MainStore from '../stores/mainStore';
import MainActions from '../actions/mainActions';

let mui = require('material-ui'),
    Snackbar = mui.Snackbar;

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            projects: ProjectStore.projects,
            files: FileStore.files,
            folders: FolderStore.folders,
            loading: false
        };
    }

    componentDidMount() {
        let id = this.props.params.id;
        this.unsubscribe = ProjectStore.listen(state => this.setState(state));
        ProjectListActions.loadProjects(id);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        return (
            <div>
                <AccountOverview { ...this.state } { ...this.props } />
                <ProjectList { ...this.state } { ...this.props } />
            </div>
        );
    }
}


export default Home;