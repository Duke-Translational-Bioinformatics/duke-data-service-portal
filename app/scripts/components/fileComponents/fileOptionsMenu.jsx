import React from 'react';
import ReactDOM from 'react-dom';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import MoveItemModal from '../globalComponents/moveItemModal.jsx';
import TextField from 'material-ui/lib/text-field';
import CircularProgress from 'material-ui/lib/circular-progress';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import IconButton from 'material-ui/lib/icon-button';

import Divider from 'material-ui/lib/divider';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import Slider from 'material-ui/lib/slider';
import SelectField from 'material-ui/lib/select-field';

import NavigationClose from 'material-ui/lib/svg-icons/navigation/close';
import LeftNav from 'material-ui/lib/left-nav';

class FileOptionsMenu extends React.Component {

    constructor() {
        this.state = {
            deleteOpen: false,
            editOpen: false,
            floatingErrorText: 'This field is required.'
        }
    }

    render() {
        let prjPrm = this.props.projPermissions && this.props.projPermissions !== undefined ? this.props.projPermissions : null;
        let menu = null;
        if (prjPrm !== null) {
            if(prjPrm === 'flUpload'){
                menu = <MenuItem primaryText="Upload New Version" leftIcon={<i className="material-icons">file_upload</i>}
                                 onTouchTap={() => this.openVersionModal()}/>;
            }
            if(prjPrm === 'prjCrud' || prjPrm === 'flCrud'){
                menu = <span>
                        <MenuItem primaryText="Delete File" leftIcon={<i className="material-icons">delete</i>}
                                  onTouchTap={() => this.handleTouchTapDelete()}/>
                        <MenuItem primaryText="Edit File Name" leftIcon={<i className="material-icons">mode_edit</i>}
                                  onTouchTap={() => this.handleTouchTapEdit()}/>
                        <MenuItem primaryText="Move File" leftIcon={<i className="material-icons">low_priority</i>}
                                  onTouchTap={() => this.handleTouchTapMove()}/>
                        <MenuItem primaryText="Upload New Version" leftIcon={<i className="material-icons">file_upload</i>}
                                  onTouchTap={() => this.openVersionModal()}/>
                        <MenuItem primaryText="Provenance" leftIcon={<i className="material-icons">device_hub</i>}
                                  onTouchTap={() => this.openProv()}/>
                </span>
            }
        }
        const deleteActions = [
            <FlatButton
                label="CANCEL"
                secondary={true}
                onTouchTap={() => this.handleClose()}/>,
            <FlatButton
                label="DELETE"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.handleDeleteButton()}/>
        ];
        const editActions = [
            <FlatButton
                label="CANCEL"
                secondary={true}
                onTouchTap={() => this.handleClose()}/>,
            <FlatButton
                label="UPDATE"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.handleUpdateButton()}/>
        ];
        const moveActions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={() => this.handleCloseMoveModal()}/>
        ];
        const moveWarnActions = [
            <FlatButton
                label="Okay"
                secondary={true}
                onTouchTap={() => this.handleCloseMoveWarning()}/>
        ];
        let fileName = this.props.entityObj ? this.props.entityObj.name : null;

        return (
            <div>
                <Dialog
                    style={styles.dialogStyles}
                    title="Are you sure you want to delete this file?"
                    autoDetectWindowHeight={true}
                    autoScrollBodyContent={true}
                    actions={deleteActions}
                    onRequestClose={() => this.handleClose()}
                    open={this.state.deleteOpen}>
                    <i className="material-icons" style={styles.warning}>warning</i>
                    <p style={{textAlign: 'left'}}>You will lose access to any versions associated with this file. If you want to delete just one version of this file,
                        please navigate to the version you want to delete by clicking on the file versions button.</p>
                </Dialog>
                <Dialog
                    style={styles.dialogStyles}
                    title="Edit File Name"
                    autoDetectWindowHeight={true}
                    autoScrollBodyContent={true}
                    actions={editActions}
                    onRequestClose={() => this.handleClose()}
                    open={this.state.editOpen}>
                    <form action="#" id="editFileForm">
                        <TextField
                            style={styles.textStyles}
                            autoFocus={true}
                            onFocus={this.handleFloatingError.bind(this)}
                            hintText="File Name"
                            defaultValue={fileName}
                            errorText={this.state.floatingErrorText}
                            floatingLabelText="File Name"
                            id="fileNameText"
                            type="text"
                            multiLine={true}
                            onChange={this.handleFloatingError.bind(this)}/> <br/>
                    </form>
                </Dialog>
                <Dialog
                    {...this.props}
                    style={styles.dialogStyles}
                    title="Select Destination"
                    autoDetectWindowHeight={true}
                    autoScrollBodyContent={true}
                    actions={moveActions}
                    open={this.props.moveModal}
                    onRequestClose={() => this.handleCloseMoveModal()}>
                    <MoveItemModal {...this.props}/>
                </Dialog>
                <Dialog
                    style={styles.dialogStyles}
                    title="Cannot Complete Action"
                    autoDetectWindowHeight={true}
                    autoScrollBodyContent={true}
                    actions={moveWarnActions}
                    open={this.props.moveErrorModal}
                    onRequestClose={() => this.handleCloseMoveWarning()}>
                    <i className="material-icons" style={styles.warning}>warning</i>
                    <p style={styles.msg}>The file you're trying to move is already located here. Please pick another
                        location to move to.</p>
                </Dialog>
                <IconMenu
                    iconButtonElement={<IconButton iconClassName="material-icons" onTouchTap={() => this.getEntity()}>more_vert</IconButton>}
                    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                    targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                    { menu }
                </IconMenu>
            </div>
        );
    };

    handleTouchTapMove() {
        ProjectActions.openMoveModal(true);
    }

    handleTouchTapDelete() {
        this.setState({deleteOpen: true})
    }

    handleTouchTapEdit() {
        this.setState({editOpen: true})
    }

    openVersionModal() {
        ProjectActions.openVersionModal();
    }

    getEntity() {// Get current file object to access ancestors. Set parent in store. Keeps background from re-rendering
        let id = this.props.params.id;
        let kind = 'files';
        let requester = 'optionsMenu';// Using this to make sure parent is only set once in store and where it was set.
        ProjectActions.getEntity(id, kind, requester);
    }

    handleDeleteButton() {
        let id = this.props.params.id;
        let parentId = this.props.entityObj ? this.props.entityObj.parent.id : null;
        let parentKind = this.props.entityObj ? this.props.entityObj.parent.kind : null;
        let urlPath = '';
        parentKind === 'dds-project' ? urlPath = '/project/' : urlPath = '/folder/';
        ProjectActions.deleteFile(id, parentId, parentKind);
        this.setState({deleteOpen: false});
        setTimeout(()=>this.props.appRouter.transitionTo(urlPath + parentId), 500)
    }


    handleUpdateButton() {
        let id = this.props.params.id;
        let fileName = document.getElementById("fileNameText").value;
        if (this.state.floatingErrorText != '') {
            return null
        } else {
            ProjectActions.editFile(id, fileName);
            this.setState({
                editOpen: false,
                floatingErrorText: 'This field is required.'
            });
        }
    }

    handleFloatingError(e) {
        this.setState({
            floatingErrorText: e.target.value ? '' : 'This field is required.'
        });
    }

    handleCloseMoveModal() {
        let id = this.props.params.id;
        let kind = 'files';
        ProjectActions.getEntity(id, kind);
        ProjectActions.openMoveModal(false);
    }

    handleCloseMoveWarning() {
        ProjectActions.moveItemWarning(false);
    }

    handleClose() {
        this.setState({
            deleteOpen: false,
            editOpen: false,
            moveOpen: false,
            floatingErrorText: 'This field is required.'
        });
    }

    openProv() {
        ProjectActions.toggleProvView();
    }
}
var styles = {
    deleteFile: {
        float: 'right',
        position: 'relative',
        margin: '12px 8px 0px 0px'
    },
    dialogStyles: {
        textAlign: 'center',
        fontColor: '#303F9F',
        zIndex: '9999'
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

export default FileOptionsMenu;