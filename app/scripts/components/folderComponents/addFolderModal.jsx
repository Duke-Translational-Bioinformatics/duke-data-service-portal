import React from 'react';
import { Link } from 'react-router';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';

let mui = require('material-ui'),
    RaisedButton = mui.RaisedButton,
    TextField = mui.TextField,
    Dialog = mui.Dialog,
    Snackbar = mui.Snackbar;

class AddFolderModal extends React.Component {

    constructor() {
        this.state = {
            floatingErrorText: 'This field is required.',
            parentObj: ProjectStore.parentObj
        }
    }

    render() {
        let standardActions = [
            {text: 'Submit', onTouchTap: this.handleFolderButton.bind(this)},
            {text: 'Cancel'}
        ];

        return (
            <div style={styles.addFolder}>

                <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--colored"
                        style={styles.addFolder}
                        onTouchTap={this.handleTouchTap.bind(this)}>
                    ADD FOLDER
                </button>
                <Dialog
                    style={styles.dialogStyles}
                    title="Add New Folder"
                    actions={standardActions}
                    ref="addFolder">
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
            </div>
        );
    }

    handleTouchTap() {
        this.refs.addFolder.show();
    }

    handleFolderButton() {
        let kindString = this.props.appRouter.getCurrentPathname();
        let start_pos = kindString.indexOf('/') + 1;
        let end_pos = kindString.indexOf('/',start_pos);
        let kind = kindString.substring(start_pos,end_pos);
        let name = document.getElementById('folderNameText').value;

        if (this.state.floatingErrorText) {
            return null
        } else {
            if(kind === 'folder'){
                let id = this.props.params.id;
                let parentKind = 'dds-folder';
                ProjectActions.addFolder(id, parentKind, name, this.setState({
                    floatingErrorText: 'This field is required.'
                }));
            } else {
                let id = this.props.params.id;
                let parentKind = 'dds-project';
                ProjectActions.addFolder(id, parentKind, name, this.setState({
                    floatingErrorText: 'This field is required.'
                }));
            }
            this.refs.addFolder.dismiss();
        }
    }

    handleFloatingErrorInputChange(e) {
        this.setState({
            floatingErrorText: e.target.value ? '' : 'This field is required.'
        });
    }
}

let styles = {
    addFolder: {
        float: 'right',
        zIndex: '9995',
        position: 'relative',
        margin: '10px 16px 0px 0px'
    },
    dialogStyles: {
        textAlign: 'center',
        fontColor: '#303F9F',
        zIndex: '9996'
    },
    textStyles: {
        textAlign: 'left',
        fontColor: '#303F9F'
    }
};

AddFolderModal.contextTypes = {
    muiTheme: React.PropTypes.object
};

AddFolderModal.propTypes = {
    addFolderLoading: React.PropTypes.bool,
};

export default AddFolderModal;

