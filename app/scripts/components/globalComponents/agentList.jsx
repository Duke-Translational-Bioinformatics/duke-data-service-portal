import React, { PropTypes } from 'react';
const { object, bool, array, string } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import agentStore from '../../stores/agentStore';
import authStore from '../../stores/authStore';
import AddAgentModal from '../../components/globalComponents/addAgentModal.jsx';
import {UrlGen} from '../../../util/urlEnum.js';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import Loaders from '../../components/globalComponents/loaders.jsx';
import TextField from 'material-ui/TextField';

@observer
class AgentList extends React.Component {

    render() {
        const { agentApiToken, agentKey, agents } = agentStore;
        const { currentUser, userKey } = authStore;
        const { entityObj, loading, screenSize, toggleModal, uploads } = mainStore;
        let key = agentKey ? agentKey.key : null;
        let dialogStyle= screenSize.width < 580 ? {width: '100%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'} : {position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'};
        let userApiKey = userKey ? userKey.key : null;
        let apiToken = agentApiToken ? agentApiToken.api_token : null;
        let apiUrl = DDS_PORTAL_CONFIG.baseUrl;
        let obj = {agent_key: key, user_key: userApiKey, api_token: apiToken, api_url: apiUrl};
        let msg = Object.keys(agentApiToken).length > 0 ?
            <h6 style={styles.apiMsg2}>The API token included with these credentials will expire in 2 hours.</h6> :
            <h6 style={styles.apiMsg}>You must have a valid user key, please create one by selecting 'USER SECRET KEY' in the drop down menu.</h6>;

        let keyActions = [
            <FlatButton
                label="CANCEL"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.handleClose('agentCred')} />,
            <FlatButton
                label="COPY CREDENTIALS TO CLIPBOARD"
                secondary={true}
                onTouchTap={() => this.copyApiKey()} />
        ];

        let modal = <Dialog
            style={styles.dialogStyles}
            title="Agent Credentials"
            contentStyle={dialogStyle}
            autoDetectWindowHeight={true}
            actions={keyActions}
            onRequestClose={() => this.handleClose('agentCred')}
            open={agentApiToken.api_token !== null && userKey.key !== null && toggleModal && toggleModal.id === 'agentCred' ? toggleModal.open : false}>
            { msg }
            <form action="#" id="apiKeyForm" className="keyText">
                <TextField
                    textareaStyle={styles.textArea}
                    style={styles.keyModal}
                    defaultValue={JSON.stringify({agent_key: agentKey.key, user_key: userKey.key, api_token: agentApiToken.api_token, api_url: DDS_PORTAL_CONFIG.baseUrl}, null, 4)}
                    floatingLabelText="Agent Credentials"
                    id="keyText"
                    ref={(input) => this.keyText = input}
                    type="text"
                    multiLine={true}/>
            </form>
        </Dialog>;

        let agentList = agents.map((agent) => {
            if (agent.audit.created_by.id === currentUser.id) {
                return (
                    <li key={ agent.id } className="hover">
                        <FlatButton label="credentials" primary={true} style={styles.getKeyButton} onTouchTap={() => this.getCredentials(agent.id, userApiKey)}/>
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
                    { uploads || loading ? <Loaders {...this.props}/> : null }
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

    getCredentials(id, userKey) {
        agentStore.getAgentKey(id);
        authStore.getUserKey();
        setTimeout(() => {
            if (!userKey){
                authStore.createUserKey();
                authStore.getUserKey();
                setTimeout(() => {
                    if (!userKey){
                        authStore.createUserKey();
                        authStore.getUserKey();
                    }
                }, 800);
            }
            if(userKey) {
                mainStore.toggleModals('agentCred');
            } else {
                setTimeout(() => mainStore.toggleModals('agentCred'), 500);
            }
        }, 800);
    }

    copyApiKey() {
        this.keyText.select();
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        if(msg === 'successful') {
            mainStore.addToast('Credentials copied to clipboard!');
            mainStore.toggleModals('agentCred');
        }
        if(msg === 'unsuccessful'){
            mainStore.addToast('Failed copying credentials to clipboard!');
            alert("Automatic copying to clipboard is not supported by Safari browsers: Manually copy the key by" +
                " using CMD+C,");
        }
    };

    handleClose(id) {
        mainStore.toggleModals(id);
        agentStore.clearApiToken(); // Use this to make sure old api token doesn't show
    };
}

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
        width: '100%',
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

AgentList.contextTypes = {
    muiTheme: React.PropTypes.object
};

AgentList.propTypes = {
    loading: bool,
    agents: array,
    agentApiToken: object,
    agentKey: object,
    userKey: object,
    currentUser: object,
    entityObj: object,
    screenSize: object,
    toggleModal: object,
    uploads: object
};

export default AgentList;