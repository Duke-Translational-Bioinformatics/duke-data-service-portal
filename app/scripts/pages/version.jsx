import React from 'react'
import ProjectActions from '../actions/projectActions';
import ProjectStore from '../stores/projectStore';
import Provenance from '../components/globalComponents/provenance.jsx';
import VersionDetails from '../components/fileComponents/versionDetails.jsx';

class Version extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            addEdgeMode: ProjectStore.addEdgeMode,
            autoCompleteLoading: ProjectStore.autoCompleteLoading,
            dltRelationsBtn: ProjectStore.dltRelationsBtn,
            error: ProjectStore.error,
            errorModal: ProjectStore.errorModal,
            fileVersions: ProjectStore.fileVersions,
            relFrom: ProjectStore.relFrom,
            loading: false,
            moveModal: ProjectStore.moveModal,
            moveErrorModal: ProjectStore.moveErrorModal,
            position: ProjectStore.position,
            projPermissions: ProjectStore.projPermissions,
            provEdges: ProjectStore.provEdges,
            provEditorModal: ProjectStore.provEditorModal,
            provFileVersions: ProjectStore.provFileVersions,
            provNodes: ProjectStore.provNodes,
            relMsg: ProjectStore.relMsg,
            toggleProv: ProjectStore.toggleProv,
            toggleProvEdit: ProjectStore.toggleProvEdit,
            relTo: ProjectStore.relTo,
            scale: ProjectStore.scale,
            screenSize: ProjectStore.screenSize,
            searchFilesList: ProjectStore.searchFilesList,
            selectedEdge: ProjectStore.selectedEdge,
            selectedNode: ProjectStore.selectedNode,
            showProvAlert: ProjectStore.showProvAlert,
            showProvCtrlBtns: ProjectStore.showProvCtrlBtns,
            showProvDetails: ProjectStore.showProvDetails,
            updatedGraphItem: ProjectStore.updatedGraphItem
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
        ProjectActions.getProvenance(id, 'dds-file-version');
    }

    render() {
        if(this.state.entityObj && this.props.currentUser && this.props.currentUser.id) {
            let projId = this.state.entityObj && this.state.entityObj.file.project ? this.state.entityObj.file.project.id : null;
            let userId = this.props.currentUser && this.props.currentUser.id ? this.props.currentUser.id : null;
            if (this.state.projPermissions === null) ProjectActions.getPermissions(projId, userId);
        }
        return (
            <div>
                <Provenance {...this.props} {...this.state}/>
                <VersionDetails {...this.props} {...this.state}/>
            </div>
        );
    }
}

export default Version;