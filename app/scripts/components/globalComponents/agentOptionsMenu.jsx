import React from 'react';
import MainActions from '../../actions/mainActions';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import TextField from 'material-ui/lib/text-field';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import IconButton from 'material-ui/lib/icon-button';

class AgentOptionsMenu extends React.Component {

    constructor() {
        this.state = {
            deleteOpen: false,
            deleteKeyWarn: false,
            disabled: false,
            editOpen: false,
            floatingErrorText: 'This field is required',
            floatingErrorText2: 'This field is required',
            floatingErrorText3: 'Enter the agent name exactly to delete',
            apiKeyOpen: false,
            newApiKeyOpen: false,
            userKeyOpen: false,
            newUserKeyOpen: false
        }
    }

    render() {
        let deleteActions = [
            <FlatButton
                label="CANCEL"
                secondary={true}
                onTouchTap={() => this.handleClose()} />,
            <FlatButton
                label="DELETE"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={this.handleDeleteButton.bind(this)} />
        ];

        let deleteKeyActions = [
            <FlatButton
                label="CANCEL"
                secondary={true}
                onTouchTap={() => this.handleClose()} />,
            <FlatButton
                label="DELETE"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={this.handleDeleteKeyButton.bind(this)} />
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
                onTouchTap={this.handleUpdateButton.bind(this)} />
        ];

        let keyActions = [
            <FlatButton
                label="CANCEL"
                secondary={true}
                onTouchTap={() => this.handleClose()} />,
            <FlatButton
                label="COPY KEY TO CLIPBOARD"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={this.handleCopyButton.bind(this)} />,
            <FlatButton
                label="CREATE NEW KEY"
                secondary={true}
                onTouchTap={this.handleApiButton.bind(this)} />
        ];

        let newKeyActions = [
            <FlatButton
                label="OKAY"
                secondary={true}
                onTouchTap={() => this.handleClose()} />,
            <FlatButton
                label="COPY KEY TO CLIPBOARD"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={this.handleCopyButton.bind(this)} />
        ];

        let userKeyActions = [
            <FlatButton
                label="CANCEL"
                secondary={true}
                onTouchTap={() => this.handleClose()} />,
            <FlatButton
                label="COPY KEY TO CLIPBOARD"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={this.handleCopyButton.bind(this)} />,
            <FlatButton
                label="CREATE NEW KEY"
                secondary={true}
                onTouchTap={this.handleUserKeyButton.bind(this)} />,
            <FlatButton
                label="DELETE USER KEY"
                hoverColor={'#FFCDD2'}
                labelStyle={{color: '#F44336'}}
                secondary={true}
                onTouchTap={this.handleDeleteKeyWarn.bind(this)} />
        ];

        if(this.props.userKey && this.props.userKey.error){
            userKeyActions = [
                <FlatButton
                    label="CANCEL"
                    secondary={true}
                    onTouchTap={() => this.handleClose()} />,
                <FlatButton
                    label="CREATE NEW KEY"
                    secondary={true}
                    keyboardFocused={true}
                    onTouchTap={this.handleUserKeyButton.bind(this)} />
            ];
        }

        let newUserKeyActions = [
            <FlatButton
                label="OKAY"
                secondary={true}
                onTouchTap={() => this.handleClose()} />,
            <FlatButton
                label="COPY KEY TO CLIPBOARD"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={this.handleCopyButton.bind(this)} />
        ];

        let names = this.props.users && this.props.users.length ? this.props.users : [];
        let apiKey = this.props.agentKey ? this.props.agentKey.key : null;
        let agName = this.props.entityObj ? this.props.entityObj.name : null;
        let desc = this.props.entityObj ? this.props.entityObj.description : null;
        let repoUrl = this.props.entityObj ? this.props.entityObj.repo_url : null;
        let userKey = this.props.userKey && this.props.userKey.key ? this.props.userKey.key : null;
        if(this.props.userKey && !this.props.userKey.key) {
            userKey = 'No user key found. You must create a new one.';
        }
        return (
            <div>
                <Dialog
                    style={styles.dialogStyles}
                    title="Are you sure you want to delete this software agent?"
                    autoScrollBodyContent={true}
                    actions={deleteActions}
                    onRequestClose={() => this.handleClose()}
                    open={this.state.deleteOpen}>
                    <i className="material-icons" style={styles.warning}>warning</i>
                    <p style={styles.msg}>Deleting this software agent will affect any programs or processes using this agent. As a failsafe, you must enter the agent name exactly in the form below before you can delete this agent.</p>
                    <TextField
                        style={styles.textStyles}
                        errorText={this.state.floatingErrorText3}
                        floatingLabelText="Enter the agent name exactly"
                        id="agName"
                        type="text"
                        multiLine={true}
                        onChange={this.handleFloatingErrorInputChange3.bind(this)}/> <br/>
                </Dialog>
                <Dialog
                    style={styles.dialogStyles}
                    title="Update Software Agent Details"
                    autoDetectWindowHeight={true}
                    autoScrollBodyContent={true}
                    actions={editActions}
                    onRequestClose={() => this.handleClose()}
                    open={this.state.editOpen}>
                    <form action="#" id="newAgentForm">
                        <TextField
                            style={styles.textStyles}
                            hintText="Software Agent Name"
                            defaultValue={agName}
                            errorText={this.state.floatingErrorText}
                            floatingLabelText="Software Agent Name"
                            id="agentNameText"
                            type="text"
                            multiLine={true}
                            onChange={this.handleFloatingErrorInputChange.bind(this)}/> <br/>
                        <TextField
                            style={styles.textStyles}
                            hintText="Software Agent Description"
                            defaultValue={desc}
                            floatingLabelText="Software Agent Description"
                            id="agentDescriptionText"
                            type="text"
                            multiLine={true}
                            /><br/>
                        <TextField
                            style={styles.textStyles}
                            hintText="Agent Repository URL"
                            defaultValue={repoUrl}
                            floatingLabelText="Software Agent Repository URL"
                            id="agentRepoText"
                            type="text"
                            multiLine={true}
                            />
                    </form>
                </Dialog>
                <Dialog
                    style={styles.dialogStyles}
                    title="API Key"
                    autoDetectWindowHeight={true}
                    autoScrollBodyContent={true}
                    actions={keyActions}
                    onRequestClose={() => this.handleClose()}
                    open={this.state.apiKeyOpen}>
                    <i className="material-icons" style={styles.warning}>vpn_key</i>
                    <h6 style={styles.msg}>This is your current API key. You can use the current key or create a new key. Changing this API key will affect any programs or processes using this key.</h6>
                    <form action="#" id="apiKeyForm">
                        <TextField
                            style={styles.keyModal}
                            defaultValue={apiKey}
                            floatingLabelText="Current Api Key"
                            id="keyText"
                            type="text"
                            multiLine={true}
                            /><br/>
                    </form>
                </Dialog>
                <Dialog
                    style={styles.dialogStyles}
                    title="Your New API Key"
                    autoDetectWindowHeight={true}
                    autoScrollBodyContent={true}
                    actions={newKeyActions}
                    onRequestClose={() => this.handleClose()}
                    open={this.state.newApiKeyOpen}>
                    <h6 style={{textAlign: 'center'}}>Here's your new API key. Your old key is no longer valid.</h6>
                    <form action="#" id="apiKeyForm">
                        <TextField
                            style={styles.keyModal}
                            defaultValue={apiKey}
                            floatingLabelText="Current Api Key"
                            id="keyText"
                            type="text"
                            multiLine={true}
                            /><br/>
                    </form>
                </Dialog>
                <Dialog
                    style={styles.dialogStyles}
                    title="User Secret Key"
                    autoDetectWindowHeight={true}
                    autoScrollBodyContent={true}
                    actions={userKeyActions}
                    onRequestClose={() => this.handleClose()}
                    open={this.state.userKeyOpen}>
                    <i className="material-icons" style={styles.warning}>vpn_key</i>
                    <h6 style={styles.msg}>This is your secret key. You can use the current key, create a new key or delete your key. Changing or deleting your user key will make your current key invalid.</h6>
                    <form action="#" id="userKeyForm">
                        <TextField
                            style={styles.keyModal}
                            disabled={this.props.userKey && !this.props.userKey.key ? true : false}
                            defaultValue={userKey}
                            floatingLabelText="Current User Key"
                            id="keyText"
                            type="text"
                            multiLine={true}
                            /><br/>
                    </form>
                </Dialog>
                <Dialog
                    style={styles.dialogStyles}
                    title="Your New User Key"
                    autoDetectWindowHeight={true}
                    autoScrollBodyContent={true}
                    actions={newKeyActions}
                    onRequestClose={() => this.handleClose()}
                    open={this.state.newUserKeyOpen}>
                    <h6 style={{textAlign: 'center'}}>Here's your new user key. Your old key is no longer valid.</h6>
                    <form action="#" id="userKeyForm">
                        <TextField
                            style={styles.keyModal}
                            defaultValue={userKey}
                            floatingLabelText="Current User Key"
                            id="keyText"
                            type="text"
                            multiLine={true}
                            /><br/>
                    </form>
                </Dialog>
                <Dialog
                    style={styles.dialogStyles}
                    title="Are you sure you want to delete this user key?"
                    autoScrollBodyContent={true}
                    actions={deleteKeyActions}
                    modal={true}
                    open={this.state.deleteKeyWarn}>
                    <i className="material-icons" style={styles.warning}>warning</i>
                </Dialog>
                <IconMenu iconButtonElement={<IconButton iconClassName="material-icons">more_vert</IconButton>}
                          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                          targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                    <MenuItem primaryText="Delete Agent" leftIcon={<i className="material-icons">delete</i>} onTouchTap={this.handleTouchTapDelete.bind(this)}/>
                    <MenuItem primaryText="Edit Agent Details" leftIcon={<i className="material-icons">mode_edit</i>} onTouchTap={this.handleTouchTapEdit.bind(this)}/>
                    <MenuItem primaryText="API Key" leftIcon={<i className="material-icons">vpn_key</i>} onTouchTap={this.handleTouchTapApiKey.bind(this)}/>
                    <MenuItem primaryText="User Key" leftIcon={<i className="material-icons">stars</i>} onTouchTap={this.handleTouchTapUserKey.bind(this)}/>
                </IconMenu>
            </div>
        );
    }

    handleTouchTapDelete() {
        this.setState({deleteOpen: true});
    }

    handleDeleteKeyWarn() {
        this.setState({
            deleteKeyWarn: true,
            userKeyOpen: false
        });
    }

    handleTouchTapEdit() {
        this.setState({editOpen: true});
    }

    handleTouchTapApiKey() {
        this.setState({apiKeyOpen: true});
        setTimeout(() => { document.getElementById('keyText').select() }, 300);
    }

    handleTouchTapUserKey() {
        this.setState({userKeyOpen: true});
        setTimeout(() => { document.getElementById('keyText').select() }, 300);
    }

    handleDeleteButton() {
        let id = this.props.params.id;
        let agName = this.props.entityObj ? this.props.entityObj.name : null;
        if(document.getElementById('agName').value != agName){
            this.setState({
                floatingErrorText3: 'Enter the software agent name exactly to delete'
            });
            return null
        }else{
            ProjectActions.deleteAgent(id);
            this.setState({deleteOpen: false});
            setTimeout(()=>this.props.appRouter.transitionTo('/agents'),300)
        }
    }

    handleDeleteKeyButton() {
        ProjectActions.deleteUserKey();
        this.setState({deleteKeyWarn: false});
    }

    handleUpdateButton() {
        let id = this.props.params.id;
        let name = document.getElementById('agentNameText').value;
        let desc = document.getElementById('agentDescriptionText').value;
        let repo = document.getElementById('agentRepoText').value;
        if (!/^https?:\/\//i.test(repo)) { //TODO: Make this regex more robust//////////////////
            repo = 'http://' + repo;
        }
        if (!document.getElementById('agentNameText').value) {
            return null
        } else {
            ProjectActions.editAgent(id, name, desc, repo);
            this.setState({
                editOpen: false,
                floatingErrorText: 'This field is required.'
            });
        }
    };

    handleApiButton() {
        let id = this.props.params.id;
        ProjectActions.createAgentKey(id);
        this.setState({
            apiKeyOpen: false
        });
        setTimeout(() => {
                this.setState({
                    newApiKeyOpen: true
                });
                document.getElementById('keyText').select() }, 500
        );
    };

    handleUserKeyButton() {
        ProjectActions.createUserKey();
        this.setState({
            userKeyOpen: false
        });
        setTimeout(() => {
                this.setState({
                    newUserKeyOpen: true
                });
                document.getElementById('keyText').select() }, 500
        );
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
        let agName = this.props.entityObj ? this.props.entityObj.name  : null;
        this.setState({
            floatingErrorText3: e.target.value === agName ? '' : 'Enter the agent name exactly to delete'
        });
    };

    handleCopyButton() {
        let copyTextArea = document.querySelector('#keyText');
        copyTextArea.select();
        let clipText = document.execCommand('copy');
        MainActions.addToast('Key copied to clipboard!');
        this.setState({
            apiKeyOpen: false,
            newApiKeyOpen: false,
            userKeyOpen: false,
            newUserKeyOpen: false
        });
    };

    handleClose() {
        this.setState({
            deleteOpen: false,
            editOpen: false,
            apiKeyOpen: false,
            newApiKeyOpen: false,
            userKeyOpen: false,
            newUserKeyOpen: false,
            deleteKeyWarn: false,
            floatingErrorText: 'This field is required.',
            floatingErrorText2: 'This field is required',
            floatingErrorText3: 'Enter the agent name exactly to delete'
        });
    };
}

var styles = {
    addProject: {
        float: 'right',
        position: 'relative',
        margin: '12px 8px 0px 0px'
    },
    keyModal: {
        width: 300,
        textAlign: 'left'
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
    warning: {
        fontSize: 48,
        textAlign: 'center',
        color: '#F44336'
    }
};

export default AgentOptionsMenu;