import React from 'react';
import ProjectListActions from '../../actions/projectListActions';
import ProjectStore from '../../stores/projectStore';
var mui = require('material-ui'),
    TextField = mui.TextField,
    IconMenu = mui.IconMenu,
    Snackbar = mui.Snackbar,
    Dialog = mui.Dialog;

let MenuItem = require('material-ui/lib/menus/menu-item');

class ProjectOptionsMenu extends React.Component {

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
        let iconButtonElement = <a className="external"><i className="material-icons">settings</i></a>;

        return (
            <div>
                <Dialog
                    style={styles.dialogStyles}
                    title="Are you sure you want to delete this project?"
                    actions={deleteActions}
                    ref="deleteProject">
                </Dialog>
                <Dialog
                    style={styles.dialogStyles}
                    title="Update Project"
                    actions={editActions}
                    ref="editProject">
                    <form action="#" id="newProjectForm">
                        <TextField
                            style={styles.textStyles}
                            hintText="Project Name"
                            errorText={this.state.floatingErrorText}
                            floatingLabelText="Project Name"
                            id="projectNameText"
                            type="text"
                            multiLine={true}
                            onChange={this.handleFloatingErrorInputChange.bind(this)}/> <br/>
                        <TextField
                            style={styles.textStyles}
                            hintText="Project Description"
                            errorText={this.state.floatingErrorText2}
                            floatingLabelText="Project Description"
                            id="projectDescriptionText"
                            type="text"
                            multiLine={true}
                            onChange={this.handleFloatingErrorInputChange2.bind(this)}
                            />
                    </form>
                </Dialog>
                <Snackbar
                    ref="snackbarUpdate"
                    message="Project Updated!"
                    autoHideDuration={1800}/>
                <IconMenu iconButtonElement={iconButtonElement}>
                    <MenuItem primaryText="Delete Project" onTouchTap={this.handleTouchTapDelete.bind(this)}/>
                    <MenuItem primaryText="Edit Project" onTouchTap={this.handleTouchTapEdit.bind(this)}/>
                </IconMenu>
            </div>
        );
    }

    handleTouchTapDelete() {
        this.refs.deleteProject.show();
    }

    handleTouchTapEdit() {
        this.refs.editProject.show();
    }

    handleDeleteButton() {
        let currentPath = this.props.params.id;
        let ref = 'snackbarDelete';
        ProjectListActions.deleteProject(currentPath, ref, this.refs.deleteProject.dismiss(
            setTimeout(()=>this.props.appRouter.transitionTo('/home'),500)
        ));
    }


    handleUpdateButton() {
        let currentPath = this.props.params.id;
        if (this.state.floatingErrorText || this.state.floatingErrorText2 != '') {
            return null
        } else {
            this.refs.snackbarUpdate.show();
            ProjectListActions.editProject(currentPath, this.setState({
                floatingErrorText: 'This field is required.',
                floatingErrorText2: 'This field is required'
            }));
            this.refs.editProject.dismiss();
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

export default ProjectOptionsMenu;

