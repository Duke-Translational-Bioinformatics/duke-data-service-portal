import React from 'react';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

class AddFolderModal extends React.Component {

    constructor() {
        this.state = {
            floatingErrorText: ''
        }
    }

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={()=>this.closeModal()}/>,
            <FlatButton
                label="Submit"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={()=>this.addFolder()}/>
        ];
        let open = this.props.toggleModal && this.props.toggleModal.id === 'addFolder' ? this.props.toggleModal.open : false;
        return (
            <div>
                <RaisedButton
                    label="Add Folder"
                    labelStyle={{color: '#235F9C'}}
                    style={styles.addFolder}
                    onTouchTap={()=>this.openModal()}/>
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={this.props.screenSize.width < 580 ? {width: '100%'} : {}}
                    title="Add New Folder"
                    autoDetectWindowHeight={true}
                    actions={actions}
                    open={open}
                    onRequestClose={()=>this.closeModal()}>
                    <form action="#" id="newFolderForm">
                        <TextField
                            style={styles.textStyles}
                            hintText="Folder Name"
                            errorText={this.state.floatingErrorText}
                            floatingLabelText="Folder Name"
                            ref={(input) => this.folderNameText = input}
                            type="text"
                            multiLine={true}
                            onChange={(e)=>this.validateText(e)}/> <br/>
                    </form>
                </Dialog>
            </div>
        );
    }

    openModal() {
        ProjectActions.toggleModals('addFolder');
        setTimeout(()=>this.folderNameText.select(), 100);
    }

    addFolder() {
        let id = this.props.params.id;
        let name = this.folderNameText.getValue();
        let parentKind = !this.props.entityObj ? 'dds-project' : 'dds-folder';
        if (this.state.floatingErrorText) {
            return null
        } else {
            ProjectActions.addFolder(id, parentKind, name);
            this.closeModal();
        }
    }

    closeModal() {
        ProjectActions.toggleModals('addFolder');
    }

    validateText(e) {
        this.setState({floatingErrorText: e.target.value ? '' : 'This field is required.'});
    }
}

let styles = {
    addFolder: {
        float: 'right',
        zIndex: '50',
        position: 'relative',
        margin: '20px 10px 0px  18px',
        textColor: '#235F9C'
    },
    dialogStyles: {
        textAlign: 'center',
        fontColor: '#303F9F',
        zIndex: '9996'
    },
    textStyles: {
        textAlign: 'left',
        fontColor: '#303F9F'
    }
};

AddFolderModal.contextTypes = {
    muiTheme: React.PropTypes.object
};

AddFolderModal.propTypes = {
    toggleModal: React.PropTypes.object
};

export default AddFolderModal;