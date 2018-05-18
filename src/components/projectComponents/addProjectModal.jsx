import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import { Color } from '../../theme/customTheme';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
const { object } = PropTypes;

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
        const { addTeamAfterProjectCreation, screenSize } = mainStore;
        const actions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={this.handleClose.bind(this)} />,
            <FlatButton
                label="Create Project"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={this.handleProjectButton.bind(this)} />
        ];

        return (
            <div>
                <RaisedButton
                    label="Add Project"
                    labelColor={Color.blue}
                    style={styles.addProject}
                    onTouchTap={this.handleTouchTap.bind(this)} />
                <Dialog
                    style={styles.dialogStyles}
                    titleStyle={styles.dialogStyles.title}
                    contentStyle={screenSize.width < 580 ? {width: '100%'} : {}}
                    title="Add New Project"
                    autoDetectWindowHeight={true}
                    actions={actions}
                    open={this.state.open}
                    onRequestClose={this.handleClose.bind(this)}>
                    <div className="mdl-cell mdl-cell--6-col" style={styles.wrapper}>
                        <TextField
                            style={styles.textStyles}
                            fullWidth={true}
                            hintText="Project Name"
                            errorText={this.state.floatingErrorText}
                            floatingLabelText="Project Name"
                            ref={(input) => this.projectNameText = input}
                            type="text"
                            multiLine={true}
                            onChange={this.handleFloatingErrorInputChange.bind(this)}
                        /><br/>
                        <TextField
                            style={styles.textStyles}
                            fullWidth={true}
                            hintText="Project Description"
                            errorText={this.state.floatingErrorText2}
                            floatingLabelText="Project Description"
                            ref={(input) => this.projectDescriptionText = input}
                            type="text"
                            multiLine={true}
                            onChange={this.handleFloatingErrorInputChange2.bind(this)}
                        />
                        <Checkbox
                            label="Add Project Team Members"
                            style={styles.checkbox}
                            onCheck={() => this.addTeamMembersPrompt()}
                            checked={addTeamAfterProjectCreation}
                        />
                    </div>
                </Dialog>
            </div>
        );
    }

    addTeamMembersPrompt() {
        mainStore.addTeamMembersPrompt();
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

const styles = {
    addProject: {
        float: 'right'
    },
    checkbox: {
        marginTop: 20,
        marginLeft: -2
    },
    dialogStyles: {
        fontColor: Color.dkBlue,
        zIndex: '9999',
        title: {
            textAlign: 'center'
        }
    },
    textStyles: {
        textAlign: 'left',
        fontColor: Color.dkBlue
    },
    wrapper: {
        margin: '0 auto'
    }
};

AddProjectModal.propTypes = {
    screenSize: object
};

export default AddProjectModal;