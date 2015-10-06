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
            loading: false,
            msg: ProjectStore.msg,
            ref: ProjectStore.ref,
            toastState: ProjectStore.toastState
        };
    }

    componentDidMount() {
        let id = this.props.params.id;
        this.unsubscribe = ProjectStore.listen(state => this.setState(state));
        ProjectListActions.loadProjects(id);
    }

    componentDidUpdate() {
        if(this.state.toastState){this.refs.snackbarDelete.show()}
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        return (
            <div>
                <AccountOverview { ...this.state } { ...this.props } />
                <ProjectList { ...this.state } { ...this.props } />
                <Snackbar
                    ref={this.state.ref}
                    message={this.state.msg}
                    autoHideDuration={1300}/>
            </div>
        );
    }
}


export default Home;