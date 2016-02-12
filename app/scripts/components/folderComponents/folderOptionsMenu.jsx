import React from 'react';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import IconButton from 'material-ui/lib/icon-button';
import Popover from 'material-ui/lib/popover/popover';
import Menu from 'material-ui/lib/menus/menu';
import TextField from 'material-ui/lib/text-field';

class FolderOptionsMenu extends React.Component {

    constructor() {
        this.state = {
            deleteOpen: false,
            editOpen: false,
            value: 2,
            floatingErrorText: 'This field is required.',
            floatingErrorText2: 'This field is required'
        }
    }

    render() {
        let deleteActions = [
            <FlatButton
                label="CANCEL"
                secondary={true}
                onTouchTap={this.handleClose.bind(this)} />,
            <FlatButton
                label="DELETE"
                secondary={true}
                onTouchTap={this.handleDeleteButton.bind(this)} />
        ];
        let editActions = [
            <FlatButton
                label="CANCEL"
                secondary={true}
                onTouchTap={this.handleClose.bind(this)} />,
            <FlatButton
                label="UPDATE"
                secondary={true}
                onTouchTap={this.handleUpdateButton.bind(this)} />
        ];
        let fName = this.props.entityObj ? this.props.entityObj.name : null;
        let loading = this.props.loading ? <div className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div> : '';
        return (
            <div>
                <Dialog
                    style={styles.dialogStyles}
                    title="Are you sure you want to delete this folder?"
                    autoDetectWindowHeight={true}
                    autoScrollBodyContent={true}
                    actions={deleteActions}
                    onRequestClose={this.handleClose.bind(this)}
                    open={this.state.deleteOpen}>
                    <i className="material-icons" style={styles.warning}>warning</i>
                    <p style={styles.msg}>Deleting this folder will also delete any folders or files contained inside of this folder.</p>
                </Dialog>
                <Dialog
                    style={styles.dialogStyles}
                    title="Update Folder"
                    autoDetectWindowHeight={true}
                    autoScrollBodyContent={true}
                    actions={editActions}
                    onRequestClose={this.handleClose.bind(this)}
                    open={this.state.editOpen}>
                    <form action="#" id="newFolderForm">
                        <TextField
                            style={styles.textStyles}
                            hintText="Folder Name"
                            defaultValue={fName}
                            errorText={this.state.floatingErrorText}
                            floatingLabelText="Folder Name"
                            id="folderNameText"
                            type="text"
                            multiLine={true}
                            onChange={this.handleFloatingErrorInputChange.bind(this)}/> <br/>
                    </form>
                </Dialog>
                <IconMenu iconButtonElement={<IconButton iconClassName="material-icons">more_vert</IconButton>}
                          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                          targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                    <MenuItem primaryText="Delete Folder" leftIcon={<i className="material-icons">delete</i>} onTouchTap={this.handleTouchTapDelete.bind(this)} />
                    <MenuItem primaryText="Edit Folder" leftIcon={<i className="material-icons">mode_edit</i>} onTouchTap={this.handleTouchTapEdit.bind(this)} />
                </IconMenu>
            </div>
        );
    }

    handleTouchTapDelete() {
        this.setState({deleteOpen:true})
    }

    handleTouchTapEdit() {
        this.setState({editOpen:true})
    }

    handleDeleteButton() {
        let id = this.props.params.id;
        let parentId = this.props.entityObj ? this.props.entityObj.parent.id : null;
        let parentKind = this.props.entityObj ? this.props.entityObj.parent.kind : null;
        let urlPath = '';
        {parentKind === 'dds-project' ? urlPath = '/project/' : urlPath = '/folder/'}
        ProjectActions.deleteFolder(id, parentId, parentKind);
        this.setState(
            {deleteOpen: false}
        );
        setTimeout(()=>this.props.appRouter.transitionTo(urlPath + parentId),500)
    }

    handleUpdateButton() {
        let id = this.props.params.id;
        let parentId = this.props.entityObj ? this.props.entityObj.parent.id : null;
        let name = document.getElementById('folderNameText').value;
        if (this.state.floatingErrorText) {
            return null
        } else {
            ProjectActions.editFolder(id, name, this.setState({
                floatingErrorText: 'This field is required.'
            }));
            this.setState({editOpen: false});
        }
    };

    handleFloatingErrorInputChange(e) {
        this.setState({
            floatingErrorText: e.target.value ? '' : 'This field is required.'
        });
    }

    handleFloatingErrorInputChange2(e) {
        this.setState({
            floatingErrorText2: e.target.value ? '' : 'This field is required.'
        });
    }

    handleClose() {
        this.setState({
            deleteOpen: false,
            editOpen: false
        });
    }

}
var styles = {
    addFolder: {
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
    msg: {
        textAlign: 'left',
        marginLeft: 30
    },
    warning: {
        fontSize: 48,
        textAlign: 'center',
        color: '#F44336'
    }
};

export default FolderOptionsMenu;