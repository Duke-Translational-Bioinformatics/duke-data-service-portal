import React from 'react'
import ProjectActions from '../actions/projectActions';
import ProjectStore from '../stores/projectStore';
import FileDetails from '../components/fileComponents/fileDetails.jsx';
import Header from '../components/globalComponents/header.jsx';
import TagManager from '../components/globalComponents/tagManager.jsx'

class File extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: ProjectStore.error,
            errorModal: ProjectStore.errorModal,
            loading: false,
            moveModal: ProjectStore.moveModal,
            moveErrorModal: ProjectStore.moveErrorModal,
            objectTags: ProjectStore.objectTags,
            openTagManager: ProjectStore.openTagManager,
            projPermissions: ProjectStore.projPermissions,
            screenSize: ProjectStore.screenSize,
            tagAutoCompleteList: ProjectStore.tagAutoCompleteList,
            tagLabels: ProjectStore.tagLabels
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
        if(prevProps.objectTags !== this.props.objectTags) {
            ProjectActions.getTags(id, 'dds-file');
        }
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    _loadFile(id, kind) {
        ProjectActions.getEntity(id, kind);
        ProjectActions.getFileVersions(id);
        ProjectActions.getTags(id, 'dds-file');
        ProjectActions.getTagLabels(); // Used to generate a list of tag labels
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
                <TagManager {...this.props} {...this.state} />
            </div>
        );
    }
}

export default File;