import React from 'react';
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

class FileOptionsMenu extends React.Component {

    constructor() {
        this.state = {
            deleteOpen: false,
            editOpen: false,
            floatingErrorText: 'This field is required.'
        }
    }

    render() {
        const deleteActions = [
            <FlatButton
                label="CANCEL"
                secondary={true}
                onTouchTap={this.handleClose.bind(this)}/>,
            <FlatButton
                label="DELETE"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={this.handleDeleteButton.bind(this)}/>
        ];
        const editActions = [
            <FlatButton
                label="CANCEL"
                secondary={true}
                onTouchTap={this.handleClose.bind(this)}/>,
            <FlatButton
                label="UPDATE"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={this.handleUpdateButton.bind(this)}/>
        ];
        const moveActions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={this.handleCloseMoveModal.bind(this)}/>
        ];
        const moveWarnActions = [
            <FlatButton
                label="Okay"
                secondary={true}
                onTouchTap={this.handleCloseMoveWarning.bind(this)}/>
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
                    onRequestClose={this.handleClose.bind(this)}
                    open={this.state.deleteOpen}>
                    <i className="material-icons" style={styles.warning}>warning</i>
                </Dialog>
                <Dialog
                    style={styles.dialogStyles}
                    title="Update File Name"
                    autoDetectWindowHeight={true}
                    autoScrollBodyContent={true}
                    actions={editActions}
                    onRequestClose={this.handleClose.bind(this)}
                    open={this.state.editOpen}>
                    <form action="#" id="editFileForm">
                        <TextField
                            style={styles.textStyles}
                            hintText="Project Name"
                            defaultValue={fileName}
                            errorText={this.state.floatingErrorText}
                            floatingLabelText="File Name"
                            id="fileNameText"
                            type="text"
                            multiLine={true}
                            onChange={this.handleFloatingErrorInputChange.bind(this)}/> <br/>
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
                    onRequestClose={this.handleCloseMoveModal.bind(this)}>
                    <MoveItemModal {...this.props}/>
                </Dialog>
                <Dialog
                    style={styles.dialogStyles}
                    title="Cannot Complete Action"
                    autoDetectWindowHeight={true}
                    autoScrollBodyContent={true}
                    actions={moveWarnActions}
                    open={this.props.moveErrorModal}
                    onRequestClose={this.handleCloseMoveWarning.bind(this)}>
                    <i className="material-icons" style={styles.warning}>warning</i>

                    <p style={styles.msg}>The file you're trying to move is already located here. Please pick another
                        location to move to.</p>
                </Dialog>
                <IconMenu
                    iconButtonElement={<IconButton iconClassName="material-icons" onTouchTap={this.getEntity.bind(this)}>more_vert</IconButton>}
                    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                    targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                    <MenuItem primaryText="Delete File" leftIcon={<i className="material-icons">delete</i>}
                              onTouchTap={this.handleTouchTapDelete.bind(this)}/>
                    <MenuItem primaryText="Edit File" leftIcon={<i className="material-icons">mode_edit</i>}
                              onTouchTap={this.handleTouchTapEdit.bind(this)}/>
                    <MenuItem primaryText="Move File" leftIcon={<i className="material-icons">low_priority</i>}
                              onTouchTap={this.handleTouchTapMove.bind(this)}/>
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

    getEntity() { // Get current file object to access ancestors. Set parent in store.
        let id = this.props.params.id;
        let kind = 'files';
        let requester = 'optionsMenu';// Using this to make sure parent is only set once in store
        ProjectActions.getEntity(id, kind, requester);
    }

    handleDeleteButton() {
        let id = this.props.params.id;
        let parentId = this.props.entityObj ? this.props.entityObj.parent.id : null;
        let parentKind = this.props.entityObj ? this.props.entityObj.parent.kind : null;
        let urlPath = '';
        {
            parentKind === 'dds-project' ? urlPath = '/project/' : urlPath = '/folder/'
        }
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

    handleFloatingErrorInputChange(e) {
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