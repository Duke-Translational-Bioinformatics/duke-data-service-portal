import React from 'react'
import ProjectActions from '../actions/projectActions';
import ProjectStore from '../stores/projectStore';
import VersionDetails from '../components/fileComponents/versionDetails.jsx';
import Header from '../components/globalComponents/header.jsx';

class Version extends React.Component {

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
        let id = this.props.params.id;
        this.unsubscribe = ProjectStore.listen(state => this.setState(state));
        this._loadVersion(id);
    }

    componentDidUpdate(prevProps) {
        let id = this.props.params.id;
        if(prevProps.params.id !== this.props.params.id) {
            this._loadVersion(id);
        }
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    _loadVersion(id) {
        let kind = 'file_versions';
        ProjectActions.getEntity(id, kind);
    }

    render() {
        if(this.state.entityObj && this.props.currentUser && this.props.currentUser.id) {
            let kind = 'files';
            let fileId = this.state.entityObj && this.state.entityObj.file ? this.state.entityObj.file.id : null;
            let userId = this.props.currentUser && this.props.currentUser.id ? this.props.currentUser.id : null;
            if (this.state.projPermissions === null) ProjectActions.getVersionPermissions(fileId, kind, userId);
        }
        return (
            <div>
                <VersionDetails {...this.props} {...this.state}/>
            </div>
        );
    }
}

export default Version;