import React from 'react';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
const Dialog = require('material-ui/lib/dialog');
const DropDownMenu = require('material-ui/lib/drop-down-menu');
const MenuItem = require('material-ui/lib/menus/menu-item');
const IconMenu = require('material-ui/lib/menus/icon-menu');
const TextField = require('material-ui/lib/text-field');
const SelectField = require('material-ui/lib/select-field');


class ProjectOptionsMenu extends React.Component {

    constructor() {
        this.state = {
            floatingErrorText: 'This field is required',
            floatingErrorText2: 'This field is required',
            selectValue: 'project_admin'
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
        let roleOptions = [
            { id: 'project_admin', text: 'Project Administrator' },
            { id: 'project_viewer', text: 'Project Viewer' },
            { id: 'file_downloader', text: 'File Downloader' },
            { id: 'file_editor', text: 'File Editor' }
        ];
        let prName = this.props.project ? this.props.project.name : null;
        let desc = this.props.project ? this.props.project.description : null;
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
                            defaultValue={prName}
                            errorText={this.state.floatingErrorText}
                            floatingLabelText="Project Name"
                            id="projectNameText"
                            type="text"
                            multiLine={true}
                            onChange={this.handleFloatingErrorInputChange.bind(this)}/> <br/>
                        <TextField
                            style={styles.textStyles}
                            hintText="Project Description"
                            defaultValue={desc}
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
                            hintText="First Name Starts With (3 letters)"
                            errorText={this.state.floatingErrorText}
                            floatingLabelText="First Name"
                            id="firstNameText"
                            type="text"
                            multiLine={true}
                            onChange={this.handleFloatingErrorInputChange.bind(this)}/><br/>
                        <TextField
                            style={styles.textStyles}
                            hintText="Last Name Starts With (3 letters)"
                            errorText={this.state.floatingErrorText2}
                            floatingLabelText="Last Name"
                            id="lastNameText"
                            type="text"
                            multiLine={true}
                            onChange={this.handleFloatingErrorInputChange2.bind(this)}/> <br/>
                        <div style={{height: '150px'}}>
                            <SelectField
                                style={styles.selectStyle}
                                id="roleSelect"
                                floatingLabelText="Project Role"
                                value={this.state.selectValue}
                                valueMember="id"
                                onChange={this.handleSelectValueChange.bind(this, 'selectValue')}
                                menuItems={roleOptions} /><br/>
                        </div>
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
    handleClose() {
        this.setState({
            floatingErrorText: 'This field is required.',
            floatingErrorText2: 'This field is required'
        });
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

    handleSelectValueChange(name, e) {
        let change = {};
        change[name] = e.target.value;
        this.setState(change);
    }

    handleMemberButton() {
        let  firstName = document.getElementById("firstNameText").value;
        let  lastName = document.getElementById("lastNameText").value;
        let role = this.state.selectValue;
        let id = this.props.params.id;
        if (this.state.floatingErrorText || this.state.floatingErrorText2 != '') {
            return null
        } else {
            ProjectActions.getUserId(firstName, lastName, id, role, this.setState({
                floatingErrorText: 'This field is required.',
                floatingErrorText2: 'This field is required.',
                selectValue: 'project_admin'
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
        textAlign: 'left'
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