import React from 'react';
import ProjectActions from '../../actions/projectActions';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import Dialog from 'material-ui/lib/dialog';
import TextField from 'material-ui/lib/text-field';

class AddAgentModal extends React.Component {

    constructor() {
        this.state = {
            open: false,
            floatingErrorText: 'This field is required.'
        }
    }

    render() {

        const actions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={this.handleClose.bind(this)} />,
            <FlatButton
                label="Submit"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={this.handleAgentButton.bind(this)} />
        ];

        return (
            <div>
                <RaisedButton
                    label="Add New Agent"
                    labelColor="#235F9C"
                    style={styles.addButton}
                    onTouchTap={this.handleTouchTap.bind(this)} />
                <Dialog
                    style={styles.dialogStyles}
                    title="Add New Software Agent"
                    autoDetectWindowHeight={true}
                    autoScrollBodyContent={true}
                    actions={actions}
                    open={this.state.open}
                    onRequestClose={this.handleClose.bind(this)}>
                    <form action="#" id="newAgentForm">
                        <TextField
                            style={styles.textStyles}
                            hintText="Software Agent Name"
                            errorText={this.state.floatingErrorText}
                            floatingLabelText="Software Agent Name"
                            id="agentNameText"
                            type="text"
                            multiLine={true}
                            onChange={this.handleFloatingErrorInputChange.bind(this)}/> <br/>
                        <TextField
                            style={styles.textStyles}
                            hintText="Agent Description"
                            floatingLabelText="Software Agent Description"
                            id="agentDescriptionText"
                            type="text"
                            multiLine={true}
                            /> <br/>
                        <TextField
                            style={styles.textStyles}
                            hintText="Agent Repository URL"
                            floatingLabelText="Software Agent Repository URL"
                            id="agentRepoText"
                            type="text"
                            multiLine={true}
                            />
                    </form>
                </Dialog>
            </div>
        );
    }

    handleTouchTap() {
        this.setState({open: true});
    };

    handleAgentButton() {
        if (this.state.floatingErrorText) {
            return null
        }
        else {
            let name = document.getElementById('agentNameText').value;
            let desc = document.getElementById('agentDescriptionText').value;
            let repo = document.getElementById('agentRepoText').value;
            if (!/^https?:\/\//i.test(repo)) { //TODO: Make this regex more robust//////////////////
                repo = 'https://' + repo;
            }
            ProjectActions.addAgent(name, desc, repo);
            this.setState({
                open: false,
                floatingErrorText: 'This field is required.'
            });
        }
    };

    handleFloatingErrorInputChange(e) {
        this.setState({
            floatingErrorText: e.target.value ? '' : 'This field is required.'
        });
    };

    handleClose() {
        this.setState({open: false});
    };
}

var styles = {
    addButton: {
        float: 'right',
        position: 'relative',
        margin: '24px 5px 0px 0px'
    },
    dialogStyles: {
        textAlign: 'center',
        fontColor: '#303F9F',
        zIndex: '9999'
    },
    textStyles: {
        textAlign: 'left',
        fontColor: '#303F9F'
    }
};

AddAgentModal.contextTypes = {
    muiTheme: React.PropTypes.object
};

export default AddAgentModal;

