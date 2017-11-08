import React, { PropTypes } from 'react';
const { object, string } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import { Kind } from '../../util/urlEnum';
import { Color } from '../../theme/customTheme';
import { Roles } from '../../enum';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

@observer
class AddFolderModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            floatingErrorText: ''
        }
    }

    render() {
        const { projectRole, screenSize, toggleModal } = mainStore;
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
            projectRole !== null && projectRole !== Roles.file_downloader && projectRole !== Roles.project_viewer ? <div>
                <RaisedButton
                    label="New Folder"
                    labelStyle={{color: Color.blue}}
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
            </div> : null
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

const styles = {
    addFolder: {
        float: 'right'
    },
    dialogStyles: {
        textAlign: 'center',
        fontColor: Color.dkBlue,
        zIndex: '9996'
    },
    textStyles: {
        textAlign: 'left',
        fontColor: Color.dkBlue
    }
};

AddFolderModal.contextTypes = {
    muiTheme: React.PropTypes.object
};

AddFolderModal.propTypes = {
    projectRole: string,
    toggleModal: object,
    screenSize: object
};

export default AddFolderModal;