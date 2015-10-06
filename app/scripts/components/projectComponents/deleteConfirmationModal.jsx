import React from 'react';
import { Link } from 'react-router';
import ProjectListActions from '../../actions/projectListActions';

let MenuItem = require('material-ui/lib/menus/menu-item');

let mui = require('material-ui'),
    RaisedButton = mui.RaisedButton,
    TextField = mui.TextField,
    Snackbar = mui.Snackbar,
    Dialog = mui.Dialog;

class DeleteConfirmationModal extends React.Component {

    constructor() {
        this.state = {

        }
    }

    render() {
        let standardActions = [
            {text: 'DELETE', onTouchTap: this.handleDeleteButton.bind(this)},
            {text: 'CANCEL'}
        ];

        return (
            <div>
                <div style={styles.addProject}>
                    <Dialog
                        style={styles.dialogStyles}
                        title="Are you sure you want to delete this project?"
                        actions={standardActions}
                        ref="deleteProject">
                    </Dialog>
                    <Snackbar
                        ref="snackbar"
                        message= "Project Deleted!"
                        autoHideDuration={1500}/>
                </div>
            </div>
        );
    }

    handleDeleteButton() {
            this.refs.snackbar.show();
            ProjectListActions.deleteProject();
            this.refs.deleteProject.dismiss(
            );
    }
    handleTouchTapDelete() {
        this.refs.deleteProject.show();
    }
}

var styles = {
    addProject: {
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

DeleteConfirmationModal.contextTypes = {
    muiTheme: React.PropTypes.object
};

DeleteConfirmationModal.propTypes = {
    addProjectLoading: React.PropTypes.bool,
};

export default DeleteConfirmationModal;

