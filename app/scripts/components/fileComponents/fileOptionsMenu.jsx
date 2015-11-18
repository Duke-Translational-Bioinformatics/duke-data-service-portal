import React from 'react';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
var mui = require('material-ui'),
    TextField = mui.TextField,
    IconMenu = mui.IconMenu,
    Snackbar = mui.Snackbar,
    Dialog = mui.Dialog;

let MenuItem = require('material-ui/lib/menus/menu-item');

class FileOptionsMenu extends React.Component {

    constructor() {
        this.state = {
            floatingErrorText: 'This field is required.'
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

        return (
            <div>
                <Dialog
                    style={styles.dialogStyles}
                    title="Are you sure you want to delete this file?"
                    actions={deleteActions}
                    ref="deleteFile">
                </Dialog>
                <Dialog
                    style={styles.dialogStyles}
                    title="Update File Name"
                    actions={editActions}
                    ref="editFile">
                    <form action="#" id="editFileForm">
                        <TextField
                            style={styles.textStyles}
                            hintText="Project Name"
                            errorText={this.state.floatingErrorText}
                            floatingLabelText="File Name"
                            id="fileNameText"
                            type="text"
                            multiLine={true}
                            onChange={this.handleFloatingErrorInputChange.bind(this)}/> <br/>
                    </form>
                </Dialog>
                <IconMenu iconButtonElement={iconButtonElement} style={styles.dropDown}>
                    <MenuItem primaryText="Delete File" onTouchTap={this.handleTouchTapDelete.bind(this)}/>
                    <MenuItem primaryText="Edit File" onTouchTap={this.handleTouchTapEdit.bind(this)}/>
                </IconMenu>
            </div>
        );
    }

    handleTouchTapDelete() {
        this.refs.deleteFile.show();
    }

    handleTouchTapEdit() {
        this.refs.editFile.show();
    }

    handleDeleteButton() {
        let id = this.props.params.id;
        let parentId = ProjectStore.parentObj.id;
        let parentKind = ProjectStore.parentObj.kind;
        let urlPath = '';
        {parentKind === 'dds-project' ? urlPath = '/project/' : urlPath = '/folder/'}
        ProjectActions.deleteFile(id, parentId, parentKind, this.refs.deleteFile.dismiss(
            setTimeout(()=>this.props.appRouter.transitionTo(urlPath + parentId),500)
        ));
    }


    handleUpdateButton() {
        let id = this.props.params.id;
        let  fileName = document.getElementById("fileNameText").value;
        if (this.state.floatingErrorText != '') {
            return null
        } else {
            ProjectActions.editFile(id, fileName, this.setState({
                floatingErrorText: 'This field is required.'
            }));
            this.refs.editFile.dismiss();
        }
    };

    handleFloatingErrorInputChange(e) {
        this.setState({
            floatingErrorText: e.target.value ? '' : 'This field is required.'
        });
    }
}
var styles = {
    dropDown: {
        zIndex: '999'
    },
    deleteFile: {
        float: 'right',
        position: 'relative',
        margin: '12px 8px 0px 0px'
    },
    dialogStyles: {
        textAlign: 'center',
        fontColor: '#303F9F',
        zIndex: '999'
    },
    textStyles: {
        textAlign: 'left',
        fontColor: '#303F9F'
    }
};

export default FileOptionsMenu;

