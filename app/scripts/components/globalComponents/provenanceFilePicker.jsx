import React from 'react';
import PropTypes from 'prop-types';
const { object, bool, array } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import provenanceStore from '../../stores/provenanceStore';
import { Color } from '../../theme/customTheme';
import BaseUtils from '../../util/baseUtils.js';
import AutoComplete from 'material-ui/AutoComplete';
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';

@observer
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
        const { autoCompleteLoading, entityObj, projects, screenSize, searchFilesList } = mainStore;
        const { provEditorModal, provFileVersions } = provenanceStore;
        let addFile = provEditorModal.id !== null && provEditorModal.id === 'addFile' ? provEditorModal.open : false;
        let autoCompleteData = searchFilesList.map((file)=>{
            if(file.kind === 'dds-file'){
                return {text: file.name, value: file.name, id: file.id, node: file}
            }
        });
        let dialogWidth = screenSize.width < 680 ? {width: '100%'} : {};
        let fileName = entityObj && entityObj.name ? entityObj.name : null;
        if(fileName === null) fileName = entityObj ? entityObj.file.name : null;
        let fileVersion = entityObj && entityObj.current_version ? entityObj.current_version.version : null;
        if(fileVersion === null) fileVersion = entityObj ? entityObj.version : null;
        let project = entityObj && entityObj.ancestors ? entityObj.ancestors[0].id : null;
        let projectList = projects && projects.length ? projects.map((project)=>{
            if(!project.is_deleted) {
                return <MenuItem key={project.id}
                                 value={project.id}
                                 primaryText={project.name} />
            }
        }) : null;
        let provFileVersionsList = provFileVersions !== null && provFileVersions.length > 1 ? provFileVersions.map((node) => {
            if(!node.is_deleted) {
                return <li key={node.id} id={node.id} onTouchTap={() => this.useFileVersion(node.file.name, node.version, node)}>
                    Version: {node.version}
                </li>;
            }
        }) : null;
        const addFileNodeActions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={() => this.handleClose('addFile')}/>,
            <FlatButton
                label="Submit"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.addFileToGraph()}/>
        ];

        return (
            <span>
                <RaisedButton
                    label="Add File"
                    primary={true}
                    labelStyle={styles.btn.label}
                    style={styles.btn}
                    onTouchTap={() => this.openModal('addFile')}/>
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={dialogWidth}
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
                                 floatingLabelStyle={{color: Color.grey}}
                                 style={styles.projectSelect}>
                        {projectList}
                    </SelectField>
                    <AutoComplete
                        id="searchText"
                        ref={(input) => this.searchText = input}
                        fullWidth={true}
                        style={styles.autoComplete}
                        menuStyle={{maxHeight: 200}}
                        errorText={this.state.floatingErrorText}
                        floatingLabelText="Type a File Name"
                        dataSource={autoCompleteData}
                        filter={AutoComplete.caseInsensitiveFilter}
                        openOnFocus={true}
                        onNewRequest={(value, e) => this.chooseFileVersion(value, e)}
                        onUpdateInput={this.handleUpdateInput.bind(this)}/>
                    {autoCompleteLoading ? <CircularProgress size={60} thickness={5} style={styles.autoCompleteProgress}/> : null}
                    {provFileVersionsList !== null ?
                        <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.versionListWrapper}>
                            <h7>Would you like to use a different version of this file?</h7>
                            <ul id='fileVersionUl'>
                                {provFileVersionsList}
                            </ul>
                        </div> : null}
                </Dialog>
            </span>
        );
    }

    addFileToGraph() {
        let node = this.state.addFileNode;
        if(this.state.addFileNode !== null) {
            let id = node.current_version ? node.current_version.id : node.id;
            if (!BaseUtils.objectPropInArray(provenanceStore.provNodes.slice(), 'id', id)) {
                provenanceStore.saveGraphZoomState(provenanceStore.network.getScale(), provenanceStore.network.getViewPosition());
                provenanceStore.addFileToGraph(node);
                provenanceStore.closeProvEditorModal('addFile');
                this.setState({addFileNode: null});
            } else {
                provenanceStore.openProvEditorModal('nodeWarning');
            }
            this.state.projectSelectValue = null;
            mainStore.clearSearchFilesData();
            provenanceStore.clearProvFileVersions();
        }
        this.setState({floatingErrorText:'This field is required'});
        setTimeout(()=>{ this.setState({floatingErrorText:''}) }, 3000);
    }

    chooseFileVersion(value, e) {
        if(e === -1) return false;
        let fileId = value.id;
        this.setState({addFileNode: value.node});
        provenanceStore.getProvFileVersions(fileId);
    }

    handleClose(id) {
        provenanceStore.closeProvEditorModal(id);
        provenanceStore.clearProvFileVersions();
        if(id === 'addFile') this.state.projectSelectValue = null;
    }

    handleProjectSelect(e, index, value) {
        mainStore.clearSearchFilesData(); //If project is changed, clear files from autocomplete list
        mainStore.searchFiles('', value);
        this.setState({ projectSelectValue: value });
        setTimeout(() => this.searchText.focus(), 600);
    }

    handleUpdateInput (text, isProject) {
        if(isProject) mainStore.clearSearchFilesData(); //Boolean: If project is changed clear files from autocomplete list
        let id = this.state.projectSelectValue !== null ? this.state.projectSelectValue : mainStore.entityObj.file ? mainStore.entityObj.file.project.id : mainStore.entityObj.project.id;
        clearTimeout(this.state.timeout);
        this.setState({
            timeout: setTimeout(() => {
                if (!text.indexOf(' ') <= 0) {
                    mainStore.searchFiles(text, id);
                }
            }, 500)
        })
    }

    openModal(id) {
        provenanceStore.openProvEditorModal(id);
        setTimeout(() => this.searchText.focus(), 300);
    }

    useFileVersion(name, version, node) {
        document.getElementById('searchText').value = name +' - Version: '+ version;
        this.setState({addFileNode: node});
    }
}

const styles = {
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
            fontWeight: 200
        }
    },
    dialogStyles: {
        textAlign: 'center',
        fontColor: Color.dkBlue,
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

ProvenanceFilePicker.propTypes = {
    entityObj: object,
    onClickProvNode: object,
    provEditorModal: object,
    screenSize: object,
    autoCompleteLoading: bool,
    projects: array,
    searchFilesList: array,
    provFileVersions: array
};

export default ProvenanceFilePicker;