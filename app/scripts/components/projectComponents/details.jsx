import React, { PropTypes } from 'react';
const { object, array, string } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import authStore from '../../stores/authStore';
import BaseUtils from '../../util/baseUtils.js';
import { Color } from '../../theme/customTheme';
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
            value: null
        }
    }

    render() {
        const { project, projectMembers, projectRole, screenSize } = mainStore;
        const { currentUser } = authStore;
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
                onTouchTap={() => this.handleMemberButton()} />
        ];

        let dialogWidth = screenSize.width < 580 ? {width: '100%'} : {};
        let admins = projectMembers.filter((m) => m.auth_role.id === 'project_admin');

        let members = projectMembers.map((users)=> {
            let showIcons = admins.length > 1 && projectRole === 'project_admin' || (projectRole === 'project_admin' && users.user.id !== currentUser.id);
            let removeSelf = users.user.id === currentUser.id;
            return <li key={users.user.id}>
                <div style={styles.iconContainer}>
                    <a href="#" onTouchTap={() => this.deleteUser(users.user.id, users.user.full_name, removeSelf)} style={styles.deleteIcon.wrapper}>
                        {showIcons ? <i className="material-icons" style={styles.deleteIcon}>cancel</i> : ''}</a>
                    <a href="#" onTouchTap={() => this.changeRole(users.user.id, users.user.full_name)}>
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
        });

        return (
            <div>
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={dialogWidth}
                    title={'Remove ' +this.state.userName+ ' from this project?'}
                    autoDetectWindowHeight={true}
                    actions={deleteActions}
                    onRequestClose={() => this.handleClose()}
                    open={this.state.deleteModal}>
                    <i className="material-icons" style={styles.warning}>warning</i>
                </Dialog>
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={dialogWidth}
                    title={"Change the project role for " + this.state.userName + '?' }
                    autoDetectWindowHeight={true}
                    actions={memberActions}
                    onRequestClose={() => this.handleClose()}
                    open={this.state.memberModal}>
                    <form action="#" id="newMemberForm">
                        <SelectField value={this.state.value}
                                     onChange={this.handleSelectValueChange.bind(this, 'value')}
                                     floatingLabelText="Project Role"
                                     floatingLabelStyle={{color: Color.dkGrey}}
                                     errorText={this.state.errorText}
                                     style={styles.textStyles}>
                            <MenuItem value={0} primaryText='Project Administrator'/>
                            <MenuItem value={1} primaryText='Project Viewer'/>
                            <MenuItem value={2} primaryText='File Downloader'/>
                            <MenuItem value={3} primaryText='File Uploader'/>
                            <MenuItem value={4} primaryText='File Editor'/>
                        </SelectField><br/>
                    </form>
                </Dialog>
                <div className="list-block" style={styles.firstListBlock}>
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

                <div className="list-block">
                    <ul>
                        <li className="item-divider" style={styles.button.listItem}>
                            Project Members
                            <FlatButton style={styles.button}
                                onTouchTap={() => this.toggleModal('addMember')}
                                label="Add Project Members"
                                labelPosition="before"
                                secondary={true}
                                icon={<i className="material-icons">person_add</i>}
                            />
                        </li>
                        { members }
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

    changeRole(userId, userName) {
        this.setState({
            memberModal: true,
            userId: userId,
            userName: userName
        });
    }

    handleSelectValueChange (event, index, value) {
        this.setState({
            value,
            errorText: null
        });
    }

    handleDeleteButton() {
        let id = this.props.params.id;
        let name = this.state.userName;
        let removeSelf = this.state.removeSelf;
        let userId = this.state.userId;
        mainStore.deleteProjectMember(id, userId, name, removeSelf);
        this.setState({
            deleteModal: false,
            removeSelf: false,
            userId: null,
            userName: null
        });
        if(removeSelf) this.props.router.push('/');
    }

    handleMemberButton() {
        let id = this.props.params.id;
        let name = this.state.userName;
        let userId = this.state.userId;
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
        if(this.state.value !== null) {
            mainStore.addProjectMember(id, userId, role, name);
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

    toggleModal(id) {
        mainStore.toggleModals(id)
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
        marginTop: 110
    },
    iconContainer: {
        float: 'right'
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
    currentUser: object,
    screenSize: object,
    projPermissions: string,
};

export default Details;