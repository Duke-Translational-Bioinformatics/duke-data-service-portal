import React from 'react';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import AutoComplete from 'material-ui/AutoComplete';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import SelectField from 'material-ui/SelectField';

class ProjectOptionsMenu extends React.Component {

    constructor() {
        this.state = {
            deleteOpen: false,
            editOpen: false,
            errorText: null,
            floatingErrorText: '',
            floatingErrorText2: '',
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
                    contentStyle={this.props.screenSize.width < 580 ? {width: '100%'} : {}}
                    title="Are you sure you want to delete this project?"
                    autoDetectWindowHeight={true}
                    actions={deleteActions}
                    onRequestClose={this.handleClose.bind(this)}
                    open={this.state.deleteOpen}>
                    <i className="material-icons" style={styles.warning}>warning</i>
                    <p style={styles.msg}>Deleting this project will also delete any folders or files contained inside of the project. As a fail-safe, you must enter the project name exactly in the form below before you can delete this project.</p>
                    <TextField
                        style={styles.textStyles}
                        errorText={this.state.floatingErrorText3}
                        floatingLabelText="Enter the project name exactly"
                        ref={(input) => this.projName = input}
                        type="text"
                        multiLine={true}
                        onChange={this.handleFloatingErrorInputChange3.bind(this)}/> <br/>
                </Dialog>
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={this.props.screenSize.width < 580 ? {width: '100%'} : {}}
                    title="Update Project"
                    autoDetectWindowHeight={true}
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
                            ref={(input) => this.projectNameText = input}
                            type="text"
                            multiLine={true}
                            onChange={this.handleFloatingErrorInputChange.bind(this)}/> <br/>
                        <TextField
                            style={styles.textStyles}
                            hintText="Project Description"
                            defaultValue={desc}
                            errorText={this.state.floatingErrorText2}
                            floatingLabelText="Project Description"
                            ref={(input) => this.projectDescriptionText = input}
                            type="text"
                            multiLine={true}
                            onChange={this.handleFloatingErrorInputChange2.bind(this)}
                            />
                    </form>
                </Dialog>
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={this.props.screenSize.width < 580 ? {width: '100%'} : {}}
                    title="Add a Member"
                    autoDetectWindowHeight={true}
                    actions={memberActions}
                    onRequestClose={this.handleClose.bind(this)}
                    open={this.state.memberOpen}>
                    <form action="#" id="newMemberForm">
                        <AutoComplete
                            style={{textAlign: 'left'}}
                            ref={(input) => this.fullName = input}
                            floatingLabelText="Name"
                            filter={AutoComplete.caseInsensitiveFilter}
                            dataSource={names}
                            errorText={this.state.floatingErrorText}
                            maxSearchResults={7}
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
                <IconMenu iconButtonElement={<IconButton iconClassName="material-icons" style={styles.openIcon}>more_vert</IconButton>}
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
        setTimeout(()=>this.projName.select(), 300);
    }

    handleTouchTapEdit() {
        this.setState({editOpen: true});
        setTimeout(()=>this.projectNameText.select(), 300);
    }

    handleTouchTapMembers() {
        this.setState({memberOpen: true});
        setTimeout(()=>this.fullName.focus(), 300);
    }

    handleDeleteButton() {
        let id = this.props.params.id;
        let prName = this.props.project ? this.props.project.name : null;
        if(this.projName.getValue() != prName){
            this.setState({
                floatingErrorText3: 'Enter the project name exactly to delete'
            });
            return null
        }else{
            ProjectActions.deleteProject(id);
            this.setState({deleteOpen: false});
            setTimeout(()=>this.props.router.push('/'),500)
        }
    }

    handleUpdateButton() {
        let id = this.props.params.id;
        let name = this.projectNameText.getValue();
        let desc = this.projectDescriptionText.getValue();
        if (this.state.floatingErrorText != '' && this.state.floatingErrorText2 != '') {
            return null
        } else {
            ProjectActions.editProject(id, name, desc);
            this.setState({editOpen: false});
        }
    };

    handleSelectValueChange (event, index, value) {
        this.setState({
            value,
            errorText: null
        });
    };

    handleUpdateInput (text) {
        let timeout = this.state.timeout;
        clearTimeout(this.state.timeout);
        this.setState({
            timeout: setTimeout(() => {
                if (text.indexOf(' ') <= 0) {
                    ProjectActions.getUserName(text);
                    this.setState({
                        floatingErrorText: text ? '' : 'This field is required'
                    });
                }
            }, 500)
        })

    }

    handleMemberButton(currentUser) {
        let  fullName = this.fullName.state.searchText;
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
    openIcon: {
        marginBottom: 12
    },
    warning: {
        fontSize: 48,
        textAlign: 'center',
        color: '#F44336'
    }
};

export default ProjectOptionsMenu;