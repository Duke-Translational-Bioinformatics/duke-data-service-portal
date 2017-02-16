import React from 'react';
import MainActions from '../../actions/mainActions';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import AddAgentModal from '../../components/globalComponents/addAgentModal.jsx';
import {UrlGen} from '../../../util/urlEnum.js';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import Loaders from '../../components/globalComponents/loaders.jsx';
import TextField from 'material-ui/TextField';

class AgentList extends React.Component {

    render() {
        let agents = [];
        let agentKey = this.props.agentKey ? this.props.agentKey.key : null;
        let dialogStyle= this.props.screenSize.width < 580 ? {width: '100%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'} : {position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'};
        let userKey = this.props.userKey ? this.props.userKey.key : null;
        let apiToken = this.props.agentApiToken ? this.props.agentApiToken.api_token : null;
        let apiUrl = DDS_PORTAL_CONFIG.baseUrl;
        let obj = {agent_key: agentKey, user_key: userKey, api_token: apiToken, api_url: apiUrl};
        let open = this.props.modal ? this.props.modal : false;
        let msg = Object.keys(ProjectStore.agentApiToken).length === 0 ?
            <h6 style={styles.apiMsg}>You must have a valid user key, please create one by selecting 'USER SECRET KEY' in the drop down menu.</h6> :
            <h6 style={styles.apiMsg2}>The API token included with these credentials will expire in 2 hours.</h6>;

        let keyActions = [
            <FlatButton
                label="CANCEL"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.handleClose()} />,
            <FlatButton
                label="COPY CREDENTIALS TO CLIPBOARD"
                secondary={true}
                onTouchTap={this.copyApiKey.bind(this)} />
        ];

        let modal = <Dialog
            style={styles.dialogStyles}
            title="Agent Credentials"
            contentStyle={dialogStyle}
            autoDetectWindowHeight={true}
            actions={keyActions}
            onRequestClose={() => this.handleClose()}
            open={open}>
            { msg }
            <form action="#" id="apiKeyForm" className="keyText">
                <TextField
                    textareaStyle={styles.textArea}
                    style={styles.keyModal}
                    defaultValue={JSON.stringify(obj, null, 4)}
                    floatingLabelText="Agent Credentials"
                    id="keyText"
                    ref={(input) => this.keyText = input}
                    type="text"
                    multiLine={true}
                    />
            </form>
        </Dialog>;

        agents = this.props.agents;

        let agentList = agents.map((agent) => {
            if (agent.audit.created_by.id === this.props.currentUser.id) {
                return (
                    <li key={ agent.id } className="hover">
                        <FlatButton label="credentials" primary={true} style={styles.getKeyButton} onTouchTap={() => this.getCredentials(agent.id)}/>
                        <a href={UrlGen.routes.agent(agent.id)} className="item-content external">
                            <div className="item-media">
                                <FontIcon className="material-icons" style={styles.icon}>laptop_mac</FontIcon>
                            </div>
                            <div className="item-inner">
                                <div className="item-title-row">
                                    <div className="item-text mdl-color-text--grey-800" style={styles.title}>{ agent.name }</div>
                                </div>
                                <div className="item-text mdl-color-text--grey-600">{ agent.description }</div>
                            </div>
                        </a>
                    </li>
                );
            } else {
                return (
                    null
                );
            }
        });

        return (
            <div className="list-container" style={styles.listContainer}>
                {modal}
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.list}>
                    <div style={styles.headerTitle}>
                        <h4>Software Agents</h4>
                    </div>
                    <div className="mdl-cell mdl-cell--12-col">
                        <AddAgentModal {...this.props}/>
                    </div>
                </div>
                <div className="mdl-cell mdl-cell--12-col" style={styles.loading}>
                    { this.props.uploads || this.props.loading ? <Loaders {...this.props}/> : null }
                </div>
                <div className="mdl-cell mdl-cell--12-col content-block" style={styles.list}>
                    <div className="list-block list-block-search searchbar-found media-list">
                        <ul>
                            {agentList}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    getCredentials(id) {
        ProjectActions.getAgentKey(id);
        ProjectActions.getUserKey();
        setTimeout(() => {
            let agentKey = this.props.agentKey ? this.props.agentKey.key : null;
            let userKey = this.props.userKey ? this.props.userKey.key : null;
            let formData = new FormData();
            formData.append('agent_key', agentKey);
            formData.append('user_key', userKey);
            if (!userKey){
                ProjectActions.createUserKey();
                ProjectActions.getUserKey();
                setTimeout(() => {
                    let agentKey = this.props.agentKey ? this.props.agentKey.key : null;
                    let userKey = this.props.userKey ? this.props.userKey.key : null;
                    let formData = new FormData();
                    formData.append('agent_key', agentKey);
                    formData.append('user_key', userKey);
                    if (!userKey){
                        ProjectActions.createUserKey();
                        ProjectActions.getUserKey();

                    } else {
                        ProjectActions.getAgentApiToken(agentKey, userKey, formData);
                    }
                }, 800);
            } else {
                ProjectActions.getAgentApiToken(agentKey, userKey, formData);
            }
        }, 800);
    }

    copyApiKey() {
        this.keyText.select();
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        if(msg === 'successful') {
            MainActions.addToast('Credentials copied to clipboard!');
            ProjectActions.closeModal();
        }
        if(msg === 'unsuccessful'){
            MainActions.addToast('Failed copying credentials to clipboard!');
            alert("Automatic copying to clipboard is not supported by Safari browsers: Manually copy the key by" +
                " using CMD+C,");
        }
    };

    handleClose() {
        ProjectActions.closeModal();
        ProjectActions.clearApiToken(); // Use this to make sure old api token doesn't show
    };
}

AgentList.contextTypes = {
    muiTheme: React.PropTypes.object
};

var styles = {
    apiMsg: {
        textAlign: 'center',
        color: '#F44336'
    },
    apiMsg2: {
        textAlign: 'center'
    },
    dialogStyles: {
        textAlign: 'center',
        fontColor: '#303F9F',
        zIndex: '5000'
    },
    getKeyButton: {
        float: 'right',
        marginTop: 15
    },
    headerTitle: {
        float: 'left',
        margin: '10px 0px 0px 14px'
    },
    icon: {
        fontSize: 36,
        color: '#616161'
    },
    keyModal: {
        width: 300,
        textAlign: 'left',
        fontFamily: 'monospace',
        fontSize: '1em'
    },
    list: {
        float: 'right'
    },
    listContainer: {
        marginTop: 65
    },
    loaders: {
        paddingTop: 40
    },
    textArea: {
        color: '#F44336'
    },
    title: {
        marginRight: 40
    }
};

AgentList.propTypes = {
    loading: React.PropTypes.bool,
    agents: React.PropTypes.array,
    error: React.PropTypes.object
};

export default AgentList;