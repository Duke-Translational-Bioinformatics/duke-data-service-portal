import React from 'react';
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import { Path } from '../../../util/urlEnum';
import MoveItemModal from '../globalComponents/moveItemModal.jsx';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

@observer
class FileOptions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            floatingErrorText: ''
        }
    }

    render() {
        const {entityObj, screenSize, selectedEntity, toggleModal} = mainStore;
        let dltOpen = toggleModal && toggleModal.id === 'dltFile' ? toggleModal.open : false;
        let editOpen = toggleModal && toggleModal.id === 'editFile' ? toggleModal.open : false;
        let moveOpen = toggleModal && toggleModal.id === 'moveItem' ? toggleModal.open : false;
        let id = selectedEntity !== null ? selectedEntity.id : entityObj !== null ? entityObj.id : null;
        let parentId = selectedEntity !== null ? selectedEntity.parent.id : entityObj !== null ? entityObj.parent.id : null;
        let parentKind = selectedEntity !== null ? selectedEntity.parent.kind : entityObj !== null ? entityObj.parent.kind : null;
        let fileName = selectedEntity !== null ? selectedEntity.name : null;
        if(fileName === null) fileName = entityObj && entityObj !== null ? entityObj.name : null;
        let dialogWidth = screenSize.width < 580 ? {width: '100%'} : {};
        const deleteActions = [
            <FlatButton
                label="CANCEL"
                secondary={true}
                onTouchTap={() => this.handleClose('dltFile')}/>,
            <FlatButton
                label="DELETE"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.handleDeleteButton(id, parentId, parentKind)}/>
        ];
        const editActions = [
            <FlatButton
                label="CANCEL"
                secondary={true}
                onTouchTap={() => this.handleClose('editFile')}/>,
            <FlatButton
                label="UPDATE"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.handleUpdateButton(id)}/>
        ];
        const moveActions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={() => this.handleClose('moveItem')}/>
        ];

        return (
            <div>
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={dialogWidth}
                    title="Are you sure you want to delete this file?"
                    autoDetectWindowHeight={true}
                    actions={deleteActions}
                    onRequestClose={() => this.handleClose()}
                    open={dltOpen}>
                    <i className="material-icons" style={styles.warning}>warning</i>
                    <p style={{textAlign: 'left'}}>You will lose access to any versions associated with this file. If you want to delete just one version of this file,
                        please navigate to the version you want to delete by clicking on the file versions button.</p>
                </Dialog>
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={dialogWidth}
                    title="Edit File Name"
                    autoDetectWindowHeight={true}
                    actions={editActions}
                    onRequestClose={() => this.handleClose()}
                    open={editOpen}>
                    <form action="#" id="editFileForm">
                        <TextField
                            style={styles.textStyles}
                            autoFocus={true}
                            onFocus={()=>this.selectText()}
                            hintText="File Name"
                            defaultValue={fileName}
                            errorText={this.state.floatingErrorText}
                            floatingLabelText="File Name"
                            ref={(input) => this.fileNameText = input}
                            type="text"
                            multiLine={true}
                            onChange={(e)=>this.validateText(e)}/> <br/>
                    </form>
                </Dialog>
                <Dialog
                    {...this.props}
                    style={styles.dialogStyles}
                    contentStyle={dialogWidth}
                    title="Select Destination"
                    autoDetectWindowHeight={true}
                    actions={moveActions}
                    open={moveOpen}
                    onRequestClose={() => this.handleCloseMoveModal(id)}>
                    <MoveItemModal {...this.props}/>
                </Dialog>
            </div>
        );
    };

    toggleModal(id) {
        mainStore.toggleModals(id);
    }

    handleDeleteButton(id, parentId, parentKind) {
        let urlPath = parentKind === 'dds-project' ? '/project/' : '/folder/';
        mainStore.deleteFile(id, parentId, parentKind);
        this.handleClose('dltFile');
        setTimeout(()=>this.props.router.push(urlPath + parentId), 500)
    }

    handleUpdateButton(id) {
        let fileName = this.fileNameText.getValue();
        if (this.state.floatingErrorText != '') {
            return null
        } else {
            mainStore.editItem(id, fileName, Path.FILE);
            this.handleClose('editFile');
        }
    }

    handleCloseMoveModal(id) {
        mainStore.getEntity(id, Path.FILE);
        mainStore.toggleModals('moveItem');
    }

    handleClose(id) {
        mainStore.toggleModals(id);
    }

    selectText() {
        setTimeout(()=>this.fileNameText.select(),100);
    }

    validateText(e) {
        this.setState({
            floatingErrorText: e.target.value ? '' : 'This field is required'
        });
    }
}
var styles = {
    deleteFile: {
        float: 'right',
        position: 'relative',
        margin: '12px 8px 0px 0px'
    },
    dialogStyles: {
        textAlign: 'center',
        fontColor: '#303F9F',
        zIndex: '9999'
    },
    textStyles: {
        textAlign: 'left',
        fontColor: '#303F9F'
    },
    warning: {
        fontSize: 48,
        textAlign: 'center',
        color: '#F44336'
    }
};

export default FileOptions;
