import React, { PropTypes } from 'react';
const { object, bool } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import agentStore from '../../stores/agentStore';
import authStore from '../../stores/authStore';
import AddAgentModal from '../../components/globalComponents/addAgentModal.jsx';
import ListItems from "./listItems.jsx";
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import TextField from 'material-ui/TextField';

@observer
class AgentList extends React.Component {

    render() {
        const { agentApiToken, agentKey } = agentStore;
        const { userKey } = authStore;
        const { loading, screenSize, toggleModal } = mainStore;
        let dialogStyle= screenSize.width < 580 ? {width: '100%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'} : {position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'};
        let msg = Object.keys(agentApiToken).length > 0 ?
            <h6 style={styles.apiMsg2}>The API token included with these credentials will expire in 2 hours.</h6> :
            <h6 style={styles.apiMsg}>You must have a valid user key, please create one by selecting 'USER SECRET KEY' in the drop down menu.</h6>;

        let keyActions = [
            <FlatButton
                label="CANCEL"
                secondary={true}
                onTouchTap={() => this.handleClose('agentCred')} />,
            <FlatButton
                label="COPY CREDENTIALS TO CLIPBOARD"
                secondary={true}
                keyboardFocused={true}
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
            {!loading ? <TextField
                textareaStyle={styles.textArea}
                style={styles.keyModal}
                defaultValue={JSON.stringify({agent_key: agentKey.key, user_key: userKey.key, api_token: agentApiToken.api_token, api_url: DDS_PORTAL_CONFIG.baseUrl}, null, 4)}
                floatingLabelText="Agent Credentials"
                id="keyText"
                ref={(input) => this.keyText = input}
                type="text"
                multiLine={true}/> : <CircularProgress size={60} thickness={7}/>}
        </Dialog>;

        return (
            <div className="list-container" >
                {modal}
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.headerWrapper}>
                    <h4 style={styles.headerTitle}>Software Agents</h4>
                    <AddAgentModal {...this.props}/>
                </div>
                <ListItems {...this.props}/>
            </div>
        );
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

const styles = {
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
        margin: 0
    },
    headerWrapper: {
        float: 'right',
        padding: '0px 14px 0px 14px'
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
    agentApiToken: object,
    agentKey: object,
    userKey: object,
    screenSize: object,
    toggleModal: object,
};

export default AgentList;