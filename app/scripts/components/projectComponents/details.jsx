import React from 'react';
import { Link } from 'react-router';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import MainActions from '../../actions/mainActions';
import MainStore from '../../stores/mainStore';
import ProjectOptionsMenu from './projectOptionsMenu.jsx';
import UploadModal from '../globalComponents/uploadModal.jsx';
import urlGen from '../../../util/urlGen.js';
import baseUtils from '../../../util/baseUtils.js';
import Card from 'material-ui/lib/card/card';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import MenuItem from 'material-ui/lib/menus/menu-item';
import SelectField from 'material-ui/lib/select-field';

class Details extends React.Component {

    constructor() {
        this.state = {
            deleteModal: false,
            errorText: null,
            memberModal: false,
            userId: null,
            userName: null,
            value: null
        }
    }

    render() {
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

        function lastUpdated(){
            let lstUpdtOn = this.props.project && this.props.project.audit ? this.props.project.audit.last_updated_on : null;
            let x = new Date(lstUpdtOn);
            let lastUpdatedOn = x.toString();
        }


        let createdById = this.props.project && this.props.project.audit ? this.props.project.audit.created_by.id : null;
        let currentUserId = this.props.currentUser ? this.props.currentUser.id : null;
        let description = this.props.project ? this.props.project.description : null;
        let projectId =  this.props.project ? this.props.project.id : null;
        let lastUpdatedBy = this.props.project && this.props.project.audit ? this.props.project.audit.last_updated_by : null;
        let prjPrm = this.props.projPermissions && this.props.projPermissions !== undefined ? this.props.projPermissions : null;
        let users = this.props.projectMembers ? this.props.projectMembers : null;

        let members = users.map((users)=> {
            return <li key={users.user.id}>
                <div style={styles.iconContainer}>
                    <a href="#" onTouchTap={() => this.handleTouchTapDelete(users.user.id, users.user.full_name)} style={{marginRight: 0}}>
                        {users.user.id != currentUserId && users.user.id != createdById && prjPrm === 'prjCrud' ? <i className="material-icons" style={styles.deleteIcon}>cancel</i> : ''}</a>
                    <a href="#" onTouchTap={() => this.handleTouchTapRoles(users.user.id, users.user.full_name)}>
                        {users.user.id != currentUserId && prjPrm === 'prjCrud' ? <i className="material-icons" style={styles.settingsIcon}>settings</i> : ''}</a>
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
                    title={'Remove ' +this.state.userName+ ' from this project?'}
                    autoDetectWindowHeight={true}
                    autoScrollBodyContent={true}
                    actions={deleteActions}
                    onRequestClose={() => this.handleClose()}
                    open={this.state.deleteModal}>
                    <i className="material-icons" style={styles.warning}>warning</i>
                </Dialog>
                <Dialog

                    style={styles.dialogStyles}
                    title={"Change the project role for " + this.state.userName + '?' }
                    autoDetectWindowHeight={true}
                    autoScrollBodyContent={true}
                    actions={memberActions}
                    onRequestClose={() => this.handleClose()}
                    open={this.state.memberModal}>
                    <form action="#" id="newMemberForm">
                        <SelectField value={this.state.value}
                                     onChange={this.handleSelectValueChange.bind(this, 'value')}
                                     floatingLabelText="Project Role"
                                     floatingLabelStyle={{color: '#757575'}}
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
                <div className="list-block">
                    <ul>
                        <li className="item-divider">Project ID</li>
                        <li className="item-content">
                            <div className="item-inner">
                                <div className="item-title">{ projectId }</div>
                            </div>
                        </li>
                        <li className="item-divider">Last Updated By</li>
                        <li className="item-content">
                            <div className="item-inner">
                                <div className="item-title">{ lastUpdatedBy.full_name }</div>
                            </div>
                        </li>
                        <li className="item-divider">Last Updated On</li>
                        <li className="item-content">
                            <div className="item-inner">
                                <div className="item-title">{ lastUpdated() }</div>
                            </div>
                        </li>
                        <li className="item-divider">Description</li>
                        <li className="item-content">
                            <div className="item-inner">
                                <div>{ description }</div>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="list-block">
                    <ul>
                        <li className="item-divider">Project Members</li>
                        { members }
                    </ul>
                </div>
            </div>
        )
    }

    handleTouchTapDelete(userId, userName){
        this.setState({
            deleteModal: true,
            userId: userId,
            userName: userName
        });
    }

    handleTouchTapRoles(userId, userName) {
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
        let userId = this.state.userId;
        ProjectActions.deleteProjectMember(id, userId, name);
        this.setState({
            deleteModal: false,
            userId: null,
            userName: null
        });
    }

    handleMemberButton(currentUser) {
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
            ProjectActions.addProjectMember(id, userId, role, name);
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
}


var styles = {
    deleteIcon: {
        fontSize: 18,
        color: '#F44336',
        marginTop: 22
    },
    dialogStyles: {
        textAlign: 'center',
        fontColor: '#303F9F',
        zIndex: '5000'
    },
    iconContainer: {
        float: 'right'
    },
    settingsIcon: {
        fontSize: 18,
        color: '#235F9C',
        marginTop: 22,
        marginLeft: 16
    },
    textStyles: {
        textAlign: 'left',
        fontColor: '#303F9F'
    },
    warning: {
        fontSize: 48,
        color: '#F44336'
    }

};

Details.contextTypes = {
    muiTheme: React.PropTypes.object
};

Details.propTypes = {
    project: React.PropTypes.object,
    projectMembers: React.PropTypes.array,
    currentUser: React.PropTypes.object,
};

export default Details;