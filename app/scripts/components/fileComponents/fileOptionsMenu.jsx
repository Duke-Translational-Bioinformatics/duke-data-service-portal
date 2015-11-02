import React from 'react';
import FileActions from '../../actions/fileActions';
import FileStore from '../../stores/fileStore';
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
                <IconMenu iconButtonElement={iconButtonElement}>
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
        FileActions.deleteFile(id, this.refs.deleteFile.dismiss(
            setTimeout(()=>this.props.appRouter.transitionTo('/folder/' + id),500)
        ));
    }


    handleUpdateButton() {
        let id = this.props.params.id;
        if (this.state.floatingErrorText != '') {
            return null
        } else {
            FileActions.editFile(id, this.setState({
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
    deleteFile: {
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
    }
};

export default FileOptionsMenu;

