import React, { PropTypes } from 'react';
const { object, array } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import agentStore from '../../stores/agentStore';
import authStore from '../../stores/authStore';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';

@observer
class AgentOptionsMenu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            floatingErrorText: '',
            floatingErrorText2: 'Enter the agent name exactly to delete'
        }
    }

    render() {
        const { agentApiToken, agentKey } = agentStore;
        const { userKey } = authStore;
        const { entityObj, screenSize, toggleModal } = mainStore;

        let apiToken = agentApiToken ? agentApiToken.api_token : null;
        let dialogWidth = screenSize.width < 580 ? {width: '100%'} : {};
        let msg = Object.keys(agentApiToken).length === 0 ?
            <span style={styles.apiMsg}>You must have a valid user key, please create one by selecting 'USER SECRET KEY' in the drop down menu.</span> :
            <span style={styles.apiMsg2}>This API token will expire in 2 hours.</span>;
        let agKey = agentKey ? agentKey.key : null;
        let agentName = entityObj ? entityObj.name : null;
        let desc = entityObj ? entityObj.description : null;
        let repoUrl = entityObj ? entityObj.repo_url : null;

        let deleteActions = [
            <FlatButton
                label="CANCEL"
                secondary={true}
                onTouchTap={() => this.toggleModal('deleteOpen')} />,
            <FlatButton
                label="DELETE"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.handleDeleteButton(agentName)} />
        ];

        let deleteKeyActions = [
            <FlatButton
                label="CANCEL"
                secondary={true}
                onTouchTap={() => this.toggleModal('deleteKeyWarn')} />,
            <FlatButton
                label="DELETE"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.handleDeleteKeyButton()} />
        ];

        let editActions = [
            <FlatButton
                label="CANCEL"
                secondary={true}
                onTouchTap={() => this.toggleModal('editOpen')} />,
            <FlatButton
                label="UPDATE"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.handleUpdateButton()} />
        ];

        let keyActions = [
            <FlatButton
                label="CANCEL"
                secondary={true}
                onTouchTap={() => this.toggleModal('apiKey')} />,
            <FlatButton
                label="COPY KEY TO CLIPBOARD"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.handleCopyButton('apiKey')} />,
            <FlatButton
                label="CREATE NEW KEY"
                secondary={true}
                onTouchTap={() => this.handleApiButton()} />
        ];

        let newUserKeyActions = [
            <FlatButton
                label="OKAY"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.toggleModal('newUserKey')} />,
            <FlatButton
                label="COPY KEY TO CLIPBOARD"
                secondary={true}
                onTouchTap={() => this.handleCopyButton('newUserKey')} />
        ];

        let newApiTokenActions = [
            <FlatButton
                label="OKAY"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.toggleModal('apiToken')} />,
            <FlatButton
                label="COPY KEY TO CLIPBOARD"
                secondary={true}
                onTouchTap={() => this.handleCopyButton('apiToken')} />
        ];

        let newKeyActions = [
            <FlatButton
                label="OKAY"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.toggleModal('newApiKeyOpen')} />,
            <FlatButton
                label="COPY KEY TO CLIPBOARD"
                secondary={true}
                onTouchTap={() => this.handleCopyButton('newApiKeyOpen')} />
        ];

        let userKeyActions = [
            <FlatButton
                label="CANCEL"
                secondary={true}
                onTouchTap={() => this.toggleModal('userKey')} />,
            <FlatButton
                label="COPY KEY TO CLIPBOARD"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.handleCopyButton('userKey')} />,
            <FlatButton
                label="CREATE NEW KEY"
                secondary={true}
                onTouchTap={() => this.handleUserKeyButton()} />,
            <FlatButton
                label="DELETE USER KEY"
                hoverColor={'#FFCDD2'}
                labelStyle={{color: '#F44336'}}
                secondary={true}
                onTouchTap={() => this.handleDeleteKeyWarn()} />
        ];

        if(userKey && userKey.error){
            userKeyActions = [
                <FlatButton
                    label="CANCEL"
                    secondary={true}
                    onTouchTap={() => this.toggleModal('userKey')} />,
                <FlatButton
                    label="CREATE NEW KEY"
                    secondary={true}
                    keyboardFocused={true}
                    onTouchTap={() => this.handleUserKeyButton()} />
            ];
        }

        return (
            <div>
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={dialogWidth}
                    title="Are you sure you want to delete this software agent?"
                    autoDetectWindowHeight={true}
                    actions={deleteActions}
                    onRequestClose={() => this.toggleModal('deleteOpen')}
                    open={toggleModal && toggleModal.id === 'deleteOpen' ? toggleModal.open : false}>
                    <i className="material-icons" style={styles.warning}>warning</i>
                    <p style={styles.msg}>Deleting this software agent will affect any programs or processes using this agent. As a failsafe, you must enter the agent name exactly in the form below before you can delete this agent.</p>
                    <TextField
                        autoFocus={true}
                        style={styles.textStyles}
                        errorText={this.state.floatingErrorText2}
                        floatingLabelText="Enter the agent name exactly"
                        ref={(input) => this.agentName = input}
                        type="text"
                        multiLine={true}
                        onChange={(e) => this.validateText2(e)}/> <br/>
                </Dialog>
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={dialogWidth}
                    title="Update Software Agent Details"
                    autoDetectWindowHeight={true}
                    actions={editActions}
                    onRequestClose={() => this.toggleModal('editOpen')}
                    open={toggleModal && toggleModal.id === 'editOpen' ? toggleModal.open : false}>
                    <form action="#" id="newAgentForm">
                        <TextField
                            style={styles.textStyles}
                            autoFocus={true}
                            hintText="Software Agent Name"
                            defaultValue={agentName}
                            errorText={this.state.floatingErrorText}
                            floatingLabelText="Software Agent Name"
                            ref={(input) => this.agentNameText = input}
                            onFocus={() => this.selectText()}
                            type="text"
                            multiLine={true}
                            onChange={(e) => this.validateText(e)}/> <br/>
                        <TextField
                            style={styles.textStyles}
                            hintText="Software Agent Description"
                            defaultValue={entityObj ? entityObj.description : null}
                            floatingLabelText="Software Agent Description"
                            ref={(input) => this.agentDescriptionText = input}
                            type="text"
                            multiLine={true}
                            /><br/>
                        <TextField
                            style={styles.textStyles}
                            hintText="Agent Repository URL"
                            defaultValue={entityObj ? entityObj.repo_url : null}
                            floatingLabelText="Software Agent Repository URL"
                            ref={(input) => this.agentRepoText = input}
                            type="text"
                            multiLine={true}
                            />
                    </form>
                </Dialog>
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={dialogWidth}
                    title="Agent Secret Key"
                    autoDetectWindowHeight={true}
                    actions={keyActions}
                    onRequestClose={() => this.toggleModal('apiKey')}
                    open={toggleModal && toggleModal.id === 'apiKey' ? toggleModal.open : false}>
                    <i className="material-icons" style={styles.warning}>vpn_key</i>
                    <h6 style={styles.msg}>This is your current agent secret key. You can use the current key or create a new key. Changing this key will affect any programs or processes using this key.</h6>
                    <form action="#" id="apiKeyForm">
                        <TextField
                            textareaStyle={styles.textArea}
                            style={styles.keyModal}
                            defaultValue={agentKey ? agentKey.key : null}
                            floatingLabelText="Current Agent Secret Key"
                            id="apiKey"
                            ref={(input) => this.apiKeyText = input}
                            type="text"
                            multiLine={true}
                            /><br/>
                    </form>
                </Dialog>
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={dialogWidth}
                    title="Your New Agent Secret Key"
                    autoDetectWindowHeight={true}
                    actions={newKeyActions}
                    onRequestClose={() => this.toggleModal()}
                    open={toggleModal && toggleModal.id === 'newApiKeyOpen' ? toggleModal.open : false}>
                    <h6 style={styles.dialogHeading}>Here's your new agent secret key. Your old key is no longer valid.</h6>
                    <form action="#" id="apiKeyForm">
                        <TextField
                            textareaStyle={styles.textArea}
                            style={styles.keyModal}
                            defaultValue={agentKey ? agentKey.key : null}
                            floatingLabelText="New Agent Secret Key"
                            id="newApiKeyOpen"
                            ref={(input) => this.secretKeyText = input}
                            type="text"
                            multiLine={true}
                            /><br/>
                    </form>
                </Dialog>
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={dialogWidth}
                    title="User Secret Key"
                    autoDetectWindowHeight={true}
                    actions={userKeyActions}
                    onRequestClose={() => this.toggleModal('userKey')}
                    open={toggleModal && toggleModal.id === 'userKey' ? toggleModal.open : false}>
                    <i className="material-icons" style={styles.warning}>vpn_key</i>
                    <h6 style={styles.msg}>This is your secret key. You can use the current key, create a new key or delete your key. Changing or deleting your user key will make your current key invalid.</h6>
                    <form action="#" id="userKeyForm">
                        <TextField
                            textareaStyle={styles.textArea}
                            style={styles.keyModal}
                            disabled={!!(userKey && !userKey.key)}
                            defaultValue={userKey.key}
                            floatingLabelText="Current User Secret Key"
                            id="userKey"
                            ref={(input) => this.currentUserKeyText = input}
                            type="text"
                            multiLine={true}
                            /><br/>
                    </form>
                </Dialog>
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={dialogWidth}
                    title="Your New User Key"
                    autoDetectWindowHeight={true}
                    actions={newUserKeyActions}
                    onRequestClose={() => this.toggleModal('newUserKey')}
                    open={toggleModal && toggleModal.id === 'newUserKey' ? toggleModal.open : false}>
                    <h6 style={styles.dialogHeading}>Here's your new user key. Your old key is no longer valid.</h6>
                    <form action="#" id="userKeyForm">
                        <TextField
                            textareaStyle={styles.textArea}
                            style={styles.keyModal}
                            defaultValue={userKey.key}
                            floatingLabelText="Current User Key"
                            id="newUserKey"
                            ref={(input) => this.newUserKeyText = input}
                            type="text"
                            multiLine={true}
                            /><br/>
                    </form>
                </Dialog>
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={dialogWidth}
                    title="Your API Token"
                    autoDetectWindowHeight={true}
                    actions={newApiTokenActions}
                    onRequestClose={() => this.toggleModal('agentCred')}
                    open={toggleModal && toggleModal.id === 'agentCred' ? toggleModal.open : false}>
                    <h6 style={styles.dialogHeading}>{ msg }</h6>
                    <form action="#" id="apiTokenForm">
                        <TextField
                            textareaStyle={styles.textArea}
                            style={styles.keyModal}
                            defaultValue={agentApiToken ? agentApiToken.api_token : null}
                            floatingLabelText="API Token"
                            id="apiToken"
                            ref={(input) => this.apiTokenText = input}
                            type="text"
                            multiLine={true}
                            /><br/>
                    </form>
                </Dialog>
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={dialogWidth}
                    title="Are you sure you want to delete this user key?"
                    actions={deleteKeyActions}
                    modal={true}
                    open={toggleModal && toggleModal.id === 'deleteKeyWarn' ? toggleModal.open : false}>
                    <i className="material-icons" style={styles.warning}>warning</i>
                </Dialog>
                <IconMenu iconButtonElement={<IconButton iconClassName="material-icons">more_vert</IconButton>}
                          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                          targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                    <MenuItem primaryText="Edit Agent Details" leftIcon={<i className="material-icons">mode_edit</i>} onTouchTap={() => this.toggleModal('editOpen')}/>
                    <MenuItem primaryText="Delete Agent" leftIcon={<i className="material-icons">delete</i>} onTouchTap={() => this.toggleModal('deleteOpen')}/>
                    <Divider/>
                    <MenuItem primaryText="Agent Secret Key" leftIcon={<i className="material-icons">vpn_key</i>} onTouchTap={() => this.openApiKeyModal()}/>
                    <MenuItem primaryText="User Secret Key" leftIcon={<i className="material-icons">vpn_key</i>} onTouchTap={() => this.handleTouchTapUserKey()}/>
                    <MenuItem primaryText="API Token" leftIcon={<i className="material-icons">stars</i>} onTouchTap={() => this.handleTouchTapApiToken()}/>
                </IconMenu>
            </div>
        );
    }

    toggleModal(id) {
        mainStore.toggleModals(id);
    }

    handleDeleteKeyWarn() {
        this.toggleModal('userKey');
        this.toggleModal('deleteKeyWarn');
    }

    openApiKeyModal() {
        mainStore.toggleModals('apiKey');
        setTimeout(() => this.apiKeyText.select(), 300);
    }

    handleTouchTapApiToken() {
        let id = this.props.params.id;
        if (!agentStore.agentApiToken.api_token){
            agentStore.getAgentApiToken(id);
        } else {
            mainStore.toggleModals('agentCred');
        }
    }

    handleTouchTapUserKey() {
        this.toggleModal('userKey');
        setTimeout(() => this.currentUserKeyText.select(), 300);
    }

    handleDeleteButton(agentName) {
        let id = this.props.params.id;
        if(this.agentName.getValue() != agentName){
            this.setState({floatingErrorText2: 'Enter the software agent name exactly to delete'});
            return null
        } else {
            agentStore.deleteAgent(id);
            this.toggleModal('deleteOpen');
            setTimeout(()=>this.props.router.push('/agents'),300)
        }
    }

    handleDeleteKeyButton() {
        authStore.deleteUserKey();
        this.toggleModal('deleteKeyWarn');
    }

    handleUpdateButton() {
        let id = this.props.params.id;
        let name = this.agentNameText.getValue();
        let desc = this.agentDescriptionText.getValue();
        let repo = this.agentRepoText.getValue();
        if (!/^https?:\/\//i.test(repo)) {
            repo = repo !== '' ? 'http://' + repo : null;
        }
        if (!this.agentNameText.getValue()) {
            return null
        } else {
            agentStore.editAgent(id, name, desc, repo);
            this.toggleModal('editOpen');
        }
    }

    handleApiButton() {
        let id = this.props.params.id;
        agentStore.createAgentKey(id);
        this.toggleModal('apiKeyOpen');
        setTimeout(() => {
            this.toggleModal('newApiKeyOpen');
            this.secretKeyText.select() }, 700
        );
    }

    handleUserKeyButton() {
        authStore.createUserKey();
        this.toggleModal('userKey');
        setTimeout(() => {
            this.toggleModal('newUserKey');
            this.newUserKeyText.select() }, 800
        );
    }

    handleCopyButton(id) {
        let copyTextArea = document.querySelector('#'+id);
        copyTextArea.select();
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        if(msg === 'successful') {
            mainStore.addToast('Key copied to clipboard!');
            this.toggleModal(id)
        }
        if(msg === 'unsuccessful'){
            mainStore.addToast('Failed copying key to clipboard!');
            alert("Automatic copying to clipboard is not supported by Safari browsers: Manually copy the key by" +
                " using CMD+C,");
        }
    }

    selectText() {
        setTimeout(()=>this.agentNameText.select(),200)
    }

    validateText(e) {
        this.setState({
            floatingErrorText: e.target.value ? '' : 'This field is required'
        });
    }

    validateText2(e) {
        let agentName = mainStore.entityObj ? mainStore.entityObj.name  : null;
        this.setState({
            floatingErrorText2: e.target.value === agentName ? '' : 'Enter the agent name exactly to delete'
        });
    }
}

const styles = {
    apiMsg: {
        textAlign: 'center',
        color: '#F44336'
    },
    apiMsg2: {
        textAlign: 'center'
    },
    keyModal: {
        width: 300,
        textAlign: 'left',
        fontFamily: 'monospace'
    },
    dialogHeading: {
        textAlign: 'center'
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
    textArea: {
        color: '#F44336'
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

AgentOptionsMenu.contextTypes = {
    muiTheme: object
};

AgentOptionsMenu.propTypes = {
    agents: array,
    agentApiToken: object,
    agentKey: object,
    userKey: object,
    currentUser: object,
    entityObj: object,
    screenSize: object,
    toggleModal: object
};

export default AgentOptionsMenu;