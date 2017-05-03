import React, { PropTypes } from 'react';
const { object } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import { Color } from '../../theme/customTheme';
import AddProjectMemberModal from '../projectComponents/addProjectMemberModal.jsx';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';

@observer
class ProjectOptionsMenu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            floatingErrorText: '',
            floatingErrorText2: '',
            floatingErrorText3: 'Enter the project name exactly to delete',
            value: null
        }
    }

    render() {
        const { project, screenSize, toggleModal } = mainStore;
        let dialogWidth = screenSize.width < 580 ? {width: '100%'} : {};
        let prName = project ? project.name : null;
        let desc = project ? project.description : null;
        let id = this.props.params.id;

        let deleteActions = [
            <FlatButton
                label="CANCEL"
                secondary={true}
                onTouchTap={() => this.toggleModal('deleteOpen')} />,
            <FlatButton
                label="DELETE"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.handleDeleteButton(id, prName)} />
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
                onTouchTap={() => this.handleUpdateButton(id)} />
        ];

        return (
            <div>
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={dialogWidth}
                    title="Are you sure you want to delete this project?"
                    autoDetectWindowHeight={true}
                    actions={deleteActions}
                    onRequestClose={() => this.toggleModal('deleteOpen')}
                    open={toggleModal && toggleModal.id === 'deleteOpen' ? toggleModal.open : false}>
                    <i className="material-icons" style={styles.warning}>warning</i>
                    <p style={styles.msg}>Deleting this project will also delete any folders or files contained inside of the project. As a fail-safe, you must enter the project name exactly in the form below before you can delete this project.</p>
                    <TextField
                        style={styles.textStyles}
                        errorText={this.state.floatingErrorText3}
                        floatingLabelText="Enter the project name exactly"
                        ref={(input) => this.projName = input}
                        type="text"
                        multiLine={true}
                        onChange={this.handleFloatingErrorInputChange3.bind(this)}/> <br/>
                </Dialog>
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={dialogWidth}
                    title="Edit Project Details"
                    autoDetectWindowHeight={true}
                    actions={editActions}
                    onRequestClose={() => this.toggleModal('editOpen')}
                    open={toggleModal && toggleModal.id === 'editOpen' ? toggleModal.open : false}>
                    <form action="#" id="newProjectForm">
                        <TextField
                            style={styles.textStyles}
                            hintText="Project Name"
                            defaultValue={prName}
                            errorText={this.state.floatingErrorText}
                            floatingLabelText="Project Name"
                            ref={(input) => this.projectNameText = input}
                            type="text"
                            multiLine={true}
                            onChange={this.handleFloatingErrorInputChange.bind(this)}/> <br/>
                        <TextField
                            style={styles.textStyles}
                            hintText="Project Description"
                            defaultValue={desc}
                            errorText={this.state.floatingErrorText2}
                            floatingLabelText="Project Description"
                            ref={(input) => this.projectDescriptionText = input}
                            type="text"
                            multiLine={true}
                            onChange={this.handleFloatingErrorInputChange2.bind(this)}
                            />
                    </form>
                </Dialog>
                <AddProjectMemberModal {...this.props}/>
                <IconMenu iconButtonElement={<IconButton iconClassName="material-icons" style={styles.openIcon}>more_vert</IconButton>}
                          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                          targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                    <MenuItem primaryText="Delete Project" leftIcon={<i className="material-icons">delete</i>} onTouchTap={() => this.toggleModal('deleteOpen')}/>
                    <MenuItem primaryText="Edit Project Details" leftIcon={<i className="material-icons">mode_edit</i>} onTouchTap={() => this.toggleModal('editOpen')}/>
                    <MenuItem primaryText="Add Project Member" leftIcon={<i className="material-icons">person_add</i>} onTouchTap={() => this.toggleModal('addMember')}/>
                </IconMenu>
            </div>
        );
    }

    handleDeleteButton(id, prName) {
        if(this.projName.getValue() != prName){
            this.setState({floatingErrorText3: 'Enter the project name exactly to delete'});
            return null
        }else{
            mainStore.deleteProject(id);
            this.toggleModal('deleteOpen');
            setTimeout(()=>this.props.router.push('/'),500)
        }
    }

    handleUpdateButton(id) {
        let name = this.projectNameText.getValue();
        let desc = this.projectDescriptionText.getValue();
        if (this.state.floatingErrorText != '' && this.state.floatingErrorText2 != '') {
            return null
        } else {
            mainStore.editProject(id, name, desc);
            this.toggleModal('editOpen');
        }
    };

    handleFloatingErrorInputChange(e) {
        this.setState({floatingErrorText: e.target.value ? '' : 'This field is required'});
    };

    handleFloatingErrorInputChange2(e) {
        this.setState({floatingErrorText2: e.target.value ? '' : 'This field is required'});
    };

    handleFloatingErrorInputChange3(e) {
        let prName = mainStore.project ? mainStore.project.name : null;
        this.setState({floatingErrorText3: e.target.value === prName ? '' : 'Enter the project name exactly to delete'});
    };

    toggleModal(id) {
        mainStore.toggleModals(id);
        if(id === 'editOpen') setTimeout(()=>this.projectNameText.select(), 300);
        if(id === 'deleteOpen') setTimeout(()=>this.projName.select(), 300);
        if(!this.state.floatingErrorText3.length) this.setState({floatingErrorText3: 'Enter the project name exactly to delete'});
        if(this.state.floatingErrorText.length) this.setState({floatingErrorText: ''});
        if(this.state.floatingErrorText2.length) this.setState({floatingErrorText2: ''});
    }
}

const styles = {
    addProject: {
        float: 'right',
        position: 'relative',
        margin: '12px 8px 0px 0px'
    },
    selectStyle: {
        textAlign: 'left'
    },
    dialogStyles: {
        textAlign: 'center',
        fontColor: Color.dkBlue,
        zIndex: '5000'
    },
    textStyles: {
        textAlign: 'left',
        fontColor: Color.dkBlue
    },
    msg: {
        textAlign: 'left',
        marginLeft: 30
    },
    openIcon: {
        margin: '-10px -12px 0px 0px'
    },
    warning: {
        fontSize: 48,
        textAlign: 'center',
        color: Color.red
    }
};

ProjectOptionsMenu.contextTypes = {
    muiTheme: object
};

ProjectOptionsMenu.propTypes = {
    screenSize: object,
    toggleModal: object
};

export default ProjectOptionsMenu;