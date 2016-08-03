import React from 'react'
import ProjectActions from '../actions/projectActions';
import ProjectStore from '../stores/projectStore';
import FileDetails from '../components/fileComponents/fileDetails.jsx';

class File extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: ProjectStore.error,
            errorModal: ProjectStore.errorModal,
            loading: false,
            moveModal: ProjectStore.moveModal,
            moveErrorModal: ProjectStore.moveErrorModal,
            projPermissions: ProjectStore.projPermissions
        };
    }

    componentDidMount() {
        let kind = 'files';
        let id = this.props.params.id;
        this.unsubscribe = ProjectStore.listen(state => this.setState(state));
        this._loadFile(id, kind);
    }

    componentDidUpdate(prevProps) {
        let kind = 'files';
        let id = this.props.params.id;
        if(prevProps.params.id !== this.props.params.id) {
            this._loadFile(id, kind);
        }
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    _loadFile(id, kind) {
        ProjectActions.getEntity(id, kind);
        ProjectActions.getFileVersions(id);
    }

    render() {
        if(this.state.entityObj && this.props.currentUser && this.props.currentUser.id) {
            let projId = this.state.entityObj && this.state.entityObj.project ? this.state.entityObj.project.id : null;
            let userId = this.props.currentUser && this.props.currentUser.id ? this.props.currentUser.id : null;
            if (this.state.projPermissions === null) ProjectActions.getPermissions(projId, userId);
        }
        return (
            <div>
                <FileDetails {...this.props} {...this.state} />
            </div>
        );
    }
}

export default File;