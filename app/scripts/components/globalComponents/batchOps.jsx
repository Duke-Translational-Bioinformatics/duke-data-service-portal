import React from 'react';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import Badge from 'material-ui/lib/badge';
import Card from 'material-ui/lib/card/card';
import DeleteIcon from 'material-ui/lib/svg-icons/action/delete';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import GetAppIcon from 'material-ui/lib/svg-icons/action/get-app';
import IconButton from 'material-ui/lib/icon-button';
import Info from 'material-ui/lib/svg-icons/action/info';
import RaisedButton from 'material-ui/lib/raised-button';

class BatchOps extends React.Component {

    constructor() {
        this.state = {
            deleteOpen: false,
            downloadOpen: false
        }
    }

    render() {
        let dlMsg = '';
        let msg = '';
        if(this.props.filesChecked.length > 1 || this.props.foldersChecked.length > 1 || this.props.foldersChecked.length + this.props.filesChecked.length > 1){
            msg = "Are you sure you want to delete these items?";
        } else {
            msg= "Are you sure you want to delete this item?";
        }
        if(!this.props.filesChecked.length){
            dlMsg = "If you want to download the contents of a folder, please open that folder and select the files to download"
        }
        else if(this.props.filesChecked.length > 1){
            dlMsg = "Are you sure you want to download "+this.props.filesChecked.length+" files?";
        }else{
            dlMsg = "Are you sure you want to download "+this.props.filesChecked.length+" file?"
        }
        let dltIcon = null;
        let prjPrm = this.props.projPermissions && this.props.projPermissions !== undefined ? this.props.projPermissions : null;
        if (prjPrm !== null) {
            dltIcon = prjPrm === 'flDownload' ? null :
                <IconButton onTouchTap={this.openDeleteModal.bind(this)} style={styles.deleteBtn}>
                    <DeleteIcon color={'#EC407A'}/>
                </IconButton>;
        }

        const deleteActions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={this.handleClose.bind(this)}/>,
            <FlatButton
                label="Delete"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={this.handleDelete.bind(this)}/>
        ];
        let downloadActions = [];
        if(!this.props.filesChecked.length){
            downloadActions = [
                <FlatButton
                    label="Cancel"
                    secondary={true}
                    onTouchTap={this.handleClose.bind(this)}/>
            ]
        } else {
            downloadActions = [
                <FlatButton
                    label="Cancel"
                    secondary={true}
                    onTouchTap={this.handleClose.bind(this)}/>,
                <FlatButton
                    label="Download"
                    secondary={true}
                    keyboardFocused={true}
                    onTouchTap={this.handleDownload.bind(this)}/>
            ];
        }

        return (
            <Card style={styles.card}>
                <h6 style={styles.numSelected}>{this.props.itemsSelected}  selected</h6>
                <div style={styles.iconBtn} title="Delete selected items">
                    { dltIcon }
                </div>
                <div style={styles.iconBtn} title="Download files">
                    <IconButton onTouchTap={this.openDownloadModal.bind(this)} style={styles.downloadBtn}>
                        <GetAppIcon color={'#EC407A'}/>
                    </IconButton>
                </div>
                <Dialog
                    style={styles.dialogStyles}
                    title={msg}
                    autoDetectWindowHeight={true}
                    autoScrollBodyContent={true}
                    actions={deleteActions}
                    open={this.state.deleteOpen}
                    onRequestClose={this.handleClose.bind(this)}>
                    <i className="material-icons" style={styles.warning}>warning</i>
                </Dialog>
                <Dialog
                    style={styles.dialogStyles}
                    title={dlMsg}
                    autoDetectWindowHeight={true}
                    autoScrollBodyContent={true}
                    actions={downloadActions}
                    open={this.state.downloadOpen}
                    onRequestClose={this.handleClose.bind(this)}>
                    <i className="material-icons" style={styles.warning}>warning</i>
                    <p style={styles.textStyles}>If you want to download the contents of a folder, please open that folder and select the files to download.</p>
                </Dialog>
            </Card>
        );
    }

    handleDelete(){
        let files = this.props.filesChecked ? this.props.filesChecked : null;
        let folders = this.props.foldersChecked ? this.props.foldersChecked : null;
        let parentId = this.props.entityObj && this.props.entityObj.id ? this.props.entityObj.id : this.props.project.id;
        let parentKind = this.props.entityObj && this.props.entityObj.kind === 'dds-folder' ? this.props.entityObj.kind : 'dds-project';
        for (let i = 0; i < files.length; i++) {
            ProjectActions.deleteFile(files[i], parentId, parentKind);
        }
        for (let i = 0; i < folders.length; i++) {
            ProjectActions.deleteFolder(folders[i], parentId, parentKind);
        }
        this.setState({deleteOpen: false});
    }

    handleDownload() {
        let kind = 'files/';
        let files = this.props.filesChecked ? this.props.filesChecked : null;
        let folders = this.props.foldersChecked ? this.props.foldersChecked : null;
        for (let i = 0; i < files.length; i++) {
            ProjectActions.getDownloadUrl(files[i], kind);
            document.getElementById(files[i]).checked = false;
        }
        this.setState({downloadOpen: false});
    }

    openDeleteModal() {
        this.setState({deleteOpen: true});
    };

    openDownloadModal() {
        let folders = this.props.foldersChecked ? this.props.foldersChecked : null;
        for (let i = 0; i < folders.length; i++) {
            document.getElementById(folders[i]).checked = false;
        }
        this.setState({downloadOpen: true});
    };

    handleClose() {
        let checked = null;
        // See if checkboxes are selected
        let checkedBoxes = document.querySelectorAll('input[name=chkboxName]:checked');
        let filesChecked = [];
        let foldersChecked = [];
        // Create arrays of checked boxes
        let fileInput = document.getElementsByClassName('fileChkBoxes');
        let folderInput = document.getElementsByClassName('folderChkBoxes');
        for (let i = 0; fileInput[i]; ++i) {
            if (fileInput[i].checked) {
                filesChecked.push(fileInput[i].value);
            }
        }
        for (let i = 0; folderInput[i]; ++i) {
            if (folderInput[i].checked) {
                foldersChecked.push(folderInput[i].value);
            }
        }
        // Process files/folders
        ProjectActions.handleBatch(filesChecked, foldersChecked);
        // If nothing is selected, change state and hide options
        if (!checkedBoxes.length) ProjectActions.showBatchOptions();
        this.setState({
            deleteOpen: false,
            downloadOpen: false
        });
    };
}

let styles = {
    card: {
        overflow: 'auto',
        marginLeft: 9,
        marginBottom: 0,
        marginTop: 28,
        padding: '0 auto',
        backgroundColor:'#ECEFF1',
        minHeight: 36,
        maxWidth: '98.5%'
    },
    dialogStyles: {
        textAlign: 'center',
        fontColor: '#303F9F',
        zIndex: '9996'
    },
    deleteBtn: {
        marginLeft: 10,
        marginRight: 5,
        padding: '5px 10px 01px 5px',
        height: 32,
        width: 32
    },
    downloadBtn: {
        marginRight: 5,
        padding: '6px 10px 0px 5px',
        height: 32,
        width: 32
    },
    iconBtn: {
        float: 'right'
    },
    numSelected: {
        float: 'left',
        margin: '7px 0px 0px 10px',
        fontWeight: '400'
    },
    textStyles: {
        textAlign: 'left',
        fontColor: '#303F9F'
    },
    warning: {
        fontSize: 48,
        textAlign: 'center',
        color: '#F44336'
    }
};

BatchOps.contextTypes = {
    muiTheme: React.PropTypes.object
};

export default BatchOps;