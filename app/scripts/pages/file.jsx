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
            dltRelationsBtn: ProjectStore.dltRelationsBtn,
            error: ProjectStore.error,
            errorModal: ProjectStore.errorModal,
            filesChecked: ProjectStore.filesChecked,
            loading: false,
            moveModal: ProjectStore.moveModal,
            moveErrorModal: ProjectStore.moveErrorModal,
            objectTags: ProjectStore.objectTags,
            openTagManager: ProjectStore.openTagManager,
            position: ProjectStore.position,
            projPermissions: ProjectStore.projPermissions,
            provEdges: ProjectStore.provEdges,
            provEditorModal: ProjectStore.provEditorModal,
            provNodes: ProjectStore.provNodes,
            relMsg: ProjectStore.relMsg,
            toggleProv: ProjectStore.toggleProv,
            toggleProvEdit: ProjectStore.toggleProvEdit,
            relFrom: ProjectStore.relFrom,
            relTo: ProjectStore.relTo,
            scale: ProjectStore.scale,
            screenSize: ProjectStore.screenSize,
            selectedEdge: ProjectStore.selectedEdge,
            selectedNode: ProjectStore.selectedNode,
            showProvAlert: ProjectStore.showProvAlert,
            showProvCtrlBtns: ProjectStore.showProvCtrlBtns,
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
        //if(this.state.entityObj && this.state.entityObj.current_version){
        //    let versionId = this.state.entityObj.current_version.id;
        //    ProjectActions.getProvenance(versionId, 'dds-file-version');
        //}
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
        setTimeout(()=>{
            let versionId = this.state.entityObj.current_version.id;
            //ProjectActions.getProvenance(versionId, 'dds-file-version');
            console.log(versionId)
        }, 1000)
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