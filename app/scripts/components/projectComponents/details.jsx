import React, { PropTypes } from 'react';
const { object, array, string } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import authStore from '../../stores/authStore';
import BaseUtils from '../../util/baseUtils.js';
import { Color } from '../../theme/customTheme';
import { Roles } from '../../enum';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';

@observer
class Details extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            deleteModal: false,
            errorText: null,
            memberModal: false,
            removeSelf: false,
            userId: null,
            userName: null,
            role: null
        }
    }

    render() {
        const { project, projectMembers, projectRole, screenSize } = mainStore;
        const { deleteModal, errorText, memberModal, role, userName } = this.state;
        const { currentUser } = authStore;
        const dialogWidth = screenSize.width < 580 ? {width: '100%'} : {};
        const admins = projectMembers.filter((m) => m.auth_role.id === Roles.project_admin);
        const deleteActions = [
            <FlatButton
                label="CANCEL"
                secondary={true}
                onTouchTap={() => this.handleClose()}/>,
            <FlatButton
                label="REMOVE"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.handleDeleteButton()}/>
        ];
        const memberActions = [
            <FlatButton
                label="CANCEL"
                secondary={true}
                onTouchTap={() => this.handleClose()} />,
            <FlatButton
                label="CHANGE ROLE"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.changeMemberRole()} />
        ];

        return (
            <div>
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={dialogWidth}
                    title={`${userName} from this project?`}
                    autoDetectWindowHeight={true}
                    actions={deleteActions}
                    onRequestClose={() => this.handleClose()}
                    open={deleteModal}>
                    <i className="material-icons" style={styles.warning}>warning</i>
                </Dialog>
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={dialogWidth}
                    title={`Change the project role for ${userName}?` }
                    autoDetectWindowHeight={true}
                    actions={memberActions}
                    onRequestClose={() => this.handleClose()}
                    open={memberModal}>
                    <SelectField value={role}
                                 onChange={this.handleSelectValueChange.bind(this, 'value')}
                                 floatingLabelText="Project Role"
                                 floatingLabelStyle={{color: Color.dkGrey}}
                                 errorText={errorText}
                                 style={styles.textStyles}>
                        <MenuItem value={'project_admin'} primaryText='Project Administrator'/>
                        <MenuItem value={'project_viewer'} primaryText='Project Viewer'/>
                        <MenuItem value={'file_downloader'} primaryText='File Downloader'/>
                        <MenuItem value={'file_uploader'} primaryText='File Uploader'/>
                        <MenuItem value={'file_editor'} primaryText='File Editor'/>
                    </SelectField><br/>
                </Dialog>
                <div className="list-block" style={styles.firstListBlock}>
                    <ul>
                        <li className="item-divider" style={styles.button.listItem}>
                            Project Members
                            { projectRole === (Roles.project_admin || Roles.system_admin) && <FlatButton style={styles.button}
                                                                                                         onTouchTap={() => this.toggleTeamManager()}
                                                                                                         label="Add Project Members"
                                                                                                         labelPosition="before"
                                                                                                         secondary={true}
                                                                                                         icon={<i className="material-icons">person_add</i>}
                            /> }
                        </li>
                        { projectMembers.map((users)=> {
                            let showIcons = admins.length > 1 && projectRole === Roles.project_admin || (projectRole === Roles.project_admin && users.user.id !== currentUser.id);
                            let removeSelf = users.user.id === currentUser.id;
                            return <li key={users.user.id}>
                                <div style={styles.iconContainer}>
                                    <a href="#" onTouchTap={() => this.deleteUser(users.user.id, users.user.full_name, removeSelf)} style={styles.deleteIcon.wrapper}>
                                        {showIcons ? <i className="material-icons" style={styles.deleteIcon}>cancel</i> : ''}</a>
                                    <a href="#" onTouchTap={() => this.changeRole(users.user.id, users.user.full_name, users.auth_role.id)}>
                                        {showIcons ? <i className="material-icons" style={styles.settingsIcon}>settings</i> : ''}</a>
                                </div>
                                <div className="item-content">
                                    <div className="item-media"><i className="material-icons">face</i></div>
                                    <div className="item-inner">
                                        <div className="item-title-row">
                                            <div className="item-title">{users.user.full_name}</div>
                                            <span className="mdl-color-text--grey-600">{ users.auth_role.name }</span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        }) }
                    </ul>
                </div>
                <div className="list-block" style={styles.secondListBlock}>
                    <ul>
                        <li className="item-divider">Description</li>
                        <li className="item-content">
                            <div className="item-inner">
                                <div>{ project.description }</div>
                            </div>
                        </li>
                        <li className="item-divider">Project ID</li>
                        <li className="item-content">
                            <div className="item-inner">
                                <div className="item-title">{ project.id }</div>
                            </div>
                        </li>
                        <li className="item-divider">Created On</li>
                        <li className="item-content">
                            <div className="item-inner">
                                <div>{ BaseUtils.formatDate(project.audit.created_on) }</div>
                            </div>
                        </li>
                        <li className="item-divider">Last Updated By</li>
                        <li className="item-content">
                            <div className="item-inner">
                                <div className="item-title">{ project.audit.last_updated_by !== null ? project.audit.last_updated_by.full_name : 'n/a' }</div>
                            </div>
                        </li>
                        <li className="item-divider">Last Updated On</li>
                        <li className="item-content">
                            <div className="item-inner">
                                <div className="item-title">{ project && project.audit.last_updated_on !== null ? BaseUtils.formatDate(project.audit.last_updated_on) : null }</div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }

    deleteUser(userId, userName, removeSelf){
        this.setState({
            deleteModal: true,
            removeSelf: removeSelf,
            userId: userId,
            userName: userName
        });
    }

    changeRole(userId, userName, role) {
        this.setState({
            memberModal: true,
            userId: userId,
            userName: userName,
            role: role
        });
    }

    changeMemberRole() {
        const id = this.props.params.id;
        const {userId, userName, role} = this.state;
        if(role !== null) {
            mainStore.addProjectMember(id, userId, role, userName);
            this.setState({
                memberModal: false,
                value: null
            });
        } else {
            this.setState({
                errorText: 'Select a project role'
            });
        }
    }

    getRole(value) {
        let role;
        switch(value){
            case 0:
                role = Roles.project_admin;
                break;
            case 1:
                role = Roles.project_viewer;
                break;
            case 2:
                role = Roles.file_downloader;
                break;
            case 3:
                role = Roles.file_uploader;
                break;
            case 4:
                role = Roles.file_editor;
                break;
        }
        return role;
    }

    handleSelectValueChange (event, index, value) {
        const role = this.getRole(value);
        this.setState({
            role: role,
            errorText: null
        });
    }

    handleDeleteButton() {
        const id = this.props.params.id;
        const {userId, userName, removeSelf} = this.state;
        mainStore.deleteProjectMember(id, userId, userName, removeSelf);
        this.setState({
            deleteModal: false,
            removeSelf: false,
            userId: null,
            userName: null
        });
    }

    handleClose() {
        this.setState({
            deleteModal: false,
            errorText: null,
            userId: null,
            userName: null,
            memberModal: false,
            value: null
        });
    }

    toggleTeamManager() {
        mainStore.toggleTeamManager()
    }
}


const styles = {
    button: {
        float: 'right',
        margin: 6,
        listItem: {
            paddingRight: 4
        }
    },
    deleteIcon: {
        fontSize: 18,
        color: Color.red,
        marginTop: 22,
        wrapper: {
            marginRight: 0
        }
    },
    dialogStyles: {
        textAlign: 'center',
        fontColor: Color.dkBlue,
        zIndex: '5000'
    },
    firstListBlock: {
        marginTop: 140
    },
    iconContainer: {
        float: 'right'
    },
   secondListBlock: {
        marginTop: -33
    },
    settingsIcon: {
        fontSize: 18,
        color: Color.blue,
        marginTop: 22,
        marginLeft: 16
    },
    textStyles: {
        textAlign: 'left',
        fontColor: Color.dkBlue
    },
    warning: {
        fontSize: 48,
        color: Color.red
    }
};

Details.contextTypes = {
    muiTheme: object
};

Details.propTypes = {
    project: object,
    projectMembers: array,
    projectRole: string,
    currentUser: object,
    screenSize: object
};

export default Details;