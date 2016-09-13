import React from 'react';
import ReactDOM from 'react-dom';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import BaseUtils from '../../../util/baseUtils.js';
import AutoComplete from 'material-ui/lib/auto-complete';
import CircularProgress from 'material-ui/lib/circular-progress';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import MenuItem from 'material-ui/lib/menus/menu-item';
import RaisedButton from 'material-ui/lib/raised-button';
import SelectField from 'material-ui/lib/select-field';

class ProvenanceFilePicker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            addFileNode: null,
            floatingErrorText: '',
            node: null,
            projectSelectValue: null,
            timeout: null,
            value: null
        };
    }

    render() {
        let addFile = this.props.provEditorModal.id !== null && this.props.provEditorModal.id === 'addFile' ? this.props.provEditorModal.open : false;
        let autoCompleteData = this.props.searchFilesList.map((file)=>{
            if(file.kind === 'dds-file'){
                return {text: file.name, value: file.name, id: file.id, node: file}
            }
        });
        let fileName = this.props.entityObj && this.props.entityObj.name ? this.props.entityObj.name : null;
        if(fileName === null) fileName = this.props.entityObj ? this.props.entityObj.file.name : null;
        let fileVersion = this.props.entityObj && this.props.entityObj.current_version ? this.props.entityObj.current_version.version : null;
        if(fileVersion === null) fileVersion = this.props.entityObj ? this.props.entityObj.version : null;
        let prjPrm = this.props.projPermissions && this.props.projPermissions !== undefined ? this.props.projPermissions : null;
        let project = this.props.entityObj && this.props.entityObj.current_version ? this.props.entityObj.project.id : null;
        if(project === null) project = this.props.entityObj && this.props.entityObj.file ? this.props.entityObj.file.project.id : null;
        let projects = this.props.projects && this.props.projects.length ? this.props.projects.map((project)=>{
            if(!project.is_deleted) {
                return <MenuItem key={project.id}
                                 value={project.id}
                                 primaryText={project.name}
                                 onTouchTap={() => this.handleProjectSelect(project.id, project.name)}/>
            }
        }) : null;
        let provFileVersions = this.props.provFileVersions.map((node)=>{
            return <li key={node.id}
                       id={node.id}
                       onTouchTap={() => this.useFileVersion(node.file.name, node.version, node)}>
                Version: {node.version}
            </li>
        });
        const addFileNodeActions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={() => this.handleClose('addFile')}/>,
            <FlatButton
                label="Submit"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.addFileToGraph()}
                />
        ];

        return (
            <span>
                <RaisedButton
                    label="Add File"
                    labelStyle={styles.btn.label}
                    style={styles.btn}
                    onTouchTap={() => this.openModal('addFile')}/>
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={this.props.width < 680 ? {width: '100%'} : {}}
                    title="Add File to Graph"
                    autoDetectWindowHeight={true}
                    actions={addFileNodeActions}
                    open={addFile}
                    onRequestClose={() => this.handleClose('addFile')}>
                    <h6 style={{marginTop:0, paddingBottom: 20}}>Add files to the graph. File must already exist in Duke Data Service.</h6>
                    <SelectField id="selectProject"
                                 value={this.state.projectSelectValue === null ? project : this.state.projectSelectValue}
                                 onChange={(e, index, value) => this.handleProjectSelect(e, index, value)}
                                 maxHeight={300}
                                 autoWidth={true}
                                 fullWidth={true}
                                 floatingLabelText="Select a Project"
                                 floatingLabelStyle={{color: '#BDBDBD', fontWeight: 100}}
                                 style={styles.projectSelect}>
                        {projects}
                    </SelectField>
                    <AutoComplete
                        id="searchText"
                        fullWidth={true}
                        style={styles.autoComplete}
                        menuStyle={{maxHeight: 200}}
                        errorText={this.state.floatingErrorText}
                        floatingLabelText="Type a File Name"
                        dataSource={autoCompleteData}
                        filter={AutoComplete.caseInsensitiveFilter}
                        openOnFocus={true}
                        onNewRequest={(value) => this.chooseFileVersion(value)}
                        onUpdateInput={this.handleUpdateInput.bind(this)}/>
                    {this.props.autoCompleteLoading ? <CircularProgress size={1} style={styles.autoCompleteProgress}/> : null}
                    {this.props.provFileVersions.length > 1 ?
                        <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.versionListWrapper}>
                            <h7>Would you like to use a different version of this file?</h7>
                            <ul id='fileVersionUl'>
                                {provFileVersions}
                            </ul>
                        </div> : null}
                </Dialog>
            </span>
        );
    }

    addFileToGraph() {
        let node = this.state.addFileNode;
        let graphNodes = this.props.provNodes;
        if(this.state.addFileNode !== null) {
            let id = node.current_version ? node.current_version.id : node.id;
            if (!BaseUtils.objectPropInArray(graphNodes, 'id', id)) {
                ProjectActions.addFileToGraph(node);
                ProjectActions.closeProvEditorModal('addFile');
                this.state.addFileNode = null;
            } else {
                ProjectActions.openProvEditorModal('nodeWarning');
            }
            this.state.projectSelectValue = null;
            ProjectActions.clearSearchFilesData();
            ProjectActions.clearProvFileVersions();
        }
        this.setState({floatingErrorText:'This field is required'});
        setTimeout(()=>{
            this.setState({floatingErrorText:''});
        }, 3000);
    }

    chooseFileVersion(value) {
        let fileId = value.id;
        this.state.addFileNode = value.node;
        ProjectActions.getFileVersions(fileId, true);
    }

    handleClose(id) {
        ProjectActions.closeProvEditorModal(id);
        ProjectActions.clearProvFileVersions();
        if(id === 'addFile') this.state.projectSelectValue = null;
    }

    handleFloatingError(e) {
        if(this.state.floatingErrorText !== '' || !e.target.value) { // Avoid lagging text input due to re-renders
            this.setState({floatingErrorText: e.target.value ? '' : 'This field is required.'});
        }
    }

    handleProjectSelect(e, index, value) {
        ProjectActions.clearSearchFilesData(); //If project is changed, clear files from autocomplete list
        this.setState({
            projectSelectValue: value
        });
    }

    handleUpdateInput (text, isProject) {
        // Add 500ms lag to autocomplete so that it only makes a call after user is done typing
        if(isProject) ProjectActions.clearSearchFilesData(); //Boolean: If project is changed clear files from autocomplete list
        let id = this.state.projectSelectValue !== null ? this.state.projectSelectValue : this.props.entityObj.file ? this.props.entityObj.file.project.id : this.props.entityObj.project.id;
        let timeout = this.state.timeout;
        let textInput = document.getElementById('searchText');
        textInput.onkeyup = () => {
            clearTimeout(this.state.timeout);
            this.setState({
                timeout: setTimeout(() => {
                    if (!textInput.value.indexOf(' ') <= 0) {
                        ProjectActions.searchFiles(textInput.value, id);
                    }
                }, 500)
            })
        };
    }

    openModal(id) {
        ProjectActions.openProvEditorModal(id);
    }

    useFileVersion(name, version, node) {
        document.getElementById('searchText').value = name +'- Version: '+ version;
        this.state.addFileNode = node;
    }
}

var styles = {
    autoComplete: {
        maxWidth: 'calc(100% - 45px)'
    },
    autoCompleteProgress: {
        position: 'absolute',
        top: '28%',
        left: '45%'
    },
    btn: {
        zIndex: 9999,
        margin: '10px 0px 10px 0px',
        minWidth: 168,
        width: '100%',
        label: {
            color: '#235F9C'
        }
    },
    dialogStyles: {
        textAlign: 'center',
        fontColor: '#303F9F',
        zIndex: '5000'
    },
    projectSelect: {
        maxWidth: 'calc(100% - 45px)',
        textAlign: 'left'
    },
    versionListWrapper: {
        textAlign: 'left'
    }
};

export default ProvenanceFilePicker;