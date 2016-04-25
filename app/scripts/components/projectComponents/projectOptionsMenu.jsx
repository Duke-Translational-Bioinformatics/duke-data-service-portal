import React from 'react';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import AutoComplete from 'material-ui/lib/auto-complete';
import TextField from 'material-ui/lib/text-field';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import IconButton from 'material-ui/lib/icon-button';
import SelectField from 'material-ui/lib/select-field';

class ProjectOptionsMenu extends React.Component {

    constructor() {
        this.state = {
            deleteOpen: false,
            editOpen: false,
            errorText: null,
            floatingErrorText: 'This field is required',
            floatingErrorText2: 'This field is required',
            floatingErrorText3: 'Enter the project name exactly to delete',
            memberOpen: false,
            users: ProjectStore.users,
            value: null
        }
    }

    render() {
        let currentUser = this.props.currentUser ? this.props.currentUser.full_name : null;
        let names = this.props.users && this.props.users.length ? this.props.users : [];
        let prName = this.props.project ? this.props.project.name : null;
        let desc = this.props.project ? this.props.project.description : null;

        let deleteActions = [
            <FlatButton
                label="CANCEL"
                secondary={true}
                onTouchTap={() => this.handleClose()} />,
            <FlatButton
                label="DELETE"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.handleDeleteButton()} />
        ];
        let editActions = [
            <FlatButton
                label="CANCEL"
                secondary={true}
                onTouchTap={() => this.handleClose()} />,
            <FlatButton
                label="UPDATE"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.handleUpdateButton()} />
        ];
        let memberActions = [
            <FlatButton
                label="CANCEL"
                secondary={true}
                onTouchTap={() => this.handleClose()} />,
            <FlatButton
                label="ADD"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.handleMemberButton(currentUser)} />
        ];

        return (
            <div>
                <Dialog
                    style={styles.dialogStyles}
                    title="Are you sure you want to delete this project?"

                    autoScrollBodyContent={true}
                    actions={deleteActions}
                    onRequestClose={this.handleClose.bind(this)}
                    open={this.state.deleteOpen}>
                    <i className="material-icons" style={styles.warning}>warning</i>
                    <p style={styles.msg}>Deleting this project will also delete any folders or files contained inside of the project. As a fail-safe, you must enter the project name exactly in the form below before you can delete this project.</p>
                    <TextField
                        style={styles.textStyles}
                        errorText={this.state.floatingErrorText3}
                        floatingLabelText="Enter the project name exactly"
                        id="projName"
                        type="text"
                        multiLine={true}
                        onChange={this.handleFloatingErrorInputChange3.bind(this)}/> <br/>
                </Dialog>
                <Dialog
                    style={styles.dialogStyles}
                    title="Update Project"
                    autoDetectWindowHeight={true}
                    autoScrollBodyContent={true}
                    actions={editActions}
                    onRequestClose={this.handleClose.bind(this)}
                    open={this.state.editOpen}>
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
                    autoDetectWindowHeight={true}
                    autoScrollBodyContent={true}
                    actions={memberActions}
                    onRequestClose={this.handleClose.bind(this)}
                    open={this.state.memberOpen}>
                    <form action="#" id="newMemberForm">
                        <AutoComplete
                            id="fullName"
                            floatingLabelText="Name"
                            filter={AutoComplete.fuzzyFilter}
                            dataSource={names}
                            errorText={this.state.floatingErrorText}
                            onUpdateInput={this.handleUpdateInput.bind(this)}/><br/>
                        <SelectField value={this.state.value}
                                     onChange={this.handleSelectValueChange.bind(this, 'value')}
                                     floatingLabelText="Project Role"
                                     floatingLabelStyle={{color: '#757575'}}
                                     errorText={this.state.errorText}
                                     errorStyle={styles.textStyles}
                                     style={styles.textStyles}>
                            <MenuItem value={0} primaryText='Project Administrator'/>
                            <MenuItem value={1} primaryText='Project Viewer'/>
                            <MenuItem value={2} primaryText='File Downloader'/>
                            <MenuItem value={3} primaryText='File Uploader'/>
                            <MenuItem value={4} primaryText='File Editor'/>
                        </SelectField><br/>
                    </form>
                </Dialog>
                <IconMenu iconButtonElement={<IconButton iconClassName="material-icons">more_vert</IconButton>}
                          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                          targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                    <MenuItem primaryText="Delete Project" leftIcon={<i className="material-icons">delete</i>} onTouchTap={this.handleTouchTapDelete.bind(this)}/>
                    <MenuItem primaryText="Edit Project" leftIcon={<i className="material-icons">mode_edit</i>} onTouchTap={this.handleTouchTapEdit.bind(this)}/>
                    <MenuItem primaryText="Add Project Member" leftIcon={<i className="material-icons">person_add</i>} onTouchTap={this.handleTouchTapMembers.bind(this)}/>
                </IconMenu>
            </div>
        );
    }

    handleTouchTapDelete() {
        this.setState({deleteOpen: true});
    }

    handleTouchTapEdit() {
        this.setState({editOpen: true});    }

    handleTouchTapMembers() {
        this.setState({memberOpen: true});
    }

    handleDeleteButton() {
        let id = this.props.params.id;
        let prName = this.props.project ? this.props.project.name : null;
        if(document.getElementById('projName').value != prName){
            this.setState({
                floatingErrorText3: 'Enter the project name exactly to delete'
            });
            return null
        }else{
            ProjectActions.deleteProject(id);
            this.setState({deleteOpen: false});
            setTimeout(()=>this.props.appRouter.transitionTo('/home'),500)
        }
    }

    handleUpdateButton() {
        let id = this.props.params.id;
        let name = document.getElementById('projectNameText').value;
        let desc = document.getElementById('projectDescriptionText').value;
        if (this.state.floatingErrorText != '' && this.state.floatingErrorText2 != '') {
            return null
        } else {
            ProjectActions.editProject(id, name, desc);
            this.setState({
                editOpen: false,
                floatingErrorText: 'This field is required.',
                floatingErrorText2: 'This field is required'
            });
        }
    };

    handleSelectValueChange (event, index, value) {
        this.setState({
            value,
            errorText: null
        });
    };

    handleUpdateInput (text) {
        ProjectActions.getUserName(text);
        this.setState({
            floatingErrorText: document.getElementById("fullName").value ? '' : 'This field is required'
        });
    };


    handleMemberButton(currentUser) {
        let  fullName = document.getElementById("fullName").value;
        let role = null;
        switch(this.state.value){
            case 0:
                role = 'project_admin';
                break;
            case 1:
                role = 'project_viewer';
                break;
            case 2:
                role = 'file_downloader';
                break;
            case 3:
                role = 'file_uploader';
                break;
            case 4:
                role = 'file_editor';
                break;
        }
        let id = this.props.params.id;
        if (this.state.floatingErrorText != '' || this.state.value === null) {
            this.setState({
                errorText: 'Select a project role'
            });
            return null
        }
        if(currentUser === fullName){
            this.setState({
                floatingErrorText: "You can't add yourself or change your role"
            });
            return null
        }
        else {
            ProjectActions.getUserId(fullName, id, role);
            this.setState({
                memberOpen: false,
                floatingErrorText: 'This field is required.',
                floatingErrorText2: 'This field is required.',
                value: null
            });
        }
    };

    handleFloatingErrorInputChange(e) {
        this.setState({
            floatingErrorText: e.target.value ? '' : 'This field is required'
        });
    };

    handleFloatingErrorInputChange2(e) {
        this.setState({
            floatingErrorText2: e.target.value ? '' : 'This field is required'
        });
    };

    handleFloatingErrorInputChange3(e) {
        let prName = this.props.project ? this.props.project.name : null;
        this.setState({
            floatingErrorText3: e.target.value === prName ? '' : 'Enter the project name exactly to delete'
        });
    };

    handleClose() {
        this.setState({
            deleteOpen: false,
            editOpen: false,
            errorText: null,
            floatingErrorText: 'This field is required.',
            floatingErrorText2: 'This field is required',
            floatingErrorText3: 'Enter the project name exactly to delete',
            memberOpen: false,
            value: null
        });
    };
}
var styles = {
    addProject: {
        float: 'right',
        position: 'relative',
        margin: '12px 8px 0px 0px'
    },
    selectStyle: {
        textAlign: 'left'
    },
    dialogStyles: {
        textAlign: 'center',
        fontColor: '#303F9F',
        zIndex: '5000'
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

export default ProjectOptionsMenu;