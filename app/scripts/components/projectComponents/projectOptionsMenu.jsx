import React from 'react';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
const Dialog = require('material-ui/lib/dialog');
const DropDownMenu = require('material-ui/lib/drop-down-menu');
var mui = require('material-ui'),
    TextField = mui.TextField,
    IconMenu = mui.IconMenu,
    Snackbar = mui.Snackbar;
    //Dialog = mui.Dialog;

let MenuItem = require('material-ui/lib/menus/menu-item');

class ProjectOptionsMenu extends React.Component {

    constructor() {
        this.state = {
            floatingErrorText: 'This field is required',
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
            {text: 'CANCEL', onTouchTap: this.handleCancel.bind(this)}
        ];
        let memberActions = [
            {text: 'ADD', onTouchTap: this.handleMemberButton.bind(this)},
            {text: 'CANCEL', onTouchTap: this.handleCancel.bind(this)}
        ];

        let iconButtonElement = <a href="#"><i className="material-icons mdl-color-text--grey-800">more_vert</i></a>;

        return (
            <div>
                <Dialog
                    style={styles.dialogStyles}
                    title="Are you sure you want to delete this project?"
                    actions={deleteActions}
                    ref="deleteProject">
                    <i className="material-icons" style={styles.warning}>warning</i>
                    <p style={styles.msg}>Deleting this project will also delete any folders or files contained inside of the project.</p>
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
                <Dialog
                    style={styles.dialogStyles}
                    title="Add a Member"
                    actions={memberActions}
                    ref="addMembers">
                    <form action="#" id="newMemberForm">
                        <TextField
                            style={styles.textStyles}
                            hintText="First Name Starts With"
                            errorText={this.state.floatingErrorText}
                            floatingLabelText="First Name"
                            id="firstNameText"
                            type="text"
                            multiLine={true}
                            onChange={this.handleFloatingErrorInputChange.bind(this)}/><br/>
                        <TextField
                            style={styles.textStyles}
                            hintText="Last Name Starts With"
                            errorText={this.state.floatingErrorText}
                            floatingLabelText="Last Name"
                            id="lastNameText"
                            type="text"
                            multiLine={true}
                            onChange={this.handleFloatingErrorInputChange2.bind(this)}/> <br/>
                    </form>
                </Dialog>
                <IconMenu iconButtonElement={iconButtonElement} style={styles.dropDownMenu}>
                    <MenuItem primaryText="Delete Project" onTouchTap={this.handleTouchTapDelete.bind(this)}/>
                    <MenuItem primaryText="Edit Project" onTouchTap={this.handleTouchTapEdit.bind(this)}/>
                    <MenuItem primaryText="Add Project Member" onTouchTap={this.handleTouchTapMembers.bind(this)}/>
                </IconMenu>
            </div>
        );
    }

    handleCancel() {
            this.setState({
                floatingErrorText: 'This field is required.',
                floatingErrorText2: 'This field is required'
            });
            this.refs.editProject.dismiss();
            this.refs.addMembers.dismiss();
    }

    handleTouchTapDelete() {
        this.refs.deleteProject.show();
    }

    handleTouchTapEdit() {
        this.refs.editProject.show();
    }

    handleTouchTapMembers() {
        this.refs.addMembers.show();
    }

    handleDeleteButton() {
        let id = this.props.params.id;
        ProjectActions.deleteProject(id, this.refs.deleteProject.dismiss(
            setTimeout(()=>this.props.appRouter.transitionTo('/home'),500)
        ));
    }


    handleUpdateButton() {
        let id = this.props.params.id;
        let name = document.getElementById('projectNameText').value;
        let desc = document.getElementById('projectDescriptionText').value;
        if (this.state.floatingErrorText || this.state.floatingErrorText2 != '') {
            return null
        } else {
            ProjectActions.editProject(id, name, desc, this.setState({
                floatingErrorText: 'This field is required.',
                floatingErrorText2: 'This field is required'
            }));
            this.refs.editProject.dismiss();
        }
    };

    handleMemberButton() {
        let  firstName = document.getElementById("firstNameText").value;
        let  lastName = document.getElementById("lastNameText").value;
        let id = this.props.params.id;
        if (this.state.floatingErrorText || this.state.floatingErrorText2 != '') {
            return null
        } else {
            ProjectActions.getUserId(firstName, lastName, id, this.setState({
                floatingErrorText: 'This field is required.',
                floatingErrorText3: 'This field is required.'
            }));
            this.refs.addMembers.dismiss();
        }
    }

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
    dropDownMenu: {
        zIndex: '9999'
    },
    selectStyle: {
        //float: 'right'
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
        textAlign: 'center',
        marginLeft: 30
    },
    warning: {
        fontSize: 48,
        textAlign: 'center',
        color: '#F44336'
    }
};

export default ProjectOptionsMenu;