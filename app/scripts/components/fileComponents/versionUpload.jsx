import React from 'react';
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

@observer
class VersionUpload extends React.Component {

    render() {
        const {entityObj, toggleModal, screenSize, selectedEntity} = mainStore;
        let dialogWidth = screenSize.width < 580 ? {width: '100%'} : {};
        let open = toggleModal && toggleModal.id === 'newVersionModal' ? toggleModal.open : false;
        let fileId = selectedEntity !== null ? selectedEntity.id : entityObj !== null ? entityObj.id : null;
        let parentId = selectedEntity !== null ?  selectedEntity.parent.id : entityObj !== null ? entityObj.parent.id : null;
        let projectId = entityObj ? entityObj.ancestors[0].id : selectedEntity !== null ? selectedEntity.ancestors[0].id : null;
        let parentKind = entityObj ? entityObj.parent.kind : selectedEntity !== null ? selectedEntity.parent.kind : null;

        let standardActions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={() => this.handleClose()} />,
            <FlatButton
                label="Submit"
                secondary={true}
                onTouchTap={() => this.handleUploadButton(fileId, parentId, projectId, parentKind)} />
        ];
        return (
            <div style={styles.fileUpload}>
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={dialogWidth}
                    title='Upload New Version'
                    autoDetectWindowHeight={true}
                    actions={standardActions}
                    onRequestClose={this.handleClose.bind(this)}
                    open={open}>
                    <form action='#' id='newFileForm'>
                        <div className="mdl-cell mdl-cell--6-col mdl-textfield mdl-textfield--file">
                            <textarea className="mdl-textfield__input mdl-color-text--grey-800" placeholder="File" type="text" ref={(input) => this.fileList = input} rows="3" readOnly></textarea>
                            <div className="mdl-button mdl-button--icon mdl-button--file">
                                <i className="material-icons" style={styles.iconColor}>attach_file</i>
                                <input type='file' ref={(input) => this.fileInput = input} onChange={this.handleFileName.bind(this)} />
                            </div>
                        </div> <br/>
                        <TextField
                            style={styles.textStyles}
                            hintText="Optional Label"
                            floatingLabelText="Label"
                            ref={(input) => this.labelText = input}
                            type="text"
                            multiLine={true}/> <br/>
                    </form>
                </Dialog>
            </div>
        );
    }

    handleUploadButton(fileId, ParentId, projectId, parentKind) {
        if (this.fileInput.value) {
            //let projId = '';
            //let parentKind = '';
            //let fileId = this.props.selectedEntity !== null ? this.props.selectedEntity.id : this.props.entityObj.id;
            //let parentId = this.props.selectedEntity !== null ?  this.props.selectedEntity.parent.id : this.props.entityObj.parent.id;
            let fileList = this.fileInput.files;
            for (var i = 0; i < fileList.length; i++) {
                let blob = fileList[i];
                let label = this.labelText.value;
                //projId = this.props.entityObj ? this.props.entityObj.ancestors[0].id : this.props.selectedEntity.ancestors[0].id;
                //parentKind = this.props.entityObj ? this.props.entityObj.parent.kind : this.props.selectedEntity.parent.kind;
                ProjectActions.startUpload(projectId, blob, parentId, parentKind, label, fileId);
                ProjectActions.toggleModals('newVersionModal');
            }
        } else {
            return null
        }
    }

    handleFileName() {
        let fList = [];
        let fl = this.fileInput.files;
        for (var i = 0; i < fl.length; i++) {
            fList.push(fl[i].name);
            var fileList = fList.toString().split(',').join(', ');
        }
        this.fileList.value = 'Preparing to upload: ' + fileList;
    }

    handleClose() {
        ProjectActions.toggleModals('newVersionModal');
    }
}

var styles = {
    fileUpload: {
        float: 'right',
        position: 'relative',
        margin: '12px 8px 0px 0px'
    },
    iconColor: {
        color: '#235F9C'
    },
    dialogStyles: {
        zIndex: '9996',
        textAlign: 'center',
        fontColor: '#303F9F'
    },
    textStyles: {
        minWidth: '48%',
        textAlign: 'left',
        fontColor: '#303F9F'
    },
    floatingButton: {
        position: 'absolute',
        top: -50,
        marginRight: 17,
        right: '2%',
        zIndex: '2',
        color: '#ffffff'
    },
    msg: {
        textAlign: 'center',
        marginLeft: 30
    },
    warning: {
        fontSize: 48,
        textAlign: 'center',
        color: '#FFEB3B'
    }
};

VersionUpload.contextTypes = {
    muiTheme: React.PropTypes.object
};

export default VersionUpload;