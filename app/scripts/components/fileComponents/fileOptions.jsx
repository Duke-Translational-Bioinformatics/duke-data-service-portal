import React from 'react';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import {Kind, Path} from '../../../util/urlEnum';
import MoveItemModal from '../globalComponents/moveItemModal.jsx';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

class FileOptions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            floatingErrorText: ''
        }
    }

    render() {
        let dltOpen = this.props.toggleModal && this.props.toggleModal.id === 'dltFile' ? this.props.toggleModal.open : false;
        let editOpen = this.props.toggleModal && this.props.toggleModal.id === 'editFile' ? this.props.toggleModal.open : false;
        let moveOpen = this.props.toggleModal && this.props.toggleModal.id === 'moveItem' ? this.props.toggleModal.open : false;
        let fileName = this.props.selectedEntity !== null ? this.props.selectedEntity.name : null;
        if(fileName === null) fileName = this.props.entityObj && this.props.entityObj !== null ? this.props.entityObj.name : null;
        let dialogWidth = this.props.screenSize.width < 580 ? {width: '100%'} : {};
        const deleteActions = [
            <FlatButton
                label="CANCEL"
                secondary={true}
                onTouchTap={() => this.handleClose('dltFile')}/>,
            <FlatButton
                label="DELETE"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.handleDeleteButton()}/>
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
                onTouchTap={() => this.handleUpdateButton()}/>
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
                    onRequestClose={() => this.handleCloseMoveModal()}>
                    <MoveItemModal {...this.props}/>
                </Dialog>
            </div>
        );
    };

    toggleModal(id) {
        ProjectActions.toggleModals(id);
    }

    handleDeleteButton() {
        let id = this.props.selectedEntity !== null ? this.props.selectedEntity.id : this.props.entityObj.id;
        let parentId = this.props.selectedEntity !== null ? this.props.selectedEntity.parent.id : this.props.entityObj.parent.id;
        let parentKind = this.props.selectedEntity !== null ? this.props.selectedEntity.parent.kind :  this.props.entityObj.parent.kind;
        let urlPath = '';
        parentKind === 'dds-project' ? urlPath = '/project/' : urlPath = '/folder/';
        ProjectActions.deleteFile(id, parentId, parentKind);
        this.handleClose('dltFile');
        setTimeout(()=>this.props.router.push(urlPath + parentId), 500)
    }

    handleUpdateButton() {
        let id = this.props.selectedEntity !== null ? this.props.selectedEntity.id : this.props.entityObj.id;
        let fileName = this.fileNameText.getValue();
        if (this.state.floatingErrorText != '') {
            return null
        } else {
            ProjectActions.editItem(id, fileName, Path.FILE, Kind.DDS_FILE);
            this.handleClose('editFile');
        }
    }

    handleCloseMoveModal() {
        let id = this.props.selectedEntity !== null ? this.props.selectedEntity.id : this.props.entityObj.id;
        let kind = 'files';
        ProjectActions.getEntity(id, kind);
        ProjectActions.toggleModals('moveItem');
    }

    handleClose(id) {
        ProjectActions.toggleModals(id);
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
