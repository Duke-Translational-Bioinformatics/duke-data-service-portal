import React, { PropTypes } from 'react';
const { object } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

@observer
class AddProjectModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            floatingErrorText: 'This field is required',
            floatingErrorText2: 'This field is required'
        }
    }

    render() {
        const { screenSize } = mainStore;
        const actions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={this.handleClose.bind(this)} />,
            <FlatButton
                label="Submit"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={this.handleProjectButton.bind(this)} />
        ];

        return (
            <div>
                <RaisedButton
                    label="Add Project"
                    labelColor="#235F9C"
                    style={styles.addProject}
                    onTouchTap={this.handleTouchTap.bind(this)} />
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={screenSize.width < 580 ? {width: '100%'} : {}}
                    title="Add New Project"
                    autoDetectWindowHeight={true}
                    actions={actions}
                    open={this.state.open}
                    onRequestClose={this.handleClose.bind(this)}>
                    <form action="#" id="newProjectForm">
                        <TextField
                            style={styles.textStyles}
                            hintText="Project Name"
                            errorText={this.state.floatingErrorText}
                            floatingLabelText="Project Name"
                            ref={(input) => this.projectNameText = input}
                            type="text"
                            multiLine={true}
                            onChange={this.handleFloatingErrorInputChange.bind(this)}/> <br/>
                        <TextField
                            style={styles.textStyles}
                            hintText="Project Description"
                            errorText={this.state.floatingErrorText2}
                            floatingLabelText="Project Description"
                            ref={(input) => this.projectDescriptionText = input}
                            type="text"
                            multiLine={true}
                            onChange={this.handleFloatingErrorInputChange2.bind(this)}
                            />
                    </form>
                </Dialog>
            </div>
        );
    }

    handleTouchTap() {
        this.setState({open: true});
        setTimeout(() => { this.projectNameText.select() }, 300);
    };

    handleProjectButton() {
        if (this.state.floatingErrorText || this.state.floatingErrorText2) {
            return null
        } else {
            let name = this.projectNameText.getValue();
            let desc = this.projectDescriptionText.getValue();
            mainStore.addProject(name, desc);
            this.setState({
                open: false,
                floatingErrorText: 'This field is required.',
                floatingErrorText2: 'This field is required'
            });
        }
    };

    handleFloatingErrorInputChange(e) {
        this.setState({
            floatingErrorText: e.target.value ? '' : 'This field is required.'
        });
    };

    handleFloatingErrorInputChange2(e) {
        this.setState({
            floatingErrorText2: e.target.value ? '' : 'This field is required.'
        });
    };

    handleClose() {
        this.setState({open: false});
    };
}

var styles = {
    addProject: {
        float: 'right',
        position: 'relative',
        margin: '12px -9px 0px 0px'
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

AddProjectModal.contextTypes = {
    muiTheme: object
};

AddProjectModal.propTypes = {
    screenSize: object
};

export default AddProjectModal;