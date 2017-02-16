import React from 'react';
import ProjectActions from '../../actions/projectActions';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

class AddAgentModal extends React.Component {

    constructor() {
        this.state = {
            open: false,
            floatingErrorText: ''
        }
    }

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={() => this.toggleModal()} />,
            <FlatButton
                label="Submit"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.addAgent()} />
        ];
        let modalWidth = this.props.screenSize.width < 580 ? {width: '100%'} : {};
        let open = this.props.toggleModal && this.props.toggleModal.id === 'addAgent' ? this.props.toggleModal.open : false;
        return (
            <div>
                <RaisedButton
                    label="Add New Agent"
                    labelColor="#235F9C"
                    style={styles.addButton}
                    onTouchTap={() => this.toggleModal()} />
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={modalWidth}
                    title="Add New Software Agent"
                    autoDetectWindowHeight={true}
                    actions={actions}
                    open={open}
                    onRequestClose={() => this.toggleModal()}>
                    <form action="#" id="newAgentForm">
                        <TextField
                            style={styles.textStyles}
                            hintText="Software Agent Name"
                            errorText={this.state.floatingErrorText}
                            floatingLabelText="Software Agent Name"
                            autoFocus={true}
                            ref={(input)=>this.agentNameText = input}
                            type="text"
                            multiLine={true}
                            onChange={(e) => this.validateText(e)}/> <br/>
                        <TextField
                            style={styles.textStyles}
                            hintText="Agent Description"
                            floatingLabelText="Software Agent Description"
                            ref={(input)=>this.agentDescriptionText = input}
                            type="text"
                            multiLine={true}
                            /> <br/>
                        <TextField
                            style={styles.textStyles}
                            hintText="Agent Repository URL"
                            floatingLabelText="Software Agent Repository URL"
                            ref={(input)=>this.agentRepoText = input}
                            type="text"
                            multiLine={true}
                            />
                    </form>
                </Dialog>
            </div>
        );
    }

    addAgent() {
        if (this.state.floatingErrorText) {
            return null
        }
        else {
            let name = this.agentNameText.getValue();
            let desc = this.agentDescriptionText.getValue();
            let repo = this.agentRepoText.getValue();
            if (!/^https?:\/\//i.test(repo)) repo = 'https://' + repo;
            ProjectActions.addAgent(name, desc, repo);
            this.toggleModal();
        }
    }

    toggleModal() {
        setTimeout(() => { this.agentNameText.select() }, 300);
        ProjectActions.toggleModals('addAgent')
    }

    validateText(e) {
        this.setState({floatingErrorText: e.target.value ? '' : 'This field is required.'});
    }
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

AddAgentModal.propTypes = {
    toggleModal: React.PropTypes.object,
    screenSize: React.PropTypes.object
};

export default AddAgentModal;

