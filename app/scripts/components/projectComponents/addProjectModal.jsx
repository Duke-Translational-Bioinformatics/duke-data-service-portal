import React from 'react';
import ProjectActions from '../../actions/projectActions';
import FlatButton from 'material-ui/lib/flat-button';
import Dialog from 'material-ui/lib/dialog';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';

class AddProjectModal extends React.Component {

    constructor() {
        this.state = {
            open: false,
            floatingErrorText: 'This field is required.',
            floatingErrorText2: 'This field is required'
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
                    title="Add New Project"
                    autoDetectWindowHeight={true}
                    autoScrollBodyContent={true}
                    actions={actions}
                    open={this.state.open}
                    onRequestClose={this.handleClose.bind(this)}>
                    <form action="#" id="newProjectForm">
                        <TextField
                            style={styles.textStyles}
                            hintText="Project Name"
                            errorText={this.state.floatingErrorText}
                            floatingLabelText="Project Name"
                            id="projectNameText"
                            type="text"
                            multiLine={true}
                            onChange={this.handleFloatingErrorInputChange.bind(this)}/> <br/>
                        <TextField
                            style={styles.textStyles}
                            hintText="Project Description"
                            errorText={this.state.floatingErrorText2}
                            floatingLabelText="Project Description"
                            id="projectDescriptionText"
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
        setTimeout(() => { document.getElementById('projectNameText').select() }, 300);
    };

    handleProjectButton() {
        if (this.state.floatingErrorText || this.state.floatingErrorText2) {
            return null
        } else {
            let name = document.getElementById('projectNameText').value;
            let desc = document.getElementById('projectDescriptionText').value;
            ProjectActions.addProject(name, desc);
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
    muiTheme: React.PropTypes.object
};

export default AddProjectModal;