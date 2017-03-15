import React, { PropTypes } from 'react';
const { object, bool, array, string } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import {Kind, Path} from '../../../util/urlEnum';
import Card from 'material-ui/Card';
import DeleteForeverIcon from 'material-ui/svg-icons/action/delete-forever';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import GetAppIcon from 'material-ui/svg-icons/action/get-app';
import IconButton from 'material-ui/IconButton';
import LocalOffer from 'material-ui/svg-icons/maps/local-offer';

@observer
class BatchOps extends React.Component {

    render() {
        const { entityObj, filesChecked, foldersChecked, itemsSelected, project, projPermissions, toggleModal } = mainStore;
        let dlMsg = '';
        let msg = '';
        let dltIcon = null;
        let tagIcon = null;
        if(filesChecked.length > 1 || foldersChecked.length > 1 || foldersChecked.length + filesChecked.length > 1){
            msg = "Are you sure you want to delete these items?";
        }else{
            msg= "Are you sure you want to delete this item?";
        }
        if(!filesChecked.length){
            dlMsg = "If you want to download the contents of a folder, please open that folder and select the files to download"
        }else{
            let f = filesChecked.length > 1  ? " files?" : " file?";
            dlMsg = "Are you sure you want to download "+filesChecked.length+f;
        }
        let parentId = entityObj && entityObj.id ? entityObj.id : project.id;
        let parentKind = entityObj && entityObj.kind === Kind.DDS_FOLDER ? entityObj.kind : Kind.DDS_PROJECT;
        let downloadIcon = filesChecked.length ? <IconButton onTouchTap={() => this.openModal('dwnLoad')} style={styles.downloadBtn}><GetAppIcon color={'#EC407A'}/></IconButton> : null;
        let prjPrm = projPermissions && projPermissions !== null ? projPermissions : null;
        if (prjPrm !== null) {
            dltIcon = prjPrm === 'flDownload' ? null :
                <IconButton onTouchTap={() => this.openModal('dlt')} style={styles.deleteBtn}>
                    <DeleteForeverIcon color={'#EC407A'}/>
                </IconButton>;
        }
        if (prjPrm !== null) {
            tagIcon = prjPrm === 'flDownload' || !filesChecked.length ? null :
                <IconButton onTouchTap={() => this.openTagManager()} style={styles.tagBtn}>
                    <LocalOffer color={'#EC407A'}/>
                </IconButton>;
        }
        const deleteActions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={() => this.handleClose('dlt')}/>,
            <FlatButton
                label="Delete"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.handleDelete(parentId, parentKind)}/>
        ];
        let downloadActions = [];
        if(!filesChecked.length){
            downloadActions = [
                <FlatButton
                    label="Cancel"
                    secondary={true}
                    onTouchTap={() => this.handleClose('dwnLoad')}/>
            ]
        } else {
            downloadActions = [
                <FlatButton
                    label="Cancel"
                    secondary={true}
                    onTouchTap={() => this.handleClose('dwnLoad')}/>,
                <FlatButton
                    label="Download"
                    secondary={true}
                    keyboardFocused={true}
                    onTouchTap={() => this.handleDownload()}/>
            ];
        }

        return (
            <Card style={styles.card}>
                <h6 style={styles.numSelected}>{itemsSelected}  selected</h6>
                <div style={styles.iconBtn} title="Delete selected items">
                    { dltIcon }
                </div>
                <div style={styles.iconBtn} title="Tag files">
                    { tagIcon }
                </div>
                <div style={styles.iconBtn} title="Download files">
                    { downloadIcon }
                </div>
                <Dialog
                    style={styles.dialogStyles}
                    title={msg}
                    autoDetectWindowHeight={true}
                    actions={deleteActions}
                    open={toggleModal && toggleModal.id == 'dlt' ? toggleModal.open : false}
                    onRequestClose={() => this.handleClose('dlt')}>
                    <i className="material-icons" style={styles.warning}>warning</i>
                </Dialog>
                <Dialog
                    style={styles.dialogStyles}
                    title={dlMsg}
                    autoDetectWindowHeight={true}
                    actions={downloadActions}
                    open={toggleModal && toggleModal.id == 'dwnLoad' ? toggleModal.open : false}
                    onRequestClose={() => this.handleClose('dwnLoad')}>
                    <i className="material-icons" style={styles.warning}>warning</i>
                    <p style={styles.textStyles}>If you want to download the contents of a folder, please open that folder and select the files to download.</p>
                </Dialog>
            </Card>
        );
    }

    handleDelete(parentId, parentKind){
        mainStore.batchDeleteItems(parentId, parentKind);
        this.handleClose('dlt');
    }

    handleDownload() {
        let kind = 'files/';
        let files = mainStore.filesChecked ? mainStore.filesChecked : null;
        for (let i = 0; i < files.length; i++) {
            mainStore.getDownloadUrl(files[i], kind);
        }
        mainStore.handleBatch([], []);
        this.handleClose('dwnLoad');
    }

    openModal(id) {
        mainStore.toggleModals(id);
    }

    openTagManager() {
        mainStore.toggleTagManager();
    }

    handleClose(id) {
        mainStore.toggleModals(id);
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
        marginRight: 7,
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
    tagBtn: {
        marginLeft: 10,
        marginRight: 5,
        padding: '5px 10px 01px 5px',
        height: 32,
        width: 32
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

BatchOps.propTypes = {
    entityObj: object,
    project: object,
    projPermissions: object,
    toggleModal: object,
    filesChecked: array,
    foldersChecked: array,
    itemsSelected: string
};

export default BatchOps;