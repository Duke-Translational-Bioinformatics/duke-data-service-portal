import React from 'react'
import ProjectActions from '../actions/projectActions';
import ProjectStore from '../stores/projectStore';
import FileDetails from '../components/fileComponents/fileDetails.jsx';
import Provenance from '../components/globalComponents/provenance.jsx';
import TagManager from '../components/globalComponents/tagManager.jsx'

class File extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            addEdgeMode: ProjectStore.addEdgeMode,
            autoCompleteLoading: ProjectStore.autoCompleteLoading,
            dltRelationsBtn: ProjectStore.dltRelationsBtn,
            error: ProjectStore.error,
            errorModal: ProjectStore.errorModal,
            filesChecked: ProjectStore.filesChecked,
            drawerLoading: ProjectStore.drawerLoading,
            loading: false,
            moveModal: ProjectStore.moveModal,
            moveErrorModal: ProjectStore.moveErrorModal,
            objectMetadata: ProjectStore.objectMetadata,
            objectTags: ProjectStore.objectTags,
            openTagManager: ProjectStore.openTagManager,
            position: ProjectStore.position,
            projPermissions: ProjectStore.projPermissions,
            provEdges: ProjectStore.provEdges,
            provEditorModal: ProjectStore.provEditorModal,
            provFileVersions: ProjectStore.provFileVersions,
            provNodes: ProjectStore.provNodes,
            relMsg: ProjectStore.relMsg,
            toggleProv: ProjectStore.toggleProv,
            toggleProvEdit: ProjectStore.toggleProvEdit,
            relFrom: ProjectStore.relFrom,
            relTo: ProjectStore.relTo,
            scale: ProjectStore.scale,
            screenSize: ProjectStore.screenSize,
            searchFilesList: ProjectStore.searchFilesList,
            selectedEdge: ProjectStore.selectedEdge,
            selectedNode: ProjectStore.selectedNode,
            showProvAlert: ProjectStore.showProvAlert,
            showProvCtrlBtns: ProjectStore.showProvCtrlBtns,
            showProvDetails: ProjectStore.showProvDetails,
            tagAutoCompleteList: ProjectStore.tagAutoCompleteList,
            tagLabels: ProjectStore.tagLabels,
            updatedGraphItem: ProjectStore.updatedGraphItem
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
        let metadataKind = 'dds-file';
        ProjectActions.getEntity(id, kind);
        ProjectActions.getFileVersions(id);
        ProjectActions.getObjectMetadata(id, metadataKind);
        ProjectActions.getTags(id, 'dds-file');
        ProjectActions.getTagLabels(); // Used to generate a list of tag labels
        ProjectActions.clearSelectedItems(); // Clear checked files and folders from list
    }

    render() {
        if(this.state.entityObj && this.props.currentUser && this.props.currentUser.id) {
            let projId = this.state.entityObj && this.state.entityObj.project ? this.state.entityObj.project.id : null;
            let userId = this.props.currentUser && this.props.currentUser.id ? this.props.currentUser.id : null;
            if (this.state.projPermissions === null) ProjectActions.getPermissions(projId, userId);
        }
        return (
            <div>
                <Provenance {...this.props} {...this.state}/>
                <FileDetails {...this.props} {...this.state} />
                <TagManager {...this.props} {...this.state} />
            </div>
        );
    }
}

export default File;