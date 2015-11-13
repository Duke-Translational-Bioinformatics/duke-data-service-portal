import React from 'react';
import { Link } from 'react-router';
import ProjectActions from '../../actions/projectActions';

let mui = require('material-ui'),
    RaisedButton = mui.RaisedButton,
    TextField = mui.TextField,
    Snackbar = mui.Snackbar,
    Dialog = mui.Dialog;

class AddProjectModal extends React.Component {

    constructor() {
        this.state = {
            floatingErrorText: 'This field is required.',
            floatingErrorText2: 'This field is required'
        }
    }

    render() {

        let standardActions = [
            {text: 'Save', onTouchTap: this.handleProjectButton.bind(this)},
            {text: 'Cancel'}
        ];

        return (
            <div style={styles.addProject}>
                <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--colored"
                        style={styles.addProject}
                        onTouchTap={this.handleTouchTap.bind(this)}>
                    ADD PROJECT
                </button>
                <Dialog
                    style={styles.dialogStyles}
                    title="Add New Project"
                    actions={standardActions}
                    ref="addProject">
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
        this.refs.addProject.show();
    };

    handleProjectButton() {
        if (this.state.floatingErrorText || this.state.floatingErrorText2) {
            return null
        } else {
            ProjectActions.addProject(this.setState({
                floatingErrorText: 'This field is required.',
                floatingErrorText2: 'This field is required'
            }));
            this.refs.addProject.dismiss();
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
}

var styles = {
    addProject: {
        float: 'right',
        position: 'relative',
        margin: '12px 8px 0px 0px'
    },
    dialogStyles: {
        textAlign: 'center',
        fontColor: '#303F9F'
    },
    textStyles: {
        textAlign: 'left',
        fontColor: '#303F9F'
    }
};

AddProjectModal.contextTypes = {
    muiTheme: React.PropTypes.object
};

AddProjectModal.propTypes = {
    addProjectLoading: React.PropTypes.bool,
};

export default AddProjectModal;

