import React, { PropTypes } from 'react';
const { object, bool, array, string } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import { Kind } from '../../util/urlEnum';

@observer
class AddFolderModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            floatingErrorText: ''
        }
    }

    render() {
        const { screenSize, toggleModal } = mainStore;
        let dialogWidth = screenSize.width < 580 ? {width: '100%'} : {};
        let open = toggleModal && toggleModal.id === 'addFolder' ? toggleModal.open : false;

        const actions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={()=>this.closeModal()}/>,
            <FlatButton
                label="Create Folder"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={()=>this.addFolder()}/>
        ];

        return (
            <div>
                <RaisedButton
                    label="New Folder"
                    labelStyle={{color: '#235F9C'}}
                    style={styles.addFolder}
                    onTouchTap={()=>this.openModal()}/>
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={dialogWidth}
                    title="New Folder"
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
        mainStore.toggleModals('addFolder');
        setTimeout(()=> this.folderNameText.select(), 300);
    }

    addFolder() {
        let id = this.props.params.id;
        let name = this.folderNameText.getValue();
        let parentKind = this.props.router.location.pathname.includes('project') ? Kind.DDS_PROJECT : Kind.DDS_FOLDER;
        if (this.state.floatingErrorText) {
            return null
        } else {
            mainStore.addFolder(id, parentKind, name);
            this.closeModal();
        }
    }

    closeModal() {
        mainStore.toggleModals('addFolder');
    }

    validateText(e) {
        this.setState({floatingErrorText: e.target.value ? '' : 'This field is required.'});
    }
}

let styles = {
    addFolder: {
        float: 'right'
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
    entityObj: object,
    toggleModal: object,
    screenSize: object
};

export default AddFolderModal;