import React, { PropTypes } from 'react';
const { object, array, string } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import { Path, Kind } from '../../util/urlEnum';
import { Color } from '../../theme/customTheme';
import MoveItemModal from '../globalComponents/moveItemModal.jsx';
import Card from 'material-ui/Card';
import DeleteForeverIcon from 'material-ui/svg-icons/action/delete-forever';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import GetAppIcon from 'material-ui/svg-icons/action/get-app';
import LowPriority from 'material-ui/svg-icons/content/low-priority';
import IconButton from 'material-ui/IconButton';
import LocalOffer from 'material-ui/svg-icons/maps/local-offer';

@observer
class BatchOps extends React.Component {

    render() {
        const { filesChecked, foldersChecked, itemsSelected, projPermissions, screenSize, toggleModal } = mainStore;
        let dialogWidth = screenSize.width < 580 ? {width: '100%'} : {};
        let dlMsg = '';
        let msg = '';
        let dltIcon = null;
        let tagIcon = null;
        let moveIcon = null;
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
        let isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1 && navigator.userAgent && !navigator.userAgent.match('CriOS');
        let downloadIcon = filesChecked.length ? <IconButton onTouchTap={() => this.openModal('dwnLoad')} style={styles.downloadBtn}><GetAppIcon color={Color.pink}/></IconButton> : null;
        let prjPrm = projPermissions && projPermissions !== null ? projPermissions : null;

        if (prjPrm !== null) {
            dltIcon = prjPrm === 'flDownload' ? null :
                <IconButton onTouchTap={() => this.openModal('dlt')} style={styles.dltBtn}>
                    <DeleteForeverIcon color={Color.pink}/>
                </IconButton>;
            moveIcon = prjPrm === 'flDownload' ? null :
                <IconButton onTouchTap={() => this.moveFile()} style={styles.moveBtn}>
                    <LowPriority color={Color.pink}/>
                </IconButton>;
            tagIcon = prjPrm === 'flDownload' || !filesChecked.length ? null :
                <IconButton onTouchTap={() => this.openTagManager()} style={styles.tagBtn}>
                    <LocalOffer color={Color.pink}/>
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
                onTouchTap={() => this.handleDelete()}/>
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

        const moveActions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={() => this.handleClose('moveItem')}/>
        ];

        return (
            <Card style={styles.card}>
                <h6 style={styles.numSelected}>{itemsSelected} selected</h6>
                <div style={styles.iconBtn} title="Tag files">
                    { tagIcon }
                </div>
                <div style={styles.iconBtn} title="Download files">
                    { downloadIcon }
                </div>
                <div style={styles.iconBtn} title="Delete selected items">
                    { dltIcon }
                </div>
                <div style={styles.iconBtn} title="Move selected items">
                    { moveIcon }
                </div>
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={dialogWidth}
                    title={msg}
                    autoDetectWindowHeight={true}
                    actions={deleteActions}
                    open={toggleModal && toggleModal.id == 'dlt' ? toggleModal.open : false}
                    onRequestClose={() => this.handleClose('dlt')}>
                    <i className="material-icons" style={styles.warning}>warning</i>
                </Dialog>
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={dialogWidth}
                    title={dlMsg}
                    autoDetectWindowHeight={true}
                    actions={downloadActions}
                    open={toggleModal && toggleModal.id == 'dwnLoad' ? toggleModal.open : false}
                    onRequestClose={() => this.handleClose('dwnLoad')}>
                    <i className="material-icons" style={styles.warning}>warning</i>
                    {isSafari ? <h4 style={{color: Color.red}}>It looks like you're using the Safari browser. If you want to download files you must enable pop ups in your browser first.</h4> : null}
                    <p style={styles.textStyles}>If you want to download the contents of a folder, please open that folder and select the files to download.</p>
                </Dialog>
                <Dialog
                    {...this.props}
                    style={styles.dialogStyles}
                    contentStyle={dialogWidth}
                    title="Select a Location to Move File"
                    autoDetectWindowHeight={true}
                    actions={moveActions}
                    open={toggleModal && toggleModal.id === 'moveBatchItem' ? toggleModal.open : false}
                    onRequestClose={() => this.handleCloseMoveModal()}>
                    <MoveItemModal {...this.props}/>
                </Dialog>
            </Card>
        );
    }

    handleDelete(){
        let parentId = this.props.params.id;
        let path = this.props.router.location.pathname.includes('project') ? Path.PROJECT : Path.FOLDER;
        mainStore.batchDeleteItems(parentId, path);
        this.handleClose('dlt');
    }

    handleCloseMoveModal() {
        mainStore.toggleModals('moveBatchItem');
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

    moveFile() {
        let requester = 'moveItemModal';
        let id = mainStore.filesChecked.length ? mainStore.filesChecked[0] : mainStore.foldersChecked[0];
        let path = mainStore.filesChecked.length ? Path.FILE : Path.FOLDER;
        mainStore.getEntity(id, path, requester);
        mainStore.toggleModals('moveBatchItem');
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

const styles = {
    card: {
        overflow: 'auto',
        margin: '8px 0px 0px 0px',
        padding: '0 auto',
        backgroundColor:'#ECEFF1',
        minHeight: 36
    },
    dialogStyles: {
        textAlign: 'center',
        fontColor: Color.dkBlue,
        zIndex: '9996'
    },
    tagBtn: {
        marginLeft: 10,
        marginRight: 7,
        padding: '5px 10px 01px 5px',
        height: 32,
        width: 32
    },
    downloadBtn: {
        margin: '0px 2px 0px 3px',
        padding: '6px 10px 0px 5px',
        height: 32,
        width: 32
    },
    iconBtn: {
        float: 'right'
    },
    moveBtn: {
        margin: '0px 2px 0px 10px',
        padding: '5px 10px 01px 5px',
        height: 32,
        width: 32
    },
    numSelected: {
        float: 'left',
        margin: '7px 0px 0px 10px',
        fontWeight: '400'
    },
    dltBtn: {
        marginLeft: 10,
        marginRight: 5,
        padding: '5px 10px 01px 5px',
        height: 32,
        width: 32
    },
    textStyles: {
        textAlign: 'left',
        fontColor: Color.dkBlue
    },
    warning: {
        fontSize: 48,
        textAlign: 'center',
        color: Color.red
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