import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { debounce } from 'lodash';
import mainStore from '../../stores/mainStore';
import authStore from '../../stores/authStore';
import { Color } from '../../theme/customTheme';
import AutoComplete from 'material-ui/AutoComplete';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import Checkbox from 'material-ui/Checkbox';
import CircularProgress from 'material-ui/CircularProgress';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import {Tabs, Tab} from 'material-ui/Tabs';
const { object, array, bool } = PropTypes;

@observer
class ProjectTeamManager extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            errorText: null,
            floatingErrorText: '',
            value: null
        };
        this.search = debounce(this.search ,500);
    }

    componentDidUpdate() {
        if(mainStore.toggleModal.open && mainStore.toggleModal.id === 'addMember') setTimeout(()=>this.fullName.focus(), 300);
    }

    render() {
        const { currentUser, project, projectTeams, selectedTeam, showAlert, showTeamManager, users } = mainStore;
        let userName = currentUser ? currentUser.full_name : null;
        let id = this.props.router.location.pathname.includes('project') ? this.props.params.id : project ? project.id : null;
        let width = window.innerWidth > 640 ? window.innerWidth*.8 : window.innerWidth;
        let autoCompleteData = users.map((user)=>{
            return {text: user.full_name, value: user.full_name, id: user.uid}
        });

        const teams = Array.from(projectTeams.values()).map((p) => {
            const members = p.members.map((m)=>{
                return (
                        <li key={Math.random()} className="item-content">
                            <div className="item-inner">
                                <div className="item-title">{m.user.full_name}</div>
                                <div className="item-after">{m.auth_role.name}</div>
                            </div>
                        </li>
                )
            });

            return (<Card key={Math.random()}>
                <Checkbox style={styles.checkbox}
                          onCheck={() => this.setSelectedTeam(p.members[0].project.id)}
                          checked={selectedTeam.includes(p.members[0].project.id)}/>
                <CardHeader
                    style={{padding: '4px 10px'}}
                    title={p.name}
                    subtitle={`${p.members.length} members`}
                    actAsExpander={true}
                    showExpandableButton={true}
                />
                <CardText expandable={true} style={{padding: 0}}>
                    <div className="list-block" style={{margin: 0}}>
                        <ul>{members}</ul>
                    </div>
                </CardText>
            </Card>)
        });

        return (
                <Drawer docked={false}
                        disableSwipeToOpen={true}
                        width={width}
                        openSecondary={true}
                        onRequestChange={() => this.toggleTeamManager()}
                        open={showTeamManager}>
                    <div className="mdl-cell mdl-cell--1-col mdl-cell--8-col-tablet mdl-cell--4-col-phone mdl-color-text--grey-800" style={styles.closeIcon}>
                        <IconButton
                            style={styles.toggleBtn}
                            onTouchTap={() => this.toggleTeamManager()}>
                            <NavigationClose />
                        </IconButton>
                    </div>
                    <div className="mdl-cell mdl-cell--12-col mdl-cell--8-col-tablet mdl-cell--4-col-phone mdl-color-text--grey-800" style={styles.mainWrapper}>
                    <div className="mdl-cell mdl-cell--8-col mdl-cell--8-col-tablet mdl-cell--4-col-phone mdl-color-text--grey-800" style={styles.innerWrapper}>
                    <h4 className="mdl-color-text--grey-800" style={styles.heading}>Manage Project Team Members</h4>
                        <Tabs inkBarStyle={styles.tabInkBar}>
                            <Tab label="Add a New Member" style={styles.tabStyles}>
                                    {mainStore.drawerLoading ? <CircularProgress size={30} thickness={4} style={styles.loading}/> : null}
                                    <AutoComplete
                                        style={{textAlign: 'left'}}
                                        fullWidth={true}
                                        ref={(input) => this.fullName = input}
                                        floatingLabelText="Name"
                                        filter={AutoComplete.caseInsensitiveFilter}
                                        dataSource={autoCompleteData}
                                        errorText={this.state.floatingErrorText}
                                        maxSearchResults={7}
                                        onNewRequest={(value, e) => this.chooseUser(value, e)}
                                        onUpdateInput={() => this.search()}/><br/>
                                    <SelectField value={this.state.value}
                                                 onChange={this.handleSelectValueChange.bind(this, 'value')}
                                                 floatingLabelText="Project Role"
                                                 floatingLabelStyle={styles.textStyles.floatingLabel}
                                                 errorText={this.state.errorText}
                                                 errorStyle={styles.textStyles}
                                                 style={styles.textStyles}
                                                 fullWidth={true}>
                                        <MenuItem value={0} primaryText='Project Administrator'/>
                                        <MenuItem value={1} primaryText='Project Viewer'/>
                                        <MenuItem value={2} primaryText='File Downloader'/>
                                        <MenuItem value={3} primaryText='File Uploader'/>
                                        <MenuItem value={4} primaryText='File Editor'/>
                                    </SelectField>
                                <div style={styles.buttonWrapper}>
                                    <RaisedButton label={'Add Team Member'}
                                                  labelStyle={styles.buttonLabel}
                                                  style={styles.addTeamBtn}
                                                  onTouchTap={() => this.addTeamMember(userName, id)}/>
                                    <RaisedButton label={'Cancel'}
                                                  labelStyle={styles.buttonLabel}
                                                  style={styles.cancelBtn}
                                                  onTouchTap={() => this.toggleTeamManager()}
                                    />
                                </div>
                            </Tab>
                            <Tab label="Use An Existing Team" style={styles.tabStyles} onClick={() => this.getProjects()}>
                                {teams}
                                {showAlert && <Paper style={styles.alert}>You must select at least one team to add</Paper>}
                                <div style={styles.buttonWrapper}>
                                    <RaisedButton label={'Create Team'}
                                                  labelStyle={styles.buttonLabel}
                                                  style={styles.addTeamBtn}
                                                  onTouchTap={() => this.createTeam()}/>
                                    <RaisedButton label={'Cancel'}
                                                  labelStyle={styles.buttonLabel}
                                                  style={styles.cancelBtn}
                                                  onTouchTap={() => this.toggleTeamManager()}
                                    />
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                    </div>
                </Drawer>
        );
    }

    addTeamMember(userName, id) {
        let  fullName = this.fullName.state.searchText;
        let role;
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
            default:
                role = null;
                break;
        }
        if (this.state.floatingErrorText !== '' || this.state.value === null) {
            this.setState({errorText: 'Select a project role'});
            return null
        }
        if(userName === fullName){
            this.setState({floatingErrorText: "You can't add yourself or change your role"});
            return null
        } else {
            mainStore.getUserId(fullName, id, role);
            this.toggleTeamManager();
            this.setState({value: null});
        }
    }

    chooseUser(value, e) {
        if(e === -1) return false;
        let id = value.id;
        mainStore.registerNewUser(id);
    }

    createTeam() {
        const {currentUser, project, projectTeams, selectedTeam, showAlert} = mainStore;
        const team = projectTeams.get(selectedTeam[0]);
        if(mainStore.selectedTeam.length) {
            team.members.forEach((m) => {
                if(m.user.id !== currentUser.id) mainStore.addProjectTeam(project.id, m.user.id, m.auth_role.id, m.project.name);
            });
            this.toggleTeamManager();
            if(showAlert) mainStore.toggleAlert();
        } else {
            mainStore.toggleAlert();
        }
    }

    getProjects() {
        mainStore.getProjects(null, null, true);
    }

    handleSelectValueChange (event, index, value) {
        this.setState({
            value,
            errorText: null
        });
    };

    search() {
        let value = this.fullName.state.searchText;
        let authId = authStore.appConfig.authServiceId;
        if (!value.indexOf(' ') <= 0) {
            mainStore.getUserNameFromAuthProvider(value, authId);
            this.setState({floatingErrorText: value ? '' : 'This field is required'});
        }
    }

    setSelectedTeam(id) {
        mainStore.setSelectedTeam(id)
    }

    toggleTeamManager() {
        mainStore.toggleTeamManager();
        mainStore.setSelectedTeam();
        this.setState({
            errorText: null,
            value: null
        });
    };
}

const styles = {
    alert: {
        padding: 20,
        color: Color.white,
        backgroundColor: Color.red
    },
    cancelBtn: {
        margin: '12px 12px 12px 12px',
        float: 'right'
    },
    checkbox: {
        float: 'left',
        width: '8%',
        margin: '11px 0px 11px 10px'
    },
    buttonLabel: {
        color: Color.blue
    },
    buttonWrapper: {
        marginTop: 20
    },
    addTeamBtn: {
        margin: '12px 0px 12px 12px',
        float: 'right'
    },
    closeIcon: {
        marginTop: 65
    },
    tabInkBar: {
        backgroundColor: Color.pink,
        paddingTop: 3,
        marginTop: -3,
        marginBottom: 40
    },
    tabStyles: {
        fontWeight: 200
    },
    heading: {
        textAlign: 'center',
        fontSize: '1.3em',
        marginBottom: 50
    },
    innerWrapper: {
        margin: '0 auto'
    },
    loading: {
        position: 'absolute',
        margin: '-10px auto',
        left: 0,
        right: 0
    },
    mainWrapper: {
        marginTop: 25
    },
    textStyles: {
        textAlign: 'left',
        alignSelf: 'center',
        marginTop: 30,
        floatingLabel: {
            color: Color.blue
        }
    }
};

ProjectTeamManager.propTypes = {
    currentUser: object,
    project: object,
    projectTeams: object,
    selectedTeam: array,
    showAlert: bool,
    showTeamManager: bool,
    users: array,
};

export default ProjectTeamManager;