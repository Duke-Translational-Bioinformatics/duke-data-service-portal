import React from 'react';
import { RouteHandler, Link } from 'react-router';
import MainActions from '../../actions/mainActions';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import AddAgentModal from '../../components/globalComponents/addAgentModal.jsx';
import BatchOps from '../../components/globalComponents/batchOps.jsx';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import ErrorModal from '../../components/globalComponents/errorModal.jsx';
import Header from '../../components/globalComponents/header.jsx';
import Loaders from '../../components/globalComponents/loaders.jsx';
import urlGen from '../../../util/urlGen.js';
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';

class AgentList extends React.Component {

    render() {
        let agents = [];
        let agentKey = this.props.agentKey ? this.props.agentKey.key : null;
        let userKey = this.props.userKey ? this.props.userKey.key : null;
        let apiToken = this.props.agentApiToken ? this.props.agentApiToken.api_token : null;
        let obj = {agent_key: agentKey, user_key: userKey, api_token: apiToken};
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
            contentStyle={styles.dialogPosition}
            autoDetectWindowHeight={true}
            autoScrollBodyContent={true}
            actions={keyActions}
            onRequestClose={() => this.handleClose()}
            open={open}>
            { msg }
            <form action="#" id="apiKeyForm" className="keyText">
                <TextField
                    style={styles.keyModal}
                    defaultValue={JSON.stringify(obj, null, 4)}
                    floatingLabelText="Agent Credentials"
                    id="keyText"
                    type="text"
                    multiLine={true}
                    />
            </form>
        </Dialog>;

        if (this.props.error && this.props.error.response) {
            this.props.error.response === 404 ? this.props.appRouter.transitionTo('/notFound') : null;
            this.props.error.response != 404 ? console.log(this.props.error.msg) : null;
        }

        agents = this.props.agents;

        let agentList = agents.map((agent) => {
            if (agent.audit.created_by.id === this.props.currentUser.id) {
                return (
                    <li key={ agent.id } className="hover">
                        <FlatButton label="credentials" primary={true} style={styles.getKeyButton} onTouchTap={() => this.handleTouchTapApiKey(agent.id)}/>
                        <a href={urlGen.routes.agent(agent.id)} className="item-content external">
                            <div className="item-media">
                                <i className="material-icons" style={styles.icon}>laptop_mac</i>
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
            <div className="list-container">
                {modal}
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.list}>
                    <div style={styles.headerTitle}>
                        <h4>Software Agents</h4>
                    </div>
                    <div className="mdl-cell mdl-cell--12-col">
                        <AddAgentModal {...this.props}/>
                    </div>
                    <ErrorModal {...this.props}/>
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

    handleTouchTapApiKey(id) {
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
        document.getElementById('keyText').select();
        let clipText = document.execCommand('copy');
        MainActions.addToast('Credentials copied to clipboard!');
        ProjectActions.closeModal();
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
    checkBox: {
        width: 16,
        height: 16,
        marginBottom: 21
    },
    checkboxLabel: {
        borderRadius: 35,
        paddingRight: 20
    },
    dialogStyles: {
        textAlign: 'center',
        fontColor: '#303F9F',
        zIndex: '5000'
    },
    dialogPosition: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
    },
    dlIcon: {
        float: 'right',
        fontSize: 18,
        color: '#EC407A',
        marginTop: 6,
        marginLeft: 15,
        padding: '08px 08px 08px 08px',
        zIndex: 100
    },
    fillerDiv: {
        height: 24,
        width: 32,
        float: 'right',
        marginLeft: 32,
        padding: '08px 08px 08px 08px'
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
        fontSize: 36
    },
    keyModal: {
        width: 300,
        textAlign: 'left',
        fontFamily: 'monospace',
        fontSize: '1em'
    },
    list: {
        float: 'right',
        marginTop: -10
    },
    loaders: {
        paddingTop: 40
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