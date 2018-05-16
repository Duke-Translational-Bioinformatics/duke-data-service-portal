import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import agentStore from '../../stores/agentStore';
import { Color } from '../../theme/customTheme';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
const { object } = PropTypes;

@observer
class AddAgentModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            floatingErrorText: ''
        }
    }

    render() {
        const { screenSize, toggleModal } = mainStore;
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
        return (
            <div>
                <RaisedButton
                    label="Add New Agent"
                    labelColor={Color.blue}
                    style={styles.addButton}
                    onTouchTap={() => this.toggleModal()} />
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={screenSize.width < 580 ? {width: '100%'} : {}}
                    title="Add New Software Agent"
                    autoDetectWindowHeight={true}
                    actions={actions}
                    open={toggleModal && toggleModal.id === 'addAgent' ? toggleModal.open : false}
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
        if (!this.state.floatingErrorText && this.agentNameText.getValue().trim().length) {
            let name = this.agentNameText.getValue();
            let desc = this.agentDescriptionText.getValue();
            let repo = this.agentRepoText.getValue();
            if (!/^https?:\/\//i.test(repo)) repo = 'https://' + repo;
            agentStore.addAgent(name, desc, repo);
            this.toggleModal();
        } else {
            this.setState({floatingErrorText: 'This field is required.'});
        }
    }

    toggleModal() {
        setTimeout(() => { this.agentNameText.select() }, 300);
        mainStore.toggleModals('addAgent')
    }

    validateText(e) {
        this.setState({floatingErrorText: e.target.value ? '' : 'This field is required.'});
    }
}

const styles = {
    addButton: {
        float: 'right',
        position: 'relative',
        margin: '0px 5px 0px 0px'
    },
    dialogStyles: {
        textAlign: 'center',
        fontColor: Color.dkBlue,
        zIndex: '9999'
    },
    textStyles: {
        textAlign: 'left',
        fontColor: Color.dkBlue,
    }
};

AddAgentModal.propTypes = {
    toggleModal: object,
    screenSize: object
};

export default AddAgentModal;

