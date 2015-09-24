import React from 'react';
import { Link } from 'react-router';
import FolderActions from '../actions/folderActions';

let mui = require('material-ui'),
    RaisedButton = mui.RaisedButton,
    TextField = mui.TextField,
    Dialog = mui.Dialog,
    Snackbar = mui.Snackbar;

class AddFolderModal extends React.Component {

    constructor() {
        this.state = {
            floatingErrorText: 'This field is required.',
            //floatingErrorText2: 'This field is required'
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
                <Snackbar
                    ref="snackbar"
                    message="Folder Added"
                    autoHideDuration={1500}/>
            </div>
        );
    }

    handleTouchTap() {
        this.refs.addFolder.show();
    }

    handleFolderButton() {
        let parent = window.location.hash.split('/').slice(2, 3).toString();
        if (this.state.floatingErrorText) {
            return null
        } else {
            this.refs.snackbar.show();
            FolderActions.addFolder(parent);
            this.refs.addFolder.dismiss(
                this.setState({
                    floatingErrorText: 'This field is required.'
                })
            );
        }
    }

    handleFloatingErrorInputChange(e) {
        this.setState({
            floatingErrorText: e.target.value ? '' : 'This field is required.'
        });
    }

    //handleFloatingErrorInputChange2(e) {
    //    this.setState({
    //        floatingErrorText2: e.target.value ? '' : 'This field is required.'
    //    });
    //}
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
    floatingButton: {
        position: 'absolute',
        top: -48,
        right: '2%',
        zIndex: '2',
        color: '#ffffff'
    }
};

AddFolderModal.contextTypes = {
    muiTheme: React.PropTypes.object
};

AddFolderModal.propTypes = {
    addFolderLoading: React.PropTypes.bool,
};

export default AddFolderModal;

