import React from 'react';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
var mui = require('material-ui'),
    TextField = mui.TextField,
    IconMenu = mui.IconMenu,
    Snackbar = mui.Snackbar,
    Dialog = mui.Dialog;

let MenuItem = require('material-ui/lib/menus/menu-item');

class FolderOptionsMenu extends React.Component {

    constructor() {
        this.state = {
            floatingErrorText: 'This field is required.',
            floatingErrorText2: 'This field is required'
        }
    }

    render() {
        let deleteActions = [
            {text: 'DELETE', onTouchTap: this.handleDeleteButton.bind(this)},
            {text: 'CANCEL'}
        ];
        let editActions = [
            {text: 'UPDATE', onTouchTap: this.handleUpdateButton.bind(this)},
            {text: 'CANCEL'}
        ];
        let iconButtonElement = <a href="#"><i className="material-icons mdl-color-text--grey-800">more_vert</i></a>;
        let loading = this.props.loading ? <div className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div> : '';
        return (
            <div>
                <Dialog
                    style={styles.dialogStyles}
                    title="Are you sure you want to delete this folder?"
                    actions={deleteActions}
                    ref="deleteFolder">
                    <i className="material-icons" style={styles.warning}>warning</i>
                    <p style={styles.msg}>Deleting this folder will also delete any folders or files contained inside of this folder.</p>
                </Dialog>
                <Dialog
                    style={styles.dialogStyles}
                    title="Update Folder"
                    actions={editActions}
                    ref="editFolder">
                    <form action="#" id="newFolderForm">
                        <TextField
                            style={styles.textStyles}
                            hintText="Folder Name"
                            errorText={this.state.floatingErrorText}
                            floatingLabelText="Folder Name"
                            id="folderNameText"
                            type="text"
                            multiLine={true}
                            onChange={this.handleFloatingErrorInputChange.bind(this)}/> <br/>
                    </form>
                </Dialog>
                <IconMenu iconButtonElement={iconButtonElement}>
                    <MenuItem primaryText="Delete Folder" onTouchTap={this.handleTouchTapDelete.bind(this)}/>
                    <MenuItem primaryText="Edit Folder" onTouchTap={this.handleTouchTapEdit.bind(this)}/>
                </IconMenu>
            </div>
        );
    }

    handleTouchTapDelete() {
        this.refs.deleteFolder.show();
    }

    handleTouchTapEdit() {
        this.refs.editFolder.show();
    }

    handleDeleteButton() {
        let id = this.props.params.id;
        let parentId = ProjectStore.parentObj.id;
        let parentKind = ProjectStore.parentObj.kind;
        let ref = 'snackbarDelete';
        if(parentKind === 'dds-project'){var urlPath = '/project/'} else {var urlPath = '/folder/'}
        ProjectActions.deleteFolder(id, parentId, parentKind, urlPath, ref, this.refs.deleteFolder.dismiss(
            setTimeout(()=>this.props.appRouter.transitionTo(urlPath + parentId),500)
        ));
    }

    handleUpdateButton() {
        let id = this.props.params.id;
        let parentId = ProjectStore.parentObj.id;
        let ref = 'snackbarUpdate';
        if (this.state.floatingErrorText) {
            return null
        } else {
            ProjectActions.editFolder(id, parentId, this.setState({
                floatingErrorText: 'This field is required.'
            }));
            this.refs.editFolder.dismiss();
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

}
var styles = {
    addFolder: {
        float: 'right',
        position: 'relative',
        margin: '12px 8px 0px 0px'
    },
    dialogStyles: {
        textAlign: 'center',
        fontColor: '#303F9F'
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

